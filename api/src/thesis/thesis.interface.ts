import { CommonColumns, CommonResponse, WithOptional } from '../common/common.interface';
import { ThesisEntity } from './thesis.entity';

export type Thesis = ThesisEntity;

export type ThesisRequestBody = WithOptional<
  Omit<Thesis, keyof CommonColumns | 'id' | 'creator' | 'students' | 'lecturers'> &
    ThesisAttendeesRequestBody,
  keyof ThesisAttendeesRequestBody
>;

export interface ThesisAttendeesRequestBody {
  attendees: {
    lecturers: number[];
    students: number[];
  };
}

export interface ThesisGetManyResponse extends CommonResponse {
  thesisList: Thesis[];
  total: number;
}

export interface ThesisCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface ThesisGetByIdResponse extends CommonResponse {
  thesis?: Thesis;
}

export type RawThesisRequestBody = {
  [K in keyof ThesisRequestBody]?: any;
};
