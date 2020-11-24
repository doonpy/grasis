import { CommonColumns, CommonResponse } from '../common/common.type';
import { Council } from '../council/council.type';
import { TopicStateBase, TopicStateBaseForView } from '../topic/topic-state/topic-state.type';

export interface Defense extends TopicStateBase {
  councilId: number | null;
  council: Council | null;
}

export type DefenseRequestBody = WithOptional<
  Omit<Defense, keyof CommonColumns | 'council' | 'topic'>,
  'note' | 'place' | 'councilId'
>;

export interface DefenseCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface DefenseGetByIdResponse extends CommonResponse {
  defense: DefenseForView | null;
}

export type DefenseForView = Omit<TopicStateBaseForView, 'deletedAt' | 'topic'> &
  Pick<Defense, 'councilId'>;

export interface UseDefense {
  isLoading: boolean;
  data?: DefenseGetByIdResponse;
}

export type CouncilSearchInThesisByName = Pick<Council, 'id' | 'name'>;

export interface CouncilSearchInThesisByNameResponse extends CommonResponse {
  result: CouncilSearchInThesisByName[];
}
