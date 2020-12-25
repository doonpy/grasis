import { CommonColumns, CommonResponse } from '../common/common.type';
import { UserForCommentView } from '../user/user.type';
import { CommentEntity } from './comment.entity';

export type Comment = CommentEntity;

export type CommentRequestBody = Omit<
  Comment,
  keyof CommonColumns | 'id' | 'user' | 'topic' | 'creator' | 'creatorId'
>;

export interface CommentCreateResponse extends CommonResponse {
  comment: CommentForView;
}

export type CommentForView = Pick<Comment, 'id' | 'content' | 'mode' | 'createdAt'> & {
  creatorInfo: UserForCommentView;
};

export interface CommentGetManyResponse extends CommonResponse {
  comments: CommentForView[];
  total: number;
}
