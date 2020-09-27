import Joi from '@hapi/joi';
import { User } from './user.model';

export const userUpdateValidationSchema = Joi.object<User>({
  username: Joi.string().max(50).message('Tên người dùng không hợp lệ.'),
  password: Joi.string().max(50).message('Mật khẩu không hợp lệ.'),
  firstname: Joi.string().max(50).message('Tên không hợp lệ.'),
  lastname: Joi.string().max(50).message('Họ và tên lót không hợp lệ.'),
  gender: Joi.number().integer().min(0).max(1).message('Giới tính không hợp lệ.'),
  email: Joi.string().email({ allowUnicode: true }).max(100).message('Email không hợp lệ.'),
  address: Joi.string().max(100).message('Địa chỉ không hợp lệ.'),
  phone: Joi.string().length(10).message('Số điện thoại không hợp lệ.'),
  status: Joi.number().integer().min(0).max(1).message('Trạng thái không hợp lệ.'),
  isAdmin: Joi.number().min(0).max(1).message('Quyền quản trị không hợp lệ.')
});

export const userCreateValidationSchema = userUpdateValidationSchema.concat(
  Joi.object<User>({
    username: Joi.required().messages({
      'any.required': 'Tên người dùng là thông tin bắt buộc.'
    }),
    password: Joi.required().messages({
      'any.required': 'Mật khẩu là thông tin bắt buộc.'
    })
  })
);
