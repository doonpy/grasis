import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindConditions, Like, Repository } from 'typeorm';

import { LecturerService } from '../lecturer/lecturer.service';
import { ThesisLecturerService } from '../thesis/thesis-lecturer/thesis-lecturer.service';
import { ThesisService } from '../thesis/thesis.service';
import { CouncilEntity } from './council.entity';
import { CouncilError } from './council.resource';
import {
  Council,
  CouncilForView,
  CouncilRequestBody,
  CouncilSearchInThesisByName
} from './council.type';

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
    this.thesisService.checkThesisIsActive(thesis.status);
    await this.validateMember(data);
    const entity = this.councilRepository.create(data);
    const council = await this.councilRepository.save(entity);
    council.chairman = await this.lecturerService.getById(council.chairmanId);
    council.instructor = await this.lecturerService.getById(council.instructorId);
    council.commissioner = await this.lecturerService.getById(council.commissionerId);

    return council;
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

  public async getById(id: number, includeRelation?: boolean): Promise<Council> {
    const council = await this.councilRepository.findOne(
      { id },
      {
        relations: includeRelation
          ? [
              'chairman',
              'chairman.user',
              'instructor',
              'instructor.user',
              'commissioner',
              'commissioner.user'
            ]
          : [],
        cache: true
      }
    );
    if (!council) {
      throw new BadRequestException(CouncilError.ERR_4);
    }

    return council;
  }

  public async getManyByThesisId(
    offset: number,
    limit: number,
    thesisId: number,
    keyword?: string
  ): Promise<Council[]> {
    await this.thesisService.checkExistById(thesisId);
    const conditions: FindConditions<Council> = { thesisId };
    if (keyword) {
      conditions.name = Like(`%${keyword}%`);
    }

    return this.councilRepository.find({
      relations: [
        'chairman',
        'chairman.user',
        'instructor',
        'instructor.user',
        'commissioner',
        'commissioner.user'
      ],
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
    const conditions: FindConditions<Council> = { thesisId };
    if (keyword) {
      conditions.name = Like(`%${keyword}%`);
    }

    return this.councilRepository.count(conditions);
  }

  public async updateById(id: number, data: CouncilRequestBody, userId: number): Promise<Council> {
    const council = await this.getById(id, true);
    const thesis = await this.thesisService.getById(council.thesisId);
    await this.thesisService.checkPermission(thesis, userId);
    this.thesisService.checkThesisIsActive(thesis.status);
    await this.validateMember(data);

    return this.councilRepository.save({ ...council, ...data });
  }

  public async deleteById(id: number, userId: number): Promise<void> {
    const council = await this.getById(id);
    const thesis = await this.thesisService.getById(council.thesisId);
    await this.thesisService.checkPermission(thesis, userId);
    this.thesisService.checkThesisIsActive(thesis.status);

    await this.councilRepository.update(id, { deletedAt: new Date() });
  }

  public async deleteByThesisIdWithTransaction(
    manager: EntityManager,
    thesisId: number,
    deletedAt = new Date()
  ): Promise<void> {
    await manager.update(CouncilEntity, { thesisId }, { deletedAt });
  }

  public async searchInThesisByName(
    thesisId: number,
    userId: number,
    keyword: string
  ): Promise<CouncilSearchInThesisByName[]> {
    await this.thesisService.checkPermission(thesisId, userId);
    const councils = await this.councilRepository.find({
      where: {
        thesisId,
        name: Like(`%${keyword}%`)
      },
      cache: true
    });

    return councils.map(({ id, name }) => ({
      id,
      name
    }));
  }

  public convertForView(council: Council): CouncilForView {
    return {
      ...council,
      chairman: council.chairman.convertToFastView(),
      instructor: council.instructor.convertToFastView(),
      commissioner: council.commissioner.convertToFastView()
    };
  }
}
