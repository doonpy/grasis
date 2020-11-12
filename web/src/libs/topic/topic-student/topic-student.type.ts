import { CommonColumns } from '../../common/common.type';
import { Student } from '../../student/student.type';
import { Topic } from '../topic.type';
import { TopicStudentStatus } from './topic-student.resource';

export interface TopicStudent extends CommonColumns {
  topicId: number;
  studentId: number;
  status: TopicStudentStatus;
  topic: Topic;
  student: Student;
}
