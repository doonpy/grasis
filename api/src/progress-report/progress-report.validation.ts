import Joi from '@hapi/joi';

import { ProgressReportRequestBody } from './progress-report.interface';
import { IsPassed } from './progress-report.resource';

const progressReportValidationSchema = Joi.object<ProgressReportRequestBody>({
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
  })
});

export const progressReportCreateValidationSchema = progressReportValidationSchema.concat(
  Joi.object<ProgressReportRequestBody>({
    time: Joi.required().messages({
      'any.required': 'Thời gian là thông tin bắt buộc.'
    })
  })
);

export const progressReportIsPassedValidationSchema = Joi.number()
  .integer()
  .valid(IsPassed.FALSE, IsPassed.TRUE)
  .required()
  .messages({
    'number.base': 'Kết quả không hợp lệ (NUMBER).',
    'number.integer': 'Kết quả không hợp lệ (INTERGER).',
    'any.only': 'Kết quả không hợp lệ (VALID).',
    'any.required': 'Kết quả là thông tin bắt buộc.'
  });
