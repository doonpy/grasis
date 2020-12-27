import { CommonColumns, CommonResponse } from '../common/common.type';
import { LecturerForFastView } from '../lecturer/lecturer.type';
import { CouncilEntity } from './council.entity';

export type Council = CouncilEntity;

export type CouncilRequestBody = Pick<
  Council,
  'name' | 'thesisId' | 'chairmanId' | 'instructorId' | 'commissionerId'
>;

export type RawCouncilRequestBody = {
  [K in keyof CouncilRequestBody]?: string;
};

export type CouncilForView = Pick<Council, keyof CommonColumns | 'id' | 'thesisId' | 'name'> & {
  chairman: LecturerForFastView;
  instructor: LecturerForFastView;
  commissioner: LecturerForFastView;
};

export interface CouncilCreateOrUpdateResponse extends CommonResponse {
  council: CouncilForView;
}

export interface CouncilGetByIdForViewResponse extends CommonResponse {
  council: CouncilForView;
}

export interface CouncilGetManyByThesisIdForViewResponse extends CommonResponse {
  councils: CouncilForView[];
  total: number;
}

export type CouncilSearchInThesisByName = Pick<Council, 'id' | 'name'>;

export interface CouncilSearchInThesisByNameResponse extends CommonResponse {
  result: CouncilSearchInThesisByName[];
}
