import Joi from '@hapi/joi';

import { Student } from './student.entity';

export const studentUpdateValidationSchema = Joi.object<Student>({
  studentId: Joi.string().length(8).message('Mã sinh viên không hợp lệ.'),
  schoolYear: Joi.string().length(4).message('Niên khóa không hợp lệ.')
});
