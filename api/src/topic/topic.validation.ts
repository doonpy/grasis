import Joi from '@hapi/joi';

import { StateResult } from './topic.resource';
import {
  Topic,
  TopicChangeStatusRequestBody,
  TopicChangeStudentRegisterStatusRequestBody
} from './topic.type';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicStudentStatus } from './topic-student/topic-student.resouce';

const topicValidationSchema = Joi.object<Topic>({
  subject: Joi.string().messages({ 'string.base': 'Tiêu đề phải là chuỗi.' }),
  description: Joi.string().allow('', null).messages({ 'string.base': 'Mô tả phải là chuỗi.' }),
  maxStudent: Joi.number().integer().min(1).max(2).messages({
    'number.base': 'Số lượng sinh viên thực hiện phải là số.',
    'number.integer': 'Số lượng sinh viên thực hiện phải là số nguyên',
    'number.min': 'Số lượng sinh viên thực hiện nhỏ nhất là 1.',
    'number.max': 'Số lượng sinh viên thực hiện lớn nhất là 2.'
  }),
  creatorId: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  status: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  registerStatus: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  approverId: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  }),
  thesisId: Joi.forbidden().messages({
    'any.unknown': 'Tham số không hợp lệ.'
  })
});

export const topicCreateValidationSchema = topicValidationSchema.concat(
  Joi.object<Topic>({
    subject: Joi.required().messages({
      'any.required': 'Tiêu đề là thông tin bắt buộc.'
    })
  })
);

export const topicUpdateValidationSchema = topicValidationSchema.concat(
  Joi.object<Topic>({
    subject: Joi.optional().allow(''),
    maxStudent: Joi.optional().allow(null)
  })
);

export const topicChangeActionValidationSchema = Joi.object<TopicChangeStatusRequestBody>({
  action: Joi.number()
    .integer()
    .valid(
      TopicStateAction.NEW,
      TopicStateAction.APPROVED,
      TopicStateAction.REJECTED,
      TopicStateAction.SEND_BACK,
      TopicStateAction.WITHDRAW,
      TopicStateAction.SEND_REQUEST,
      TopicStateAction.CANCELED
    )
    .required()
    .messages({
      'number.base': 'Hành động phê duyệt không hợp lệ (NUMBER).',
      'number.integer': 'Hành động phê duyệt không hợp lệ (INTEGER).',
      'any.only': 'Hành động phê duyệt không hợp lệ (ONLY).',
      'any.required': 'Hành động phê duyệt là thông tin bắt buộc.'
    }),
  note: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Ghi chú phải là chuỗi.'
  })
});

export const topicChangeStudentRegisterStatusValidationSchema = Joi.object<TopicChangeStudentRegisterStatusRequestBody>(
  {
    status: Joi.number()
      .integer()
      .valid(TopicStudentStatus.APPROVED, TopicStudentStatus.REJECTED)
      .required()
      .messages({
        'number.base': 'Trạng thái phê duyệt không hợp lệ (NUMBER).',
        'number.integer': 'Trạng thái phê duyệt không hợp lệ (INTEGER).',
        'any.only': 'Trạng thái phê duyệt không hợp lệ (ONLY).',
        'any.required': 'Trạng thái phê duyệt là thông tin bắt buộc.'
      })
  }
);

export const stateResultValidationSchema = Joi.number()
  .integer()
  .valid(StateResult.FAILED, StateResult.PASSED)
  .required()
  .messages({
    'number.base': 'Kết quả không hợp lệ (NUMBER).',
    'number.integer': 'Kết quả không hợp lệ (INTERGER).',
    'any.only': 'Kết quả không hợp lệ (VALID).',
    'any.required': 'Kết quả là thông tin bắt buộc.'
  });
