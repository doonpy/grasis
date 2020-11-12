import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { sortByDate, sortByNumber, sortByString } from '../../libs/common/common.helper';
import { THESIS_PATH_ROOT, ThesisState, ThesisStatus } from '../../libs/thesis/thesis.resource';
import { ThesisForListView } from '../../libs/thesis/thesis.type';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import ThesisCreatorRender from './ThesisCreatorRender';
import ThesisStateRender from './ThesisStateRender';
import ThesisStatusRender from './ThesisStatusRender';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${THESIS_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const ThesisTableColumns: ColumnsType<ThesisForListView> = [
  {
    title: '',
    key: 'id',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: ThesisTerminology.THESIS_10,
    key: 'subject',
    dataIndex: 'subject',
    width: '20%',
    sorter: { compare: (a, b) => sortByString(a.subject, b.subject), multiple: 1 },
    render: (value: string) => <TextData text={value} />
  },
  {
    title: ThesisTerminology.THESIS_11,
    key: 'creator',
    sorter: { compare: (a, b) => sortByNumber(a.creatorId, b.creatorId), multiple: 2 },
    render: (value, { creatorId, creatorInfo }) => (
      <ThesisCreatorRender creatorId={creatorId} creatorInfo={creatorInfo} />
    )
  },
  {
    title: ThesisTerminology.THESIS_12,
    dataIndex: 'startTime',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.startTime), moment(b.startTime)),
      multiple: 3
    },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: ThesisTerminology.THESIS_13,
    dataIndex: 'endTime',
    sorter: { compare: (a, b) => sortByDate(moment(a.endTime), moment(b.endTime)), multiple: 4 },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: ThesisTerminology.THESIS_19,
    dataIndex: 'state',
    sorter: { compare: (a, b) => sortByNumber(a.state, b.state), multiple: 5 },
    render: (value: ThesisState) => <ThesisStateRender state={value} />
  },
  {
    title: ThesisTerminology.THESIS_20,
    dataIndex: 'status',
    sorter: { compare: (a, b) => sortByNumber(a.status, b.status), multiple: 6 },
    render: (value: ThesisStatus) => <ThesisStatusRender status={value} />
  }
];
