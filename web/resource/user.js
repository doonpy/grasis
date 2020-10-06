import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';

import { sortByLecturerId, sortByPosition } from '../services/lecturer/lecturer.service';
import {
  formatGenderForView,
  formatStatusForView,
  sortByFirstname,
  sortByGender,
  sortByLastname,
  sortByStatus,
  sortByUsername
} from '../services/user/user.service';

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
export const USER_TYPE = {
  STUDENT: 0,
  LECTURER: 1
};

export const USER_TABLE_COLUMNS = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: (id) => (
      <Link href={`/admin/lecturer/${id}`}>
        <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
      </Link>
    )
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'username',
    key: 'username',
    sorter: {
      compare: sortByUsername,
      multiple: 1
    }
  },
  {
    title: 'Họ và tên đệm',
    dataIndex: 'lastname',
    key: 'lastname',
    sorter: {
      compare: sortByLastname,
      multiple: 2
    }
  },
  {
    title: 'Tên',
    dataIndex: 'firstname',
    key: 'firstname',
    sorter: {
      compare: sortByFirstname,
      multiple: 3
    }
  },
  {
    title: 'Giới tính',
    dataIndex: 'gender',
    key: 'gender',
    width: '10%',
    render: formatGenderForView,
    sorter: {
      compare: sortByGender,
      multiple: 4
    }
  },
  {
    title: 'Mã giảng viên',
    dataIndex: 'lecturerId',
    key: 'lecturerId',
    width: '10%',
    sorter: {
      compare: sortByLecturerId,
      multiple: 6
    }
  },
  {
    title: 'Chức vụ',
    dataIndex: 'position',
    key: 'position',
    sorter: {
      compare: sortByPosition,
      multiple: 7
    }
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: formatStatusForView,
    sorter: {
      compare: sortByStatus,
      multiple: 5
    }
  }
];

export const USER_PROPERTIES = [
  'username',
  'password',
  'confirmPassword',
  'firstname',
  'lastname',
  'gender',
  'email',
  'address',
  'phone',
  'status',
  'isAdmin'
];
