import { ReportModule } from '../common/common.resource';
import { CommonColumns, CommonResponse } from '../common/common.type';
import { UserForCommentView } from '../user/user.type';
import { CommentMode } from './comment.resource';

export interface Comment extends CommonColumns {
  id: number;
  topicId: number;
  creatorId: number;
  content: string;
  mode: CommentMode;
  module: ReportModule;
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
