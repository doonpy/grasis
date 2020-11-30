import { LecturerForFastView } from '../lecturer/lecturer.type';
import { StudentForFastView } from '../student/student.type';
import { ResultEntity } from './result.entity';

export type Result = ResultEntity;

export type ResultRequestBody = WithOptional<Pick<Result, 'point' | 'note'>, 'note'>;

export type ResultForView = Omit<
  Result,
  'topic' | 'studentId' | 'student' | 'creatorId' | 'creator'
> & {
  creator: LecturerForFastView;
  average: number;
};

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

export type ResultInitialize = WithOptional<
  Pick<Result, 'topicId' | 'studentId' | 'creatorId' | 'type' | 'point'>,
  'point'
>;
