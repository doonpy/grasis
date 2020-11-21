import { CommonColumns, CommonResponse } from '../common/common.type';
import { TopicStateBaseForView } from '../topic/topic-state/topic-state.type';
import { DefenseEntity } from './defense.entity';

export type Defense = DefenseEntity;

export type DefenseRequestBody = WithOptional<
  Omit<Defense, keyof CommonColumns | 'council' | 'topic'>,
  'note' | 'place' | 'councilId'
>;

export interface DefenseCreateOrUpdateResponse extends CommonResponse {
  id: number;
}

export interface DefenseGetByIdResponse extends CommonResponse {
  council: DefenseForView | null;
}

export type DefenseForView = Omit<TopicStateBaseForView, 'deletedAt' | 'topic'> &
  Pick<Defense, 'councilId'>;
