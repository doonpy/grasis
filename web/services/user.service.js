import { CheckCircle, RemoveCircle } from '@material-ui/icons';
import React from 'react';

import Danger from '../components/Typography/Danger';
import Primary from '../components/Typography/Primary';
import Success from '../components/Typography/Success';

export const GENDER = {
  MALE: 0,
  FEMALE: 1
};
export const USER_STATUS = {
  IN_ACTIVE: 0,
  ACTIVE: 1
};
export const IS_ADMIN = {
  FALSE: 0,
  TRUE: 1
};

export function formatUserDetailForList({ username, firstname, lastname, gender, status }) {
  const statusFormatted = convertStatus(status);
  const genderFormatted = convertGender(gender);
  return [username, getFullName(firstname, lastname), genderFormatted, statusFormatted];
}

export function convertGender(gender) {
  if (gender === undefined || gender === null) {
    return '';
  }

  return gender === GENDER.MALE ? 'Nam' : 'Nữ';
}

export function convertStatus(status) {
  if (status === undefined || status === null) {
    return '';
  }

  return status === USER_STATUS.ACTIVE ? (
    <Success>Đang hoạt động</Success>
  ) : (
    <Danger>Ngưng hoạt động</Danger>
  );
}

export function getFullName(firstname, lastname) {
  return `${lastname || 'NULL'} ${firstname || 'NULL'}`;
}

export function convertIsAdmin(isAdmin) {
  if (isAdmin === undefined || isAdmin === null) {
    return '';
  }

  return isAdmin === IS_ADMIN.TRUE ? (
    <Success>
      <CheckCircle />
    </Success>
  ) : (
    <Danger>
      <RemoveCircle color="danger" />
    </Danger>
  );
}

export function formatUserDetailForGetOn({ username, gender, address, status, phone, isAdmin }) {
  return [
    [
      <Primary key={'username'}>
        <b>Tên người dùng</b>
      </Primary>,
      username
    ],
    [
      <Primary key={'gender'}>
        <b>Giới tính</b>
      </Primary>,
      convertGender(gender)
    ],
    [
      <Primary key={'phone'}>
        <b>Điện thoại</b>
      </Primary>,
      phone
    ],
    [
      <Primary key={'address'}>
        <b>Địa chỉ</b>
      </Primary>,
      address
    ],
    [
      <Primary key={'isAdmin'}>
        <b>Quản trị viên</b>
      </Primary>,
      convertIsAdmin(isAdmin)
    ],
    [
      <Primary key={'status'}>
        <b>Trạng thái</b>
      </Primary>,
      convertStatus(status)
    ]
  ];
}
