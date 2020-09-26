import Joi from '@hapi/joi';
import { LecturerPosition } from './lecturer-position.model';

export const lecturePositionUpdateValidationSchema = Joi.object<
  LecturerPosition
>({
  title: Joi.string().max(255).message('Tên chức vụ không hợp lệ.'),
});

export const lecturerPositionCreateValidationSchema = lecturePositionUpdateValidationSchema.concat(
  Joi.object<LecturerPosition>({
    title: Joi.required().messages({
      'any.required': 'Tên chức vụ là thông tin bắt buộc.',
    }),
  }),
);
