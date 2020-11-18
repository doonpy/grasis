import { CommonResponse } from '../../common/common.type';
import { StudentForFastView } from '../../student/student.type';
import { TopicStudentEntity } from './topic_student.entity';

export type TopicStudent = TopicStudentEntity;

export type TopicStudentForView = Pick<TopicStudent, 'status' | 'updatedAt' | 'topicId'> &
  StudentForFastView;

export interface TopicGetStudentsResponse extends CommonResponse {
  students: TopicStudentForView[];
}
