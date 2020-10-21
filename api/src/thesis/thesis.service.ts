import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Connection, Repository } from 'typeorm';

import { COMMON_COLUMN } from '../common/common.resource';
import { Lecturer } from '../lecturer/lecturer.interface';
import { LecturerService } from '../lecturer/lecturer.service';
import { StudentService } from '../student/student.service';
import { ThesisLecturerService } from './thesis-lecturer/thesis-lecturer.service';
import { ThesisStudentService } from './thesis-student/thesis-student.service';
import { ThesisEntity } from './thesis.entity';
import { CreatorView, Thesis, ThesisRequestBody, ThesisView } from './thesis.interface';
import { THESIS_COLUMN, THESIS_ERROR } from './thesis.resource';

@Injectable()
export class ThesisService {
  constructor(
    @InjectRepository(ThesisEntity) private readonly thesisRepository: Repository<Thesis>,
    private readonly connection: Connection,
    private readonly lecturerService: LecturerService,
    private readonly studentService: StudentService,
    private readonly thesisLecturerService: ThesisLecturerService,
    private readonly thesisStudentService: ThesisStudentService
  ) {}

  public async getMany(offset: number, limit: number): Promise<Thesis[]> {
    return this.thesisRepository.find({
      skip: offset,
      take: limit,
      cache: true
    });
  }

  public async getAmount(): Promise<number> {
    return this.thesisRepository.count();
  }

  public async create(data: ThesisRequestBody): Promise<Thesis> {
    return this.connection.transaction(async (manager) => {
      const { lecturers, students, ...thesis } = data;
      this.validateThesisStateDate(thesis as Thesis);
      const creator = data.creator;
      await this.lecturerService.checkLecturerExistByIdTransaction(manager, creator as number);

      const thesisEntity = manager.create<Thesis>(ThesisEntity, thesis);
      const createdThesis = await manager.save<Thesis>(thesisEntity);
      await this.thesisLecturerService.createWithTransaction(manager, createdThesis.id, lecturers);
      await this.thesisStudentService.createWithTransaction(manager, createdThesis.id, students);

      return createdThesis;
    });
  }

  private validateThesisStateDate(thesis: Thesis): void {
    if (!this.isValidStartAndEndTime(thesis)) {
      throw new BadRequestException(THESIS_ERROR.ERR_6);
    }

    if (!this.isValidLecturerTopicRegister(thesis)) {
      throw new BadRequestException(THESIS_ERROR.ERR_1);
    }

    if (!this.isValidStudentTopicRegister(thesis)) {
      throw new BadRequestException(THESIS_ERROR.ERR_2);
    }

    if (!this.isValidProgressReport(thesis)) {
      throw new BadRequestException(THESIS_ERROR.ERR_3);
    }

    if (!this.isValidReview(thesis)) {
      throw new BadRequestException(THESIS_ERROR.ERR_4);
    }

    if (!this.isValidDefense(thesis)) {
      throw new BadRequestException(THESIS_ERROR.ERR_5);
    }
  }

  private isValidStartAndEndTime(thesis: Thesis): boolean {
    const { startTime, endTime } = thesis;

    return !(moment.utc(startTime).unix() > moment.utc(endTime).unix());
  }

  private isValidLecturerTopicRegister(thesis: Thesis): boolean {
    const {
      lecturerTopicRegister,
      studentTopicRegister,
      progressReport,
      review,
      defense,
      startTime,
      endTime
    } = thesis;

    return !(
      moment.utc(lecturerTopicRegister).unix() < moment.utc(startTime).unix() ||
      moment.utc(lecturerTopicRegister).unix() >= moment.utc(endTime).unix() ||
      moment.utc(lecturerTopicRegister).unix() >= moment.utc(studentTopicRegister).unix() ||
      moment.utc(lecturerTopicRegister).unix() >= moment.utc(progressReport).unix() ||
      moment.utc(lecturerTopicRegister).unix() >= moment.utc(review).unix() ||
      moment.utc(lecturerTopicRegister).unix() >= moment.utc(defense).unix()
    );
  }

