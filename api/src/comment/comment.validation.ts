import Joi from '@hapi/joi';

import { ReportModule } from '../common/common.resource';
import { commonIdValidateSchema } from '../common/common.validation';
import { CommentMode } from './comment.resource';
import { CommentRequestBody } from './comment.type';

export const commentModuleValidateSchema = Joi.number()
  .integer()
  .valid(ReportModule.PROGRESS_REPORT, ReportModule.REVIEW, ReportModule.DEFENSE)
  .required()
  .messages({
    'number.base': 'Giai đoạn bình luận không hợp lệ (NUMBER).',
    'number.integer': 'Giai đoạn bình luận không hợp lệ (INTEGER).',
    'any.only': 'Giai đoạn bình luận không hợp lệ (ONLY).',
    'any.required': 'Giai đoạn bình luận là thông tin bắt buộc.'
  });

export const topicValidateSchema = commonIdValidateSchema.concat(
  Joi.number().required().messages({ 'any.required': 'Đề tài là thông tin bắt buộc.' })
);

export const commentValidateSchema = Joi.object<CommentRequestBody>({
  content: Joi.string().min(1).max(65535).required().messages({
    'string.base': 'Nội dung bình luận phải là chuỗi.',
    'string.min': 'Nội dung bình luận không được rỗng.',
    'string.max': 'Nội dung bình luận không quá 65,535 kí tự.',
    'any.required': 'Nội dung bình luận là thông tin bắt buộc.'
  }),
  mode: Joi.number().integer().valid(CommentMode.PRIVATE, CommentMode.PUBLIC).required().messages({
    'number.base': 'Chế độ bình luận không hợp lệ (NUMBER).',
    'number.integer': 'Chế độ bình luận không hợp lệ (INTEGER).',
    'any.only': 'Chế độ bình luận không hợp lệ (ONLY).',
    'any.required': 'Chế độ bình luận là thông tin bắt buộc.'
  }),
  topicId: topicValidateSchema,
  module: commentModuleValidateSchema
});
