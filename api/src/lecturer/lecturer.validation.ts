import Joi from '@hapi/joi';

import { Lecturer } from './lecturer.entity';

export const lecturerUpdateValidationSchema = Joi.object<Lecturer>({
  lecturerId: Joi.string().length(4).message('Mã giảng viên không hợp lệ.'),
  position: Joi.string().max(50).message('Chức vụ giảng viên không hợp lệ.'),
  level: Joi.string().max(255).message('Trình độ giảng viên không hợp lệ.')
});
