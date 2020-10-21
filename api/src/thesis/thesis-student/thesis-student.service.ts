import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Student } from '../../student/student.interface';
import { StudentService } from '../../student/student.service';
import { ThesisStudentEntity } from './thesis-student.entity';
import { ThesisStudent, ThesisStudentView } from './thesis-student.interface';

@Injectable()
export class ThesisStudentService {
  constructor(
    @InjectRepository(ThesisStudentEntity)
    private readonly thesisStudentRepository: Repository<ThesisStudent>,
    private readonly studentService: StudentService
  ) {}

  public async createWithTransaction(
    manager: EntityManager,
    thesisId: number,
    studentIds: number[]
  ): Promise<void> {
    if (!Array.isArray(studentIds)) {
      return;
    }

    studentIds = studentIds.filter(
      (studentId, index) => index === studentIds.lastIndexOf(studentId)
    );
    for (const studentId of studentIds) {
      await this.studentService.checkStudentExistByIdTransaction(manager, studentId);
      const thesisStudentEntity = manager.create<ThesisStudent>(ThesisStudentEntity, {
        thesis: thesisId,
        student: studentId
      });
      await manager.save<ThesisStudent>(thesisStudentEntity);
    }
  }

  public async findByThesisId(thesisId: number): Promise<ThesisStudentView> {
    const thesisStudents = await this.thesisStudentRepository.find({
      where: { thesis: thesisId },
      cache: true
    });
    const lecturerIds = thesisStudents.map((thesisStudent) => thesisStudent.student as number);
    const lecturers = await this.studentService.getByIds(lecturerIds);

    return this.convertToView(lecturers);
  }

  public convertToView(students: Student[]): ThesisStudentView {
    return students.map((student) => {
      const { id, firstname, lastname, status } = this.studentService.convertToView({ student });
      return {
        id,
        firstname,
        lastname,
        status
      };
    });
  }
}
