import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { ThesisState } from '../thesis/thesis.resource';
import { TopicService } from '../topic/topic.service';
import { UserType } from '../user/user.resource';
import { UserService } from '../user/user.service';
import { CommentEntity } from './comment.entity';
import { CommentError, CommentMode } from './comment.resource';
import { Comment, CommentForView, CommentRequestBody } from './comment.type';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService
  ) {}

  public async create(creatorId: number, data: CommentRequestBody): Promise<Comment> {
    const user = await this.userService.findById(creatorId);
    await this.topicService.checkPermission(data.topicId, user);
    if (data.mode === CommentMode.PRIVATE && user.userType === UserType.STUDENT) {
      throw new BadRequestException(CommentError.ERR_1);
    }

    const commentEntity = this.commentRepository.create({
      ...data,
      creatorId
    });

    return this.commentRepository.save(commentEntity);
  }

  public async getManyForView(
    topicId: number,
    userId: number,
    state: ThesisState,
    offset: number,
    limit: number
  ): Promise<CommentForView[]> {
    const user = await this.userService.findById(userId);
    await this.topicService.checkPermission(topicId, user);
    const conditions: FindOptionsWhere<Comment> = {
      ...notDeleteCondition,
      topicId,
      state
    };
    if (user.userType === UserType.STUDENT) {
      conditions.mode = CommentMode.PUBLIC;
    }

    return (
      await this.commentRepository.find({
        relations: { creator: true },
        where: conditions,
        cache: true,
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      })
    ).map(({ id, content, createdAt, mode, creator }) => ({
      id,
      content,
      createdAt,
      mode,
      creatorInfo: this.userService.convertToCommentView(creator)
    }));
  }

  public async getAmount(topicId: number, userId: number, state: ThesisState): Promise<number> {
    const user = await this.userService.findById(userId);
    await this.topicService.checkPermission(topicId, user);
    const conditions: FindOptionsWhere<Comment> = {
      ...notDeleteCondition,
      topicId,
      state
    };
    if (user.userType === UserType.STUDENT) {
      conditions.mode = CommentMode.PUBLIC;
    }

    return await this.commentRepository.count(conditions);
  }

  public async deleteById(id: number, userId: number): Promise<void> {
    const comment = await this.getById(id);
    const user = await this.userService.findById(userId);
    await this.topicService.checkPermission(comment.topicId, user);
    if (comment.creatorId !== userId) {
      throw new BadRequestException(CommentError.ERR_3);
    }

    await this.commentRepository.update(id, { deletedAt: new Date() });
  }

  public async getById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      { ...notDeleteCondition, id },
      { cache: true }
    );
    if (!comment) {
      throw new BadRequestException(CommentError.ERR_2);
    }

    return comment;
  }

  public async deleteByTopicIdWithTransaction(
    manager: EntityManager,
    topicId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(CommentEntity, { ...notDeleteCondition, topicId }, { deletedAt });
  }
}
