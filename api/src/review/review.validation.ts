import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { stateResultValidationSchema } from '../topic/topic.validation';
import { ReviewChangeResultRequestBody, ReviewRequestBody } from './review.type';

const reviewValidationSchema = Joi.object<ReviewRequestBody>({
  time: Joi.string().isoDate().messages({
    'string.base': 'Thời gian phải là chuỗi.',
    'string.isoDate': 'Thời gian có định dạng không hợp lệ.'
  }),
  place: Joi.string().allow(null, '').max(100).messages({
    'string.base': 'Địa điểm phải là chuỗi.',
    'string.max': 'Địa điểm không quá 100 kí tự.'
  }),
  note: Joi.string().allow(null, '').messages({
    'string.base': 'Ghi chú phải là chuỗi'
  }),
  reviewerId: commonIdValidateSchema.concat(Joi.number().allow(null))
});

export const reviewCreateValidationSchema = reviewValidationSchema.concat(
  Joi.object<ReviewRequestBody>({
    time: Joi.required().messages({
      'any.required': 'Thời gian là thông tin bắt buộc.'
    })
  })
);

export const reviewChangeResultValidationSchema = Joi.object<ReviewChangeResultRequestBody>({
  result: stateResultValidationSchema,
  reviewerComment: Joi.string().allow(null, '').messages({
    'string.base': 'Ghi chú phải là chuỗi'
  })
});
