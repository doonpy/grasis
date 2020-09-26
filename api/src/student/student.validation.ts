import Joi from '@hapi/joi';
import { Student } from './student.model';

export const studentUpdateValidationSchema = Joi.object<Student>({
  studentId: Joi.string().length(8).message('Mã sinh viên không hợp lệ.'),
  schoolYear: Joi.string().length(4).message('Niên khóa không hợp lệ.')
});

export const studentCreateValidationSchema = studentUpdateValidationSchema.concat(
  Joi.object<Student>({
    studentId: Joi.required().messages({
      'any.required': 'Mã sinh viên là thông tin bắt buộc.'
    }),
    schoolYear: Joi.required().messages({
      'any.required': 'Niên khóa là thông tin bắt buộc.'
    })
  })
);
