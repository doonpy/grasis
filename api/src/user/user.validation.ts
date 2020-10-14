import Joi from '@hapi/joi';

import { UserRequestBody } from './user.interface';

export const userUpdateValidationSchema = Joi.object<UserRequestBody>({
  username: Joi.string()
    .max(50)
    .message('Tên người dùng có độ dài không đúng quy định (tối đa 50 kí tự).'),
  password: Joi.string()
    .allow(null)
    .max(50)
    .message('Mật khẩu không có độ dài không đúng quy định (tối đa 50 kí tự).'),
  confirmPassword: Joi.string()
    .allow(null)
    .max(50)
    .message('Mật khẩu có độ dài không đúng quy định (tối đa 50 kí tự).'),
  firstname: Joi.string()
    .allow(null)
    .optional()
    .max(50)
    .message('Tên có độ dài không đúng quy định (tối đa 50 kí tự).'),
  lastname: Joi.string()
    .allow(null)
    .optional()
    .max(50)
    .message('Họ và tên lót có độ dài không đúng quy định (tối đa 50 kí tự).'),
  gender: Joi.number()
    .allow(null)
    .optional()
    .integer()
    .min(0)
    .max(1)
    .message('Giới tính không hợp lệ (giá trị phải là 0 hoặc 1).'),
  email: Joi.string()
    .allow(null)
    .optional()
    .email({ allowUnicode: true })
    .message('Email không đúng định dạng.')
    .max(100)
    .message('Email có độ dài không đúng quy định (tối đa 100 kí tự).'),
  address: Joi.string()
    .allow(null)
    .optional()
    .max(100)
    .message('Địa chỉ có độ dài không đúng quy định (tối đa 100 kí tự).'),
  phone: Joi.string()
    .allow(null)
    .optional()
    .length(10)
    .message('Số điện thoại phải có độ dài là 10.')
    .pattern(/^[0-9]*$/)
    .message('Số điện thoại phải là số.'),
  status: Joi.number()
    .optional()
    .integer()
    .min(0)
    .max(1)
    .message('Trạng thái không hợp lệ (giá trị phải là 0 hoặc 1).'),
  isAdmin: Joi.number()
    .optional()
    .min(0)
    .max(1)
    .message('Quyền quản trị không hợp lệ (giá trị phải là 0 hoặc 1).')
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
