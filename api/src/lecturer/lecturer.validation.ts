import Joi from '@hapi/joi';
import { Lecturer } from './lecturer.model';

export const lecturerUpdateValidationSchema = Joi.object<Lecturer>({
  lecturerId: Joi.string().length(4).message('Mã giảng viên không hợp lệ.'),
  positionId: Joi.number().integer().min(1).message('Mã chức vụ giảng viên không hợp lệ.'),
  level: Joi.string().max(255).message('Trình độ giảng viên không hợp lệ.'),
  isAdmin: Joi.number().min(0).max(1).message('Quyền quản trị không hợp lệ.')
});

export const lecturerCreateValidationSchema = lecturerUpdateValidationSchema.concat(
  Joi.object<Lecturer>({
    lecturerId: Joi.required().messages({
      'any.required': 'Mã giảng viên là thông tin bắt buộc.'
    }),
    positionId: Joi.required().messages({
      'any.required': 'Mã chức vụ giảng viên là thông tin bắt buộc.'
    })
  })
);
