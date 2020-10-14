import Joi from '@hapi/joi';

import { userCreateValidationSchema, userUpdateValidationSchema } from '../user/user.validation';
import { LecturerRequestBody } from './lecturer.interface';
import { LECTURER_LEVELS } from './lecturer.resource';

const LEVEL_PATTERN = new RegExp(`^((${LECTURER_LEVELS.join('|')});?)*$`);

const lecturerValidationSchema = Joi.object<LecturerRequestBody>({
  lecturerId: Joi.string()
    .allow(null, '')
    .optional()
    .length(4)
    .message('Mã giảng viên phải có độ dài là 4 kí tự.')
    .pattern(/^[0-9]{4}$/)
    .message('Mã giảng viên phải là kí tự số.'),
  position: Joi.string()
    .allow(null, '')
    .optional()
    .max(255)
    .message('Chức vụ có độ dài vượt quá quy định (tối đa 255 kí tự).'),
  level: Joi.string()
    .allow(null, '')
    .optional()
    .max(255)
    .message('Chức vụ có độ dài vượt quá quy định (tối đa 255 kí tự).')
    .pattern(LEVEL_PATTERN)
    .message('Trình độ giảng viên không hợp lệ.')
});

export const lecturerCreateValidationSchema = userCreateValidationSchema.concat(
  lecturerValidationSchema
);

export const lecturerUpdateValidationSchema = userUpdateValidationSchema.concat(
  lecturerValidationSchema
);
