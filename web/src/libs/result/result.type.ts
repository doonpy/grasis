import { CommonColumns, CommonResponse } from '../common/common.type';
import { Lecturer, LecturerForFastView } from '../lecturer/lecturer.type';
import { Student, StudentForFastView } from '../student/student.type';
import { Topic } from '../topic/topic.type';
import { ResultStatus, ResultType } from './result.resource';

export interface Result extends CommonColumns {
  id: number;
  topicId: number;
  studentId: number;
  creatorId: number;
  note: string | null;
  type: ResultType;
  point: ResultPoint[] | null;
  status: ResultStatus;
  topic: Topic;
  student: Student;
  creator: Lecturer;
}

export interface ResultPoint {
  title: string;
  rate: number;
  value: number | null;
}

export type ResultRequestBody = WithOptional<Pick<Result, 'point' | 'note'>, 'note'>;

export type ResultForView = Omit<
  Result,
  'topic' | 'studentId' | 'student' | 'creatorId' | 'creator'
> & {
  creator: LecturerForFastView;
  average: number;
};

export interface ResultGetByTopicIdForViewResponse extends CommonResponse {
  results: ResultOfStudentForView[];
}

export interface ResultPoint {
  title: string;
  rate: number;
  value: number | null;
}

export interface ResultOfStudentForView {
  student: StudentForFastView;
  instructor: ResultForView | null;
  review: ResultForView | null;
  defense: ResultForView[];
}

export interface UseResult {
  isLoading: boolean;
  data?: ResultGetByTopicIdForViewResponse;
}
