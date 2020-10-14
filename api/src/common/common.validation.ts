import Joi from '@hapi/joi';

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
