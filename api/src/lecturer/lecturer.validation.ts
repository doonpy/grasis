import Joi from '@hapi/joi';

import { LECTURER_LEVELS } from './lecturer.resource';
import { Lecturer } from './lecturer.type';

const LEVEL_PATTERN = new RegExp(`^((${LECTURER_LEVELS.join('|')});?)*$`);

export const lecturerValidationSchema = Joi.object<Lecturer>({
  lecturerId: Joi.string()
    .allow(null, '')
    .optional()
    .length(4)
    .pattern(/^[0-9]{4}$/)
    .messages({
      'string.base': 'Mã giảng viên phải là chuỗi.',
      'string.length': 'Mã giảng viên có độ dài là 4.',
      'string.pattern.base': 'Mã giảng viên có kí tự bị cấm.'
    }),
  position: Joi.string().allow(null, '').optional().max(255).messages({
    'string.base': 'Vị trí giảng viên phải là chuỗi.',
    'string.max': 'Vị trí giảng viên không quá 255 kí tự.'
  }),
  level: Joi.string().allow(null, '').optional().max(255).pattern(LEVEL_PATTERN).messages({
    'string.base': 'Trình độ giảng viên phải là chuỗi.',
    'string.max': 'Trình độ giảng viên không quá 255 kí tự.',
    'string.pattern.base': 'Trình độ giảng viên không đúng.'
  })
});
