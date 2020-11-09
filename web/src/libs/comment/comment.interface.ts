import { CommonColumns, CommonResponse } from '../common/common.interface';
import { ThesisState } from '../thesis/thesis.resource';
import { UserForCommentView } from '../user/user.interface';
import { CommentMode } from './comment.resource';

export interface Comment extends CommonColumns {
  id: number;
  topicId: number;
  creatorId: number;
  content: string;
  mode: CommentMode;
  state: ThesisState;
}

export type CommentForView = Pick<Comment, 'id' | 'content' | 'mode' | 'createdAt'> & {
  creatorInfo: UserForCommentView;
};

export interface CommentGetManyResponse extends CommonResponse {
  comments: CommentForView[];
  total: number;
}

export interface UseComment {
  isLoading: boolean;
  data?: CommentGetManyResponse;
}
