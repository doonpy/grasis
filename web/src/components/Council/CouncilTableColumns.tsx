import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import { sortByDate, sortByNumber, sortByString } from '../../libs/common/common.helper';
import { CouncilForView } from '../../libs/council/council.type';
import { LecturerForFastView } from '../../libs/lecturer/lecturer.type';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';
import CouncilItemAction from './CouncilItemAction';

export const CouncilTableColumns: ColumnsType<CouncilForView> = [
  {
    title: CouncilTerminology.COUNCIL_2,
    dataIndex: 'name',
    key: 'name',
    width: '15%',
    sorter: { compare: (a, b) => sortByString(a.name, b.name), multiple: 1 },
    render: (value: string) => <TextData text={value} />
  },
  {
    title: CouncilTerminology.COUNCIL_3,
    dataIndex: 'chairman',
    key: 'chairman',
    sorter: { compare: (a, b) => sortByNumber(a.chairman.id, b.chairman.id), multiple: 2 },
    render: (value: LecturerForFastView) => <LecturerFastView lecturer={value} />
  },
  {
    title: CouncilTerminology.COUNCIL_4,
    dataIndex: 'instructor',
    key: 'instructor',
    sorter: { compare: (a, b) => sortByNumber(a.instructor.id, b.instructor.id), multiple: 3 },
    render: (value: LecturerForFastView) => <LecturerFastView lecturer={value} />
  },
  {
    title: CouncilTerminology.COUNCIL_5,
    dataIndex: 'commissioner',
    key: 'commissioner',
    sorter: { compare: (a, b) => sortByNumber(a.commissioner.id, b.commissioner.id), multiple: 4 },
    render: (value: LecturerForFastView) => <LecturerFastView lecturer={value} />
  },
  {
    title: CommonTerminology.COMMON_1,
    dataIndex: 'createdAt',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.createdAt), moment(b.createdAt)),
      multiple: 5
    },
    render: (value: string) => <DateData date={value} />
  },
  {
    title: CommonTerminology.COMMON_2,
    dataIndex: 'updatedAt',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.updatedAt), moment(b.updatedAt)),
      multiple: 6
    },
    render: (value: string) => <DateData date={value} />
  },
  {
    key: 'action',
    width: '10%',
    align: 'center',
    render: (value: CouncilForView) => <CouncilItemAction council={value} />
  }
];
