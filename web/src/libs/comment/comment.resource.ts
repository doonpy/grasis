export enum CommentMode {
  PRIVATE = 1,
  PUBLIC
}

export const COMMENT_API_ROOT = 'comments';

export const CommentApi = {
  SPECIFY: `${COMMENT_API_ROOT}/@0`,
  GET_MANY: `${COMMENT_API_ROOT}?topicId=@0&state=@1&offset=@2`
};
