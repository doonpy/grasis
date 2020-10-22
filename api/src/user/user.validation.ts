import Joi from '@hapi/joi';

import { UserRequestBody, UserRequestBodyForUser } from './user.interface';
import { Gender, IsAdmin, UserStatus } from './user.resource';

export const userUpdateValidationSchema = Joi.object<UserRequestBody>({
  username: Joi.string().max(50).messages({
    'string.base': 'Tên đăng nhập phải là chuỗi.',
    'string.max': 'Tên đăng nhập không quá 50 kí tự.'
  }),
  password: Joi.string().allow(null).max(50).messages({
    'string.base': 'Mật khẩu phải là chuỗi.',
    'string.max': 'Mật khẩu không không quá 50 kí tự.'
  }),
  confirmPassword: Joi.string().allow(null).max(50).messages({
    'string.base': 'Mật khẩu xác nhận phải là chuỗi.',
    'string.max': 'Mật khẩu xác nhận không quá 50 kí tự.'
  }),
  firstname: Joi.string().allow(null).optional().max(50).messages({
    'string.base': 'Tên phải là chuỗi.',
    'string.max': 'Tên không quá 50 kí tự.'
  }),
  lastname: Joi.string().allow(null).optional().max(50).messages({
    'string.base': 'Họ và tên lót phải là chuỗi.',
    'string.max': 'Họ và tên lót không quá 50 kí tự.'
  }),
  gender: Joi.number().optional().integer().valid(Gender.MALE, Gender.FEMALE, null).messages({
    'number.base': 'Giới tính không hợp lệ.',
    'number.integer': 'Giới tính không hợp lệ.',
    'any.only': 'Giới tính có giá trị bị cấm.'
  }),
  email: Joi.string().allow(null).optional().email({ allowUnicode: true }).max(100).messages({
    'string.base': 'Email phải là chuỗi.',
    'string.email': 'Email không đúng định dạng.',
    'string.max': 'Email không quá 100 kí tự.'
  }),
  address: Joi.string().allow(null).optional().max(100).messages({
    'string.base': 'Địa chỉ phải là chuỗi.',
    'string.max': 'Địa chỉ không quá 100 kí tự.'
  }),
  phone: Joi.string()
    .allow(null)
    .optional()
    .length(10)
    .pattern(/^[0-9]*$/)
    .messages({
      'string.base': 'Số điện thoại phải là chuỗi.',
      'string.length': 'Số điện thoại có độ dài là 10.',
      'string.pattern.base': 'Số điện thoại có kí tự không hợp lệ.'
    }),
  status: Joi.number().optional().integer().valid(UserStatus.INACTIVE, UserStatus.ACTIVE).messages({
    'number.base': 'Trạng thái không hợp lệ.',
    'number.integer': 'Trạng thái không hợp lệ.',
    'any.only': 'Trạng thái có giá trị bị cấm.'
  }),
  isAdmin: Joi.number().optional().integer().valid(IsAdmin.TRUE, IsAdmin.FALSE).messages({
    'number.base': 'Quyền quản trị không hợp lệ.',
    'number.integer': 'Quyền quản trị không hợp lệ.',
    'any.only': 'Quyền quản trị có giá trị bị cấm.'
  })
});

export const userCreateValidationSchema = userUpdateValidationSchema.concat(
  Joi.object<UserRequestBody>({
    username: Joi.required().messages({
      'any.required': 'Tên đăng nhập là thông tin bắt buộc.'
    }),
    password: Joi.required().messages({
      'any.required': 'Mật khẩu là thông tin bắt buộc.'
    }),
    confirmPassword: Joi.required().messages({
      'any.required': 'Mật khẩu xác nhận là thông tin bắt buộc.'
    }),
    userType: Joi.forbidden().messages({
      'any.unknown': 'Thêm người dùng thất bại (FORBIDDEN).'
    })
  })
);

export const userCreateValidationSchemaForStudent = userCreateValidationSchema.concat(
  Joi.object<UserRequestBody>({
    isAdmin: Joi.any().forbidden().messages({
      'any.unknown': 'Sinh viên không thể là quản trị viên.'
    })
  })
);

export const userUpdateValidationSchemaForStudent = userUpdateValidationSchema.concat(
  Joi.object<UserRequestBody>({
    isAdmin: Joi.any().forbidden().messages({
      'any.unknown': 'Sinh viên không thể là quản trị viên.'
    })
  })
);

export const userUpdateValidationSchemaForUser = Joi.object<UserRequestBodyForUser>({
  password: Joi.string()
    .allow(null)
    .max(50)
    .message('Mật khẩu không có độ dài không đúng quy định (tối đa 50 kí tự).'),
  confirmPassword: Joi.string()
    .allow(null)
    .max(50)
    .message('Mật khẩu có độ dài không đúng quy định (tối đa 50 kí tự).'),
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
    .message('Số điện thoại phải là số.')
});
