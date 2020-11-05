import React from 'react';

import UserTerminology from '../../assets/terminology/user.terminology';
import { sortByNumber, sortByString } from '../../libs/common/common.helper';
import { UserForListView } from '../../libs/user/user.interface';
import { Gender, UserStatus } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';
import UserGenderRender from './UserGenderRender';
import UserStatusRender from './UserStatusRender';

export const UserAdminTableColumns = [
  {
    title: UserTerminology.USER_1,
    dataIndex: 'username',
    key: 'username',
    sorter: {
      compare: (a: UserForListView, b: UserForListView) => sortByString(a.username, b.username),
      multiple: 1
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_5,
    dataIndex: 'lastname',
    key: 'lastname',
    sorter: {
      compare: (a: UserForListView, b: UserForListView) => sortByString(a.lastname, b.lastname),
      multiple: 2
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_4,
    dataIndex: 'firstname',
    key: 'firstname',
    sorter: {
      compare: (a: UserForListView, b: UserForListView) => sortByString(a.firstname, b.firstname),
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
      compare: (a: UserForListView, b: UserForListView) => sortByNumber(a.gender, b.gender),
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
      compare: (a: UserForListView, b: UserForListView) =>
        sortByNumber(a.status as UserStatus, b.status as UserStatus),
      multiple: 5
    }
  }
];
