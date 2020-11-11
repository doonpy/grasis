import Joi from '@hapi/joi';

import { ReportModule } from './common.resource';

export const commonOffsetValidateSchema = Joi.number()
  .integer()
  .message('Độ dời phải là số nguyên.')
  .min(0)
  .message('Độ dời tối thiểu là 0.')
  .error(() => new Error('Độ dời phải là số.'));

export const commonLimitValidateSchema = Joi.number()
  .integer()
  .message('Giới hạn phải là số nguyên.')
  .max(1000)
  .message('Giới hạn tối đa là 1000.')
  .min(1)
  .message('Giới hạn tối thiểu là 1.')
  .error(() => new Error('Giới hạn phải là số.'));

export const commonIdValidateSchema = Joi.number()
  .integer()
  .message('Giới hạn phải là số nguyên.')
  .min(1)
  .message('ID tối thiểu là 1.')
  .error(() => new Error('ID phải là số.'));

export const commonFilenameValidationSchema = Joi.string().min(1).required().messages({
  'string.base': 'Tên tệp tin phải là chuỗi.',
  'string.min': 'Tên tệp tin phải có ít nhất 1 kí tự',
  'any.required': 'Tên tệp tin là thông tin bắt buộc'
});

export const reportModuleSchemaValidation = Joi.number()
  .integer()
  .allow(ReportModule.DEFENSE, ReportModule.PROGRESS_REPORT, ReportModule.REVIEW)
  .required()
  .messages({
    'number.base': 'Module báo cáo không hợp lệ (NUMBER).',
    'number.integer': 'Module báo cáo không hợp lệ (INTEGER).',
    'any.only': 'Module báo cáo không hợp lệ (ONLY).',
    'any.required': 'Module báo cáo không hợp lệ (REQUIRED).'
  });

export const filenameSchemaValidation = Joi.string()
  .pattern(/^[^/\\]+$/)
  .max(100)
  .messages({
    'string.base': 'Tên tệp tin phải là chuỗi.',
    'string.pattern.base': 'Tên tệp tin có kí tự không hợp lệ',
    'string.max': 'Tên tệp tin không quá 50 kí tự.'
  });
