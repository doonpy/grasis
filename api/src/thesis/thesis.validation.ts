import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { ThesisRequestBody } from './thesis.interface';
import { THESIS_STATE, THESIS_STATUS } from './thesis.resource';

const thesisValidationSchema = Joi.object<ThesisRequestBody>({
  creator: commonIdValidateSchema,
  startTime: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian bắt đầu không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian bắt đầu không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian bắt đầu không hợp lệ (INVALID).'
  }),
  endTime: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian kết thúc không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian kết thúc không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian kết thúc không hợp lệ (INVALID).'
  }),
  lecturerTopicRegister: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối giảng viên đăng ký đề tài không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian hạn cuối giảng viên đăng ký đề tài không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian hạn cuối giảng viên đăng ký đề tài không hợp lệ (INVALID).'
  }),
  studentTopicRegister: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối sinh viên đăng ký đề tài không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian hạn cuối sinh viên đăng ký đề tài không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian hạn cuối sinh viên đăng ký đề tài không hợp lệ (INVALID).'
  }),
  progressReport: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối báo cáo tiến độ không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian hạn cuối báo cáo tiến độ không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian hạn cuối báo cáo tiến độ không hợp lệ (INVALID).'
  }),
  review: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối phản biện không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian hạn cuối phản biện không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian hạn cuối phản biện không hợp lệ (INVALID).'
  }),
  defense: Joi.string().isoDate().invalid('', null).messages({
    'string.base': 'Thời gian hạn cuối bảo vệ không hợp lệ (STRING).',
    'string.isoDate': 'Thời gian hạn cuối bảo vệ không hợp lệ (ISO DATE).',
    'any.invalid': 'Thời gian hạn cuối bảo vệ không hợp lệ (INVALID).'
  }),
  state: Joi.number()
    .integer()
    .min(THESIS_STATE.LECTURER_TOPIC_REGISTER)
    .max(THESIS_STATE.FINISH)
    .messages({
      'number.base': 'Giai đoạn của khóa luận không hợp lệ (NUMBER).',
      'number.integer': 'Giai đoạn của khóa luận không hợp lệ (INTEGER).',
      'number.min': `Giai đoạn của khóa luận không hợp lệ (MIN: ${THESIS_STATE.LECTURER_TOPIC_REGISTER}).`,
      'number.max': `Giai đoạn của khóa luận không hợp lệ (MAX: ${THESIS_STATE.FINISH}).`
    }),
  status: Joi.number()
    .integer()
    .min(THESIS_STATUS.INACTIVE)
    .max(THESIS_STATUS.ACTIVE)
    .messages({
      'number.base': 'Trạng thái của khóa luận không hợp lệ (NUMBER).',
      'number.integer': 'Trạng thái của khóa luận không hợp lệ (INTEGER).',
      'number.min': `Trạng thái của khóa luận không hợp lệ (MIN: ${THESIS_STATUS.INACTIVE}).`,
      'number.max': `Trạng thái của khóa luận không hợp lệ (MAX: ${THESIS_STATUS.ACTIVE}).`
    }),
  lecturers: Joi.array().items(commonIdValidateSchema).messages({
    'array.base': 'Danh sách giảng viên hướng dẫn không hợp lệ (ARRAY).'
  }),
  students: Joi.array().items(commonIdValidateSchema).messages({
    'array.base': 'Danh sách sinh viên không hợp lệ (ARRAY).'
  })
});

export const thesisCreateValidationSchema = thesisValidationSchema.concat(
  Joi.object<ThesisRequestBody>({
    creator: Joi.required().messages({
      'any.required': 'ID người tạo là thông tin bắt buộc.'
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
    creator: Joi.optional(),
    startTime: Joi.optional(),
    endTime: Joi.optional(),
    lecturerTopicRegister: Joi.optional(),
    studentTopicRegister: Joi.optional(),
    progressReport: Joi.optional(),
    review: Joi.optional(),
    defense: Joi.optional(),
    state: Joi.optional(),
    status: Joi.optional(),
    lecturers: Joi.optional(),
    students: Joi.optional()
  })
);
