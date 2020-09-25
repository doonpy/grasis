import Joi from '@hapi/joi';

export const commonOffsetValidateSchema = Joi.number()
  .integer()
  .min(0)
  .message('Độ dời không hợp lệ.');

export const commonLimitValidateSchema = Joi.number()
  .integer()
  .max(1000)
  .min(1)
  .message('Giới hạn không hợp lệ.');

export const commonIdValidateSchema = Joi.number()
  .integer()
  .min(1)
  .message('ID không hợp lệ.');
