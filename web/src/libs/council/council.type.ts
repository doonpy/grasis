import { CommonColumns, CommonResponse } from '../common/common.type';
import { Lecturer, LecturerForFastView } from '../lecturer/lecturer.type';

export interface Council extends CommonColumns {
  id: number;
  thesisId: number;
  name: string;
  chairmanId: number;
  chairman: Lecturer;
  instructorId: number;
  instructor: Lecturer;
  commissionerId: number;
  commissioner: Lecturer;
}

export type CouncilRequestBody = Pick<
  Council,
  'name' | 'thesisId' | 'chairmanId' | 'instructorId' | 'commissionerId'
>;

export type CouncilForView = Pick<Council, keyof CommonColumns | 'id' | 'name' | 'thesisId'> & {
  chairman: LecturerForFastView;
  instructor: LecturerForFastView;
  commissioner: LecturerForFastView;
};

export interface CouncilCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface CouncilGetByIdForViewResponse extends CommonResponse {
  council: CouncilForView;
}

export interface CouncilGetManyByThesisIdForViewResponse extends CommonResponse {
  councils: CouncilForView[];
  total: number;
}

export interface UseCouncils {
  isLoading: boolean;
  data?: CouncilGetManyByThesisIdForViewResponse;
}

export interface UseCouncil {
  isLoading: boolean;
  data?: CouncilGetByIdForViewResponse;
}
