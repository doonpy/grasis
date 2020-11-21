import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { DefenseRequestBody } from './defense.type';

const councilValidationSchema = Joi.object<DefenseRequestBody>({
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
  councilId: commonIdValidateSchema.concat(Joi.number().allow(null))
});

export const reviewCreateValidationSchema = councilValidationSchema.concat(
  Joi.object<DefenseRequestBody>({
    time: Joi.required().messages({
      'any.required': 'Thời gian là thông tin bắt buộc.'
    })
  })
);
