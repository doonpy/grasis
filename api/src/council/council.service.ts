import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Like, Repository } from 'typeorm';

import { notDeleteCondition } from '../common/common.resource';
import { LecturerService } from '../lecturer/lecturer.service';
import { ThesisLecturerService } from '../thesis/thesis-lecturer/thesis-lecturer.service';
import { ThesisService } from '../thesis/thesis.service';
import { CouncilEntity } from './council.entity';
import { CouncilError } from './council.resource';
import { Council, CouncilForView, CouncilRequestBody } from './council.type';

@Injectable()
export class CouncilService {
  constructor(
    @InjectRepository(CouncilEntity) private readonly councilRepository: Repository<Council>,
    @Inject(forwardRef(() => ThesisService))
    private readonly thesisService: ThesisService,
    private readonly thesisLecturerService: ThesisLecturerService,
    @Inject(forwardRef(() => LecturerService))
    private readonly lecturerService: LecturerService
  ) {}

  public async create(data: CouncilRequestBody, userId: number): Promise<Council> {
    const thesis = await this.thesisService.getById(data.thesisId);
    await this.thesisService.checkPermission(thesis, userId);
    this.thesisService.checkThesisIsActive(thesis);
    await this.validateMember(data);

    const entity = this.councilRepository.create(data);
    return this.councilRepository.save(entity);
  }

  private async validateMember({
    chairmanId,
    instructorId,
    commissionerId,
    thesisId
  }: Council | CouncilRequestBody): Promise<void> {
    await this.lecturerService.checkExistedById(chairmanId);
    await this.lecturerService.checkExistedById(instructorId);
    await this.lecturerService.checkExistedById(commissionerId);

    if (
      chairmanId === instructorId ||
      chairmanId === commissionerId ||
      instructorId === commissionerId
    ) {
      throw new BadRequestException(CouncilError.ERR_5);
    }

    const thesisLecturerIds = (await this.thesisLecturerService.getByThesisId(thesisId)).map(
      ({ lecturerId }) => lecturerId
    );

    if (!thesisLecturerIds.includes(chairmanId)) {
      throw new BadRequestException(CouncilError.ERR_1);
    }

    if (!thesisLecturerIds.includes(instructorId)) {
      throw new BadRequestException(CouncilError.ERR_2);
    }

    if (!thesisLecturerIds.includes(commissionerId)) {
      throw new BadRequestException(CouncilError.ERR_3);
    }
  }

  public async getById(id: number): Promise<Council> {
    const council = await this.councilRepository.findOne(
      { ...notDeleteCondition, id },
      { cache: true }
    );
    if (!council) {
      throw new BadRequestException(CouncilError.ERR_4);
    }

    return council;
  }

  public async getByIdForView(id: number, userId: number): Promise<CouncilForView> {
    const council = await this.getById(id);
    await this.thesisService.checkPermission(council.thesisId, userId);
    const { chairmanId, instructorId, commissionerId, ...remain } = council;
    const chairman = await this.lecturerService.getById(chairmanId);
    const instructor = await this.lecturerService.getById(instructorId);
    const commissioner = await this.lecturerService.getById(commissionerId);

    return {
      ...remain,
      chairman: chairman.convertToFastView(),
      instructor: instructor.convertToFastView(),
      commissioner: commissioner.convertToFastView()
    };
  }

  public async getManyByThesisId(
    offset: number,
    limit: number,
    thesisId: number,
    keyword?: string
  ): Promise<Council[]> {
    await this.thesisService.checkExistById(thesisId);
    const conditions: FindOptionsWhere<Council> = { ...notDeleteCondition, thesisId };
    if (keyword) {
      conditions.name = Like(`%${keyword}%`);
    }

    return this.councilRepository.find({
      relations: {
        chairman: { user: true },
        instructor: { user: true },
        commissioner: { user: true }
      },
      where: conditions,
      take: limit,
      skip: offset,
      cache: true
    });
  }

  public async getManyByThesisIdForView(
    offset: number,
    limit: number,
    thesisId: number,
    userId: number,
    keyword?: string
  ): Promise<CouncilForView[]> {
    await this.thesisService.checkPermission(thesisId, userId);
    const councils = await this.getManyByThesisId(offset, limit, thesisId, keyword);

    return councils.map(
      ({
        id,
        createdAt,
        updatedAt,
        deletedAt,
        name,
        thesisId,
        chairman,
        instructor,
        commissioner
      }) => ({
        id,
        createdAt,
        updatedAt,
        deletedAt,
        thesisId,
        name,
        chairman: chairman.convertToFastView(),
        instructor: instructor.convertToFastView(),
        commissioner: commissioner.convertToFastView()
      })
    );
  }

  public async getAmountByThesisId(thesisId: number, keyword?: string): Promise<number> {
    await this.thesisService.checkExistById(thesisId);
    const conditions: FindOptionsWhere<Council> = { ...notDeleteCondition, thesisId };
    if (keyword) {
      conditions.name = Like(`%${keyword}%`);
    }

    return this.councilRepository.count(conditions);
  }

  public async updateById(id: number, data: CouncilRequestBody, userId: number): Promise<void> {
    const council = await this.getById(id);
    const thesis = await this.thesisService.getById(council.thesisId);
    await this.thesisService.checkPermission(thesis, userId);
    this.thesisService.checkThesisIsActive(thesis);
    await this.validateMember(data);

    await this.councilRepository.update(id, { ...council, ...data });
  }

  public async deleteById(id: number, userId: number): Promise<void> {
    const council = await this.getById(id);
    const thesis = await this.thesisService.getById(council.thesisId);
    await this.thesisService.checkPermission(thesis, userId);
    this.thesisService.checkThesisIsActive(thesis);

    await this.councilRepository.update(id, { deletedAt: new Date() });
  }

  public async deleteByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(CouncilEntity, { ...notDeleteCondition, thesisId }, { deletedAt });
  }
}
