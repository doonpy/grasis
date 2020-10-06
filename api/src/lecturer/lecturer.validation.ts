import Joi from '@hapi/joi';

import { Lecturer } from './lecturer.entity';

const LEVEL_PATTERN = new RegExp(/^((Tiến sĩ|Thạc sĩ|Phó giáo sư|Giáo sư);?)*$/);

export const lecturerValidationSchema = Joi.object<Lecturer>({
  lecturerId: Joi.string()
    .length(4)
    .message('Mã giảng viên phải có độ dài là 4 kí tự.')
    .pattern(/^[0-9]{4}$/)
    .message('Mã giảng viên phải là số.'),
  position: Joi.string()
    .max(255)
    .message('Chức vụ có độ dài vượt quá quy định (tối đa 255 kí tự).'),
  level: Joi.string()
    .max(255)
    .message('Chức vụ có độ dài vượt quá quy định (tối đa 255 kí tự).')
    .pattern(LEVEL_PATTERN)
    .message('Trình độ giảng viên không hợp lệ.')
});
