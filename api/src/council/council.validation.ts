import Joi from '@hapi/joi';

import { commonIdValidateSchema } from '../common/common.validation';
import { CouncilRequestBody } from './council.type';

const councilValidationSchema = Joi.object<CouncilRequestBody>({
  name: Joi.string().max(100).messages({
    'string.base': 'Tên hội đồng phải là chuỗi.',
    'string.max': 'Tên hội đồng không quá 100 kí tự.'
  }),
  thesisId: commonIdValidateSchema,
  chairmanId: commonIdValidateSchema,
  instructorId: commonIdValidateSchema,
  commissionerId: commonIdValidateSchema
});

export const councilCreateValidationSchema = councilValidationSchema.concat(
  Joi.object<CouncilRequestBody>({
    name: Joi.required().messages({
      'any.required': 'Tên hội đổng là thông tin bắt buộc.'
    }),
    thesisId: Joi.required().messages({
      'any.required': 'Khóa luận là thông tin bắt buộc.'
    }),
    chairmanId: Joi.required().messages({
      'any.required': 'Chủ tịch hội đồng là thông tin bắt buộc.'
    }),
    instructorId: Joi.required().messages({
      'any.required': 'Giảng viên hướng dẫn là thông tin bắt buộc.'
    }),
    commissionerId: Joi.required().messages({
      'any.required': 'Ủy viên là thông tin bắt buộc.'
    })
  })
);

export const councilUpdateValidationSchema = councilValidationSchema.concat(
  Joi.object<CouncilRequestBody>({
    name: Joi.optional().allow('')
  })
);
