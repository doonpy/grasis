import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { GENDER, IS_ADMIN, USER_PROPERTIES, USER_STATUS } from '../../resource/user';
import { redirectTo } from '../auth/redirect.service';

export function sortByUsername(a, b) {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

export function sortByLastname(a, b) {
  if (a.lastname < b.lastname) {
    return -1;
  }
  if (a.lastname > b.lastname) {
    return 1;
  }
  return 0;
}

export function sortByFirstname(a, b) {
  if (a.firstname < b.firstname) {
    return -1;
  }
  if (a.firstname > b.firstname) {
    return 1;
  }
  return 0;
}

export function sortByGender(a, b) {
  return a.gender - b.gender;
}

export function sortByStatus(a, b) {
  return a.status - b.status;
}

export function formatGenderForView(gender) {
  if (gender === GENDER.MALE) {
    return 'Nam';
  }

  if (gender === GENDER.FEMALE) {
    return 'Nữ';
  }

  return 'NULL';
}

export function formatStatusForView(status) {
  if (status === USER_STATUS.ACTIVE) {
    return <Tag color="green">Đang hoạt động</Tag>;
  }

  if (status === USER_STATUS.IN_ACTIVE) {
    return <Tag color="volcano">Ngưng hoạt động</Tag>;
  }

  return 'NULL';
}

export function formatIsAdminForView(isAdmin) {
  if (isAdmin === IS_ADMIN.TRUE) return <CheckCircleTwoTone twoToneColor="#52c41a" />;

  if (isAdmin === IS_ADMIN.FALSE) {
    return <CloseCircleTwoTone twoToneColor="#f5222d" />;
  }

  return 'NULL';
}

export function formatStatusForPost(status) {
  if (status) {
    return USER_STATUS.ACTIVE;
  }

  return USER_STATUS.IN_ACTIVE;
}

export function formatIsAdminForPost(isAdmin) {
  return isAdmin === true ? IS_ADMIN.TRUE : IS_ADMIN.FALSE;
}

export function formatUserForPost(values) {
  const user = {};
  USER_PROPERTIES.forEach((prop) => {
    if (typeof values[prop] !== 'undefined' && values[prop] !== '' && values[prop] !== null) {
      if (prop === 'status') {
        user[prop] = formatStatusForPost(values[prop]);
        return;
      }

      if (prop === 'isAdmin') {
        user[prop] = formatIsAdminForPost(values[prop]);
        return;
      }
      user[prop] = values[prop];
    }
  });

  return user;
}

export function isAdminCheck(isAdmin, res) {
  if (isAdmin === IS_ADMIN.FALSE) {
    redirectTo('/error/403', res);
  }
}

export function userTypeCheck(userTypes, userType, res) {
  if (userTypes.indexOf(userType) === -1) {
    redirectTo('/error/403', res);
  }
}
