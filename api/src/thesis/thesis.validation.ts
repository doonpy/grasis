import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { ThesisRequestBody } from './thesis.interface';
import { ThesisState, ThesisStatus } from './thesis.resource';

const thesisValidationSchema = Joi.object<ThesisRequestBody>({
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
  state: Joi.number()
    .integer()
    .min(ThesisState.LECTURER_TOPIC_REGISTER)
    .max(ThesisState.FINISH)
    .messages({
      'number.base': 'Giai đoạn của khóa luận không hợp lệ.',
      'number.integer': 'Giai đoạn của khóa luận không hợp lệ.',
      'number.min': 'Giai đoạn của khóa luận không hợp lệ.',
      'number.max': 'Giai đoạn của khóa luận không hợp lệ.'
    }),
  status: Joi.number().integer().min(ThesisStatus.INACTIVE).max(ThesisStatus.ACTIVE).messages({
    'number.base': 'Trạng thái của khóa luận không hợp lệ.',
    'number.integer': 'Trạng thái của khóa luận không hợp lệ.',
    'number.min': 'Trạng thái của khóa luận không hợp lệ.',
    'number.max': 'Trạng thái của khóa luận không hợp lệ.'
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
    }),
    status: Joi.forbidden().messages({
      'any.unknown': 'Tạo khóa luận thất bại (tham số không hợp lệ).'
    }),
    state: Joi.forbidden().messages({
      'any.unknown': 'Tạo khóa luận thất bại (tham số không hợp lệ).'
    })
  })
);

export const thesisUpdateValidationSchema = thesisValidationSchema.concat(
  Joi.object<ThesisRequestBody>({
    creatorId: Joi.optional(),
    startTime: Joi.optional(),
    endTime: Joi.optional(),
    lecturerTopicRegister: Joi.optional(),
    studentTopicRegister: Joi.optional(),
    progressReport: Joi.optional(),
    review: Joi.optional(),
    defense: Joi.optional(),
    state: Joi.optional(),
    status: Joi.optional(),
    attendees: Joi.optional()
  })
);
