import { CommonColumns, CommonFindManyResponse, CommonResponse } from '../common/common.interface';
import { UserForListView } from '../user/user.interface';
import { StudentEntity } from './student.entity';

export type Student = StudentEntity;

export type StudentRequestBody = WithOptional<
  Omit<Student, keyof CommonColumns | 'id' | 'theses' | 'user'>,
  'studentId' | 'studentClass' | 'schoolYear' | 'isGraduate'
>;

export interface StudentFindManyResponse extends CommonFindManyResponse {
  students: StudentForListView[];
}

export interface StudentFindByIdResponse extends CommonResponse {
  student: Student;
}

export interface StudentCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface StudentSearchAttendee {
  id: number;
  attendeeId: string | null;
  fullName: string;
  schoolYear: string | null;
  studentClass: string | null;
}

export interface StudentSearchAttendeesResponse extends CommonResponse {
  result: StudentSearchAttendee[];
}

export type StudentForListView = Pick<Student, 'id' | 'studentId'> & UserForListView;
