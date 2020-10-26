import Joi from '@hapi/joi';

import { userUpdateValidationSchemaForUser } from '../user/user.validation';
import { StudentRequestBody } from './student.interface';
import { IsGraduate } from './student.resource';

export const studentValidationSchema = Joi.object<StudentRequestBody>({
  studentId: Joi.string().allow(null, '').length(8).messages({
    'string.base': 'Mã sinh viên phải là chuỗi',
    'string.length': 'Mã sinh viên phải có 8 kí tự.'
  }),
  schoolYear: Joi.string()
    .allow(null, '')
    .length(4)
    .pattern(/[0-9]+/)
    .messages({
      'string.base': 'Niên khóa phải là chuỗi.',
      'string.length': 'Niên khóa phải có 4 kí tự.',
      'string.pattern.base': 'Niên khóa có kí tự bị cấm.'
    }),
  isGraduate: Joi.number()
    .allow(null, '')
    .integer()
    .valid(IsGraduate.FALSE, IsGraduate.TRUE)
    .messages({
      'number.base': 'Tình trạng tốt nghiệp không hợp lệ.',
      'number.integer': 'Tình trạng tốt nghiệp không hợp lệ.',
      'any.only': 'Tình trạng tốt nghiệp có kí tự bị cấm.'
    }),
  studentClass: Joi.string().allow(null, '').max(20).messages({
    'string.base': 'Lớp phải là chuỗi.',
    'string.max': 'Lớp không quá 20 kí tự.'
  })
});

export const studentUpdateValidationSchemaForUser = userUpdateValidationSchemaForUser;
