import React from 'react';

import UserTerminology from '../../assets/terminology/user.terminology';
import { User } from '../../libs/user/user.interface';
import { Gender, UserStatus } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';
import UserGenderRender from './UserGenderRender';
import UserStatusRender from './UserStatusRender';

function sortByUsername(a: User, b: User): number {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

function sortByLastname(a: User, b: User): number {
  if (a.lastname < b.lastname) {
    return -1;
  }
  if (a.lastname > b.lastname) {
    return 1;
  }
  return 0;
}

function sortByFirstname(a: User, b: User): number {
  if (a.firstname < b.firstname) {
    return -1;
  }
  if (a.firstname > b.firstname) {
    return 1;
  }
  return 0;
}

function sortByGender(a: User, b: User): number {
  if (a.gender !== null && b.gender !== null) {
    return a.gender - b.gender;
  }

  return 0;
}

function sortByStatus(a: User, b: User): number {
  if (
    a.status !== null &&
    typeof a.status !== 'boolean' &&
    b.status !== null &&
    typeof b.status !== 'boolean'
  ) {
    return a.status - b.status;
  }

  return 0;
}

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
