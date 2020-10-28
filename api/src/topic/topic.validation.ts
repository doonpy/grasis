import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { Topic } from './topic.interface';

const topicValidationSchema = Joi.object<Topic>({
  subject: Joi.string().messages({ 'string.base': 'Tiêu đề phải là chuỗi.' }),
  description: Joi.string().messages({ 'string.base': 'Mô tả phải là chuỗi.' }),
  thesisId: commonIdValidateSchema,
  maxStudent: Joi.number().integer().min(1).max(2).messages({
    'number.base': 'Số lượng sinh viên thực hiện phải là số.',
    'number.integer': 'Số lượng sinh viên thực hiện phải là số nguyên',
    'number.min': 'Số lượng sinh viên thực hiện nhỏ nhất là 1.',
    'number.max': 'Số lượng sinh viên thực hiện lớn nhất là 2.'
  }),
  creatorId: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  status: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  registerStatus: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  approverId: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  })
});

export const topicCreateValidationSchema = topicValidationSchema.concat(
  Joi.object<Topic>({
    subject: Joi.required().messages({
      'any.required': 'Tiêu đề là thông tin bắt buộc.'
    }),
    thesisId: Joi.required().messages({
      'any.required': 'Khóa luận là thông tin bắt buộc.'
    })
  })
);
