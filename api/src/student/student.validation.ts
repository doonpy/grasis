import Joi from '@hapi/joi';

import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
  userUpdateValidationSchemaForUser
} from '../user/user.validation';
import { StudentRequestBody } from './student.interface';

const studentValidationSchema = Joi.object<StudentRequestBody>({
  studentId: Joi.string().length(8).message('Mã sinh viên phải có 8 kí tự.'),
  schoolYear: Joi.string().length(4).message('Niên khóa phải có 4 kí tự.'),
  isGraduate: Joi.number()
    .integer()
    .message('Tình trạng tốt nghiệp phải là số nguyên.')
    .min(0)
    .message('Tình trạng tốt nghiệp có giá trị nhỏ nhất là 0.')
    .max(1)
    .message('Tình trạng tốt nghiệp có giá trị lớn nhất là 1.'),
  studentClass: Joi.string().max(20).message('Lớp có độ dài tối đa là 20.')
});

export const studentCreateValidationSchema = userCreateValidationSchema.concat(
  studentValidationSchema
);

export const studentUpdateValidationSchema = userUpdateValidationSchema.concat(
  studentValidationSchema
);

export const studentUpdateValidationSchemaForUser = userUpdateValidationSchemaForUser;