  private isValidStudentTopicRegister(thesis: Thesis): boolean {
    const {
      lecturerTopicRegister,
      studentTopicRegister,
      progressReport,
      review,
      defense,
      startTime,
      endTime
    } = thesis;

    return !(
      moment.utc(studentTopicRegister).unix() < moment.utc(startTime).unix() ||
      moment.utc(studentTopicRegister).unix() >= moment.utc(endTime).unix() ||
      moment.utc(studentTopicRegister).unix() < moment.utc(lecturerTopicRegister).unix() ||
      moment.utc(studentTopicRegister).unix() >= moment.utc(progressReport).unix() ||
      moment.utc(studentTopicRegister).unix() >= moment.utc(review).unix() ||
      moment.utc(studentTopicRegister).unix() >= moment.utc(defense).unix()
    );
  }

  private isValidProgressReport(thesis: Thesis): boolean {
    const {
      lecturerTopicRegister,
      studentTopicRegister,
      progressReport,
      review,
      defense,
      startTime,
      endTime
    } = thesis;

    return !(
      moment.utc(progressReport).unix() < moment.utc(startTime).unix() ||
      moment.utc(progressReport).unix() >= moment.utc(endTime).unix() ||
      moment.utc(progressReport).unix() < moment.utc(lecturerTopicRegister).unix() ||
      moment.utc(progressReport).unix() < moment.utc(studentTopicRegister).unix() ||
      moment.utc(progressReport).unix() >= moment.utc(review).unix() ||
      moment.utc(progressReport).unix() >= moment.utc(defense).unix()
    );
  }

  private isValidReview(thesis: Thesis): boolean {
    const {
      lecturerTopicRegister,
      studentTopicRegister,
      progressReport,
      review,
      defense,
      startTime,
      endTime
    } = thesis;

    return !(
      moment.utc(review).unix() < moment.utc(startTime).unix() ||
      moment.utc(review).unix() >= moment.utc(endTime).unix() ||
      moment.utc(review).unix() < moment.utc(lecturerTopicRegister).unix() ||
      moment.utc(review).unix() < moment.utc(studentTopicRegister).unix() ||
      moment.utc(review).unix() < moment.utc(progressReport).unix() ||
      moment.utc(review).unix() >= moment.utc(defense).unix()
    );
  }

  private isValidDefense(thesis: Thesis): boolean {
    const {
      lecturerTopicRegister,
      studentTopicRegister,
      progressReport,
      review,
      defense,
      startTime,
      endTime
    } = thesis;

    return !(
      moment.utc(defense).unix() < moment.utc(startTime).unix() ||
      moment.utc(defense).unix() >= moment.utc(endTime).unix() ||
      moment.utc(defense).unix() < moment.utc(lecturerTopicRegister).unix() ||
      moment.utc(defense).unix() < moment.utc(studentTopicRegister).unix() ||
      moment.utc(defense).unix() < moment.utc(progressReport).unix() ||
      moment.utc(defense).unix() < moment.utc(review).unix()
    );
  }

  public async getById(id: number): Promise<any> {
    const findThesis = this.thesisRepository.findOne(id, {
      cache: true,
      relations: [THESIS_COLUMN.CREATOR, `${THESIS_COLUMN.CREATOR}.${COMMON_COLUMN.ID}`]
    });
    const findThesisLecturer = this.thesisLecturerService.findByThesisId(id);
    const findThesisStudent = this.thesisStudentService.findByThesisId(id);
    const [thesis, lecturers, students] = await Promise.all([
      findThesis,
      findThesisLecturer,
      findThesisStudent
    ]);

    if (!thesis) {
      throw new BadRequestException(THESIS_ERROR.ERR_7);
    }

    const thesisView = this.convertToView(thesis);

    return { thesis: thesisView, lecturers, students };
  }

  public convertToView(thesis: Thesis): ThesisView {
    const { id, firstname, lastname, status } = this.lecturerService.convertToView({
      lecturer: thesis.creator as Lecturer
    });
    const creatorView: CreatorView = {
      id,
      firstname,
      lastname,
      status
    };

    const thesisView: ThesisView = { ...thesis, creatorView };
    delete thesisView?.creator;

    return thesisView;
  }
}
