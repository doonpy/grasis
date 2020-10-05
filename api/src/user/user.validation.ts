import Joi from '@hapi/joi';

import { UserRequestBody } from './user.resource';

export const userUpdateValidationSchema = Joi.object<UserRequestBody>({
  username: Joi.string().max(50).message('Tên người dùng không hợp lệ.'),
  password: Joi.string().max(50).message('Mật khẩu không hợp lệ.'),
  confirmPassword: Joi.string().max(50).message('Mật khẩu không hợp lệ.'),
  firstname: Joi.string().optional().max(50).message('Tên không hợp lệ.'),
  lastname: Joi.string().optional().max(50).message('Họ và tên lót không hợp lệ.'),
  gender: Joi.number().optional().integer().min(0).max(1).message('Giới tính không hợp lệ.'),
  email: Joi.string()
    .optional()
    .email({ allowUnicode: true })
    .max(100)
    .message('Email không hợp lệ.'),
  address: Joi.string().optional().max(100).message('Địa chỉ không hợp lệ.'),
  phone: Joi.string()
    .optional()
    .length(10)
    .message('Số điện thoại phải có 10 chữ số.')
    .regex(/[0-9]{10}/)
    .message('Số điện thoại phải là số.'),
  status: Joi.number().optional().integer().min(0).max(1).message('Trạng thái không hợp lệ.'),
  isAdmin: Joi.number().optional().min(0).max(1).message('Quyền quản trị không hợp lệ.')
});

export const userCreateValidationSchema = userUpdateValidationSchema.concat(
  Joi.object<UserRequestBody>({
    username: Joi.required().messages({
      'any.required': 'Tên người dùng là thông tin bắt buộc.'
    }),
    password: Joi.required().messages({
      'any.required': 'Mật khẩu là thông tin bắt buộc.'
    }),
    confirmPassword: Joi.required().messages({
      'any.required': 'Mật khẩu xác nhận là thông tin bắt buộc.'
    })
  })
);
