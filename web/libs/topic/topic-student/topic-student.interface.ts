import { CommonColumns } from '../../common/common.interface';
import { Student } from '../../student/student.interface';
import { Topic } from '../topic.interface';
import { TopicStudentStatus } from './topic-student.resource';

export interface TopicStudent extends CommonColumns {
  topicId: number;
  studentId: number;
  status: TopicStudentStatus;
  topic: Topic;
  student: Student;
}
