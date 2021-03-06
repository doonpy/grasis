import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { ThesisRequestBody } from './thesis.type';

const thesisValidationSchema = Joi.object<ThesisRequestBody>({
  subject: Joi.string().max(100).messages({
    'string.base': 'Tiêu đề phải là chuỗi.',
    'string.max': 'Tiêu đề không được quá 100 kí tự.'
  }),
  startTime: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian bắt đầu phải là chuỗi.',
    'string.isoDate': 'Thời gian bắt đầu có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian bắt đầu có giá trị không hợp lệ.'
  }),
  endTime: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian kết thúc phải là chuỗi.',
    'string.isoDate': 'Thời gian kết thúc có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian kết thúc có giá trị không hợp lệ.'
  }),
  lecturerTopicRegister: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối giảng viên đăng ký đề tài phải là chuỗi.',
    'string.isoDate': 'Thời gian hạn cuối giảng viên đăng ký đề tài có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian hạn cuối giảng viên đăng ký đề tài có giá trị không hợp lệ.'
  }),
  studentTopicRegister: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối sinh viên đăng ký đề tài phải là chuỗi.',
    'string.isoDate': 'Thời gian hạn cuối sinh viên đăng ký đề tài có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian hạn cuối sinh viên đăng ký đề tài có giá trị không hợp lệ.'
  }),
  progressReport: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối báo cáo tiến độ phải là chuỗi.',
    'string.isoDate': 'Thời gian hạn cuối báo cáo tiến độ có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian hạn cuối báo cáo tiến độ có giá trị không hợp lệ.'
  }),
  review: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối phản biện phải là chuỗi.',
    'string.isoDate': 'Thời gian hạn cuối phản biện có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian hạn cuối phản biện có giá trị không hợp lệ.'
  }),
  defense: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối bảo vệ phải là chuỗi.',
    'string.isoDate': 'Thời gian hạn cuối bảo vệ có định dạng không hợp lệ.',
    'any.invalid': 'Thời gian hạn cuối bảo vệ có giá trị không hợp lệ.'
  }),
  attendees: Joi.object({
    lecturers: Joi.array().items(commonIdValidateSchema).messages({
      'array.base': 'Danh sách giảng viên hướng dẫn không hợp lệ.'
    }),
    students: Joi.array().items(commonIdValidateSchema).messages({
      'array.base': 'Danh sách sinh viên không hợp lệ.'
    })
  }),
  creatorId: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  })
});

export const thesisCreateValidationSchema = thesisValidationSchema.concat(
  Joi.object<ThesisRequestBody>({
    subject: Joi.required().messages({
      'any.required': 'Tiêu đề là thông tin bắt buộc.'
    }),
    startTime: Joi.required().messages({
      'any.required': 'Thời gian bắt đầu là thông tin bắt buộc.'
    }),
    endTime: Joi.required().messages({
      'any.required': 'Thời gian kết thúc là thông tin bắt buộc.'
    }),
    lecturerTopicRegister: Joi.required().messages({
      'any.required': 'Hạn chót giảng viên đăng ký đề tài là thông tin bắt buộc.'
    }),
    studentTopicRegister: Joi.required().messages({
      'any.required': 'Hạn chót sinh viên đăng ký đề tài là thông tin bắt buộc.'
    }),
    progressReport: Joi.required().messages({
      'any.required': 'Hạn chót báo cáo tiến độ là thông tin bắt buộc.'
    }),
    review: Joi.required().messages({
      'any.required': 'Hạn chót phản biện là thông tin bắt buộc.'
    }),
    defense: Joi.required().messages({
      'any.required': 'Hạn chót bảo vệ là thông tin bắt buộc.'
    })
  })
);

export const thesisUpdateValidationSchema = thesisValidationSchema.concat(
  Joi.object<ThesisRequestBody>({
    subject: Joi.optional(),
    startTime: Joi.optional(),
    endTime: Joi.optional(),
    lecturerTopicRegister: Joi.optional(),
    studentTopicRegister: Joi.optional(),
    progressReport: Joi.optional(),
    review: Joi.optional(),
    defense: Joi.optional(),
    attendees: Joi.optional()
  })
);
