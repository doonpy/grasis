import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindConditions, Repository } from 'typeorm';

import { ReportModule } from '../common/common.resource';
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
    const user = await this.userService.getById(creatorId);
    await this.topicService.checkPermission(data.topicId, user);
    if (data.mode === CommentMode.PRIVATE && user.userType === UserType.STUDENT) {
      throw new BadRequestException(CommentError.ERR_1);
    }

    const commentEntity = this.commentRepository.create({
      ...data,
      creatorId
    });

    const comment = await this.commentRepository.save(commentEntity);
    comment.creator = user;

    return comment;
  }

  public async getManyForView(
    topicId: number,
    userId: number,
    module: ReportModule,
    offset: number,
    limit: number
  ): Promise<CommentForView[]> {
    const user = await this.userService.getById(userId);
    await this.topicService.checkPermission(topicId, user);
    const conditions: FindConditions<Comment> = {
      topicId,
      module
    };
    if (user.userType === UserType.STUDENT) {
      conditions.mode = CommentMode.PUBLIC;
    }

    return (
      await this.commentRepository.find({
        relations: ['creator'],
        where: conditions,
        cache: true,
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      })
    ).map((comment) => this.convertForView(comment));
  }

  public async getAmount(topicId: number, userId: number, module: ReportModule): Promise<number> {
    const user = await this.userService.getById(userId);
    await this.topicService.checkPermission(topicId, user);
    const conditions: FindConditions<Comment> = {
      topicId,
      module
    };
    if (user.userType === UserType.STUDENT) {
      conditions.mode = CommentMode.PUBLIC;
    }

    return await this.commentRepository.count(conditions);
  }

  public async deleteById(id: number, userId: number): Promise<void> {
    const comment = await this.getById(id);
    await this.topicService.checkPermission(comment.topicId, userId);
    if (comment.creatorId !== userId) {
      throw new BadRequestException(CommentError.ERR_3);
    }

    await this.commentRepository.update(id, { deletedAt: new Date() });
  }

  public async getById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ id }, { cache: true });
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
    await manager.update(CommentEntity, { topicId }, { deletedAt });
  }

  public convertForView({ id, content, createdAt, mode, creator }: Comment): CommentForView {
    return {
      id,
      content,
      createdAt,
      mode,
      creatorInfo: this.userService.convertToCommentView(creator)
    };
  }
}
