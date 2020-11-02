import React from 'react';

import UserTerminology from '../../assets/terminology/user.terminology';
import {
  sortByFirstname,
  sortByGender,
  sortByLastname,
  sortByStatus,
  sortByUsername
} from '../../libs/user/user.helper';
import { Gender, UserStatus } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';
import UserGenderRender from './UserGenderRender';
import UserStatusRender from './UserStatusRender';

export const USER_COLUMNS = [
  {
    title: UserTerminology.USER_1,
    dataIndex: 'username',
    key: 'username',
    sorter: {
      compare: sortByUsername,
      multiple: 1
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_5,
    dataIndex: 'lastname',
    key: 'lastname',
    sorter: {
      compare: sortByLastname,
      multiple: 2
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_4,
    dataIndex: 'firstname',
    key: 'firstname',
    sorter: {
      compare: sortByFirstname,
      multiple: 3
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_6,
    dataIndex: 'gender',
    key: 'gender',
    width: '10%',
    render: (value: Gender) => <UserGenderRender gender={value} />,
    sorter: {
      compare: sortByGender,
      multiple: 4
    }
  },
  {
    title: UserTerminology.USER_10,
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (value: UserStatus) => <UserStatusRender status={value} />,
    sorter: {
      compare: sortByStatus,
      multiple: 5
    }
  }
];
