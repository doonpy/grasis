import Joi from '@hapi/joi';

import { ResultPoint, ResultRequestBody } from './result.type';

const resultPointValidationSchema = Joi.object<ResultPoint>({
  title: Joi.string().allow('').messages({
    'string.base': 'Địa điểm phải là chuỗi.'
  }),
  rate: Joi.number().min(0).max(100).messages({
    'number.base': 'Tỉ lệ phải là số.',
    'number.min': 'Tỉ lệ không được nhỏ hơn 0',
    'number.max': 'Tỉ lệ không được lớn hơn 100'
  }),
  value: Joi.number().min(0).max(10).allow(null).messages({
    'number.base': 'Điểm phải là số.',
    'number.min': 'Điểm không được nhỏ hơn 0',
    'number.max': 'Điểm không được lớn hơn 10'
  })
});

const resultValidationSchema = Joi.object<ResultRequestBody>({
  point: Joi.array().items(resultPointValidationSchema),
  note: Joi.string().allow(null, '').messages({
    'string.base': 'Ghi chú phải là chuỗi'
  })
});

export const ResultUpdateValidationSchema = resultValidationSchema;
