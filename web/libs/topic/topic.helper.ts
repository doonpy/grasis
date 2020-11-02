import { TopicStudent } from './topic-student/topic-student.interface';

export function sortByStudentRegisterStatus(a: TopicStudent, b: TopicStudent): number {
  if (a.status < b.status) {
    return -1;
  }
  if (a.status > b.status) {
    return 1;
  }
  return 0;
}
