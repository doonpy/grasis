export const THESIS_PATH_ROOT = '/thesis';

export enum ThesisState {
  LECTURER_TOPIC_REGISTER = 1,
  STUDENT_TOPIC_REGISTER = 2,
  PROGRESS_REPORT = 3,
  REVIEW = 4,
  DEFENSE = 5,
  FINISH = 6
}

export enum ThesisStatus {
  INACTIVE = 1,
  ACTIVE = 2
}

export enum ThesisApi {
  ROOT = '/theses',
  ADMIN = '/admin/theses'
}

export enum ThesisAttendeeTarget {
  LECTURER = 1,
  STUDENT = 2
}

export const ThesisAttendeeSelectTerminology = {
  LECTURER: {
    LABEL: 'Giảng viên hướng dẫn',
    FIELD_NAME: 'lecturers'
  },
  STUDENT: {
    LABEL: 'Sinh viên thực hiện',
    FIELD_NAME: 'students'
  }
};
