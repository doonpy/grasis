import { INITIAL_USER } from '../user/user.resource';
import { StudentViewType } from './student.interface';

export const STUDENT_ADMIN_PATH_ROOT = '/admin/student';
export const STUDENT_PATH = {
  CREATE: `${STUDENT_ADMIN_PATH_ROOT}/create`
};

export const STUDENT_API = {
  ROOT: '/students',
  ADMIN: '/admin/students'
};

export const INITIAL_STUDENT: StudentViewType = {
  ...INITIAL_USER,
  studentId: null,
  schoolYear: null,
  studentClass: null,
  isGraduate: null,
  createdAt: null,
  updatedAt: null
};

export enum IsGraduate {
  FALSE = 0,
  TRUE = 1
}
