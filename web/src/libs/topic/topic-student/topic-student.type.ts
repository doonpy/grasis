import { CommonColumns, CommonResponse } from '../../common/common.type';
import { Student, StudentForFastView } from '../../student/student.type';
import { Topic } from '../topic.type';
import { TopicStudentStatus } from './topic-student.resource';

export interface TopicStudent extends CommonColumns {
  topicId: number;
  studentId: number;
  status: TopicStudentStatus;
  topic: Topic;
  student: Student;
}

export type TopicStudentForView = Pick<TopicStudent, 'status' | 'updatedAt' | 'topicId'> &
  StudentForFastView;

export interface TopicGetStudentsResponse extends CommonResponse {
  students: TopicStudentForView[];
}

export interface UseTopicStudents {
  data?: TopicGetStudentsResponse;
  isLoading: boolean;
}

export interface TopicRegisterResponse extends CommonResponse {
  student: TopicStudentForView;
}
