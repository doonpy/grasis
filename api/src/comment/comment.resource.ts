export const COMMENT_TABLE = `comment`;

export const CommentColumn = {
  TOPIC_ID: 'topic_id',
  CREATOR_ID: 'creator_id',
  CONTENT: 'content',
  MODE: 'mode',
  STATE: 'state'
};

export enum CommentMode {
  PRIVATE = 1,
  PUBLIC
}

export const CommentError = {
  ERR_1: 'Bạn không được phép tạo bình luận riêng tư.',
  ERR_2: 'Bình luận không tồn tại.',
  ERR_3: 'Bạn không thể xóa bình luận của người khác.'
};

export const CommentQuery = {
  TOPIC_ID: 'topicId',
  STATE: 'state'
};

export const CommentPath = {
  ROOT: 'comments',
  SPECIFY: '/:id'
};
