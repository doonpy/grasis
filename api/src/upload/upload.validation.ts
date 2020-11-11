import Joi from '@hapi/joi';

import { UploadReportModule } from './upload.resource';

export const uploadReportModuleSchemaValidation = Joi.number()
  .integer()
  .allow(UploadReportModule.DEFENSE, UploadReportModule.PROGRESS_REPORT, UploadReportModule.REVIEW)
  .required()
  .messages({
    'number.base': 'Module báo cáo không hợp lệ (NUMBER).',
    'number.integer': 'Module báo cáo không hợp lệ (INTEGER).',
    'any.only': 'Module báo cáo không hợp lệ (ONLY).',
    'any.required': 'Module báo cáo không hợp lệ (REQUIRED).'
  });

export const uploadFilenameSchemaValidation = Joi.string()
  .pattern(/^[a-zA-Z0-9.\s\-_()]+$/)
  .max(50)
  .messages({
    'string.base': 'Tên tệp tin phải là chuỗi.',
    'string.pattern.base': 'Tên tệp tin có kí tự không hợp lệ',
    'string.max': 'Tên tệp tin không quá 50 kí tự.'
  });
