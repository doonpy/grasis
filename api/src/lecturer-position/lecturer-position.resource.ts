import { COMMON_SELECT_ATTRIBUTES } from '../common/common.resource';

export const LPO_MODEL_RESOURCE = {
  TABLE_NAME: 'lecturer_position',
  MODEL_NAME: 'lp',
  FIELD_NAME: {
    TITLE: 'title'
  }
};

export const LPO_CONTROLLER_RESOURCE = {
  PATH: {
    ROOT: 'lecturer-positions',
    SPECIFY: '/:id'
  },
  PARAM: {
    ID: 'id'
  }
};

export const LPO_ERROR_RESOURCE = {
  ERR_1: 'Chức vụ không tồn tại.'
};

export const LPO_SELECT_ATTRIBUTES = [
  ...COMMON_SELECT_ATTRIBUTES,
  LPO_MODEL_RESOURCE.FIELD_NAME.TITLE
];
