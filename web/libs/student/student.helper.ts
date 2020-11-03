import { Student } from './student.interface';

export function sortByStudentId(a: Student, b: Student): number {
  if (a.studentId < b.studentId) {
    return -1;
  }
  if (a.studentId > b.studentId) {
    return 1;
  }
  return 0;
}

export function sortBySchoolYear(a: Student, b: Student): number {
  if (a.schoolYear < b.schoolYear) {
    return -1;
  }
  if (a.schoolYear > b.schoolYear) {
    return 1;
  }
  return 0;
}

export function sortByClass(a: Student, b: Student): number {
  if (a.studentClass < b.studentClass) {
    return -1;
  }
  if (a.studentClass > b.studentClass) {
    return 1;
  }
  return 0;
}

export function sortByIsGraduate(a: Student, b: Student): number {
  if (a.isGraduate < b.isGraduate) {
    return -1;
  }
  if (a.isGraduate > b.isGraduate) {
    return 1;
  }
  return 0;
}
