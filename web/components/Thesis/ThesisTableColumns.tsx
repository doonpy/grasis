import { FileTextTwoTone, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { sortByDate, sortByNumber, sortByString } from '../../libs/common/common.helper';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { Thesis } from '../../libs/thesis/thesis.interface';
import { THESIS_PATH_ROOT, ThesisState, ThesisStatus } from '../../libs/thesis/thesis.resource';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import ThesisStateRender from './ThesisStateRender';
import ThesisStatusRender from './ThesisStatusRender';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${THESIS_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

function creatorRender({ id, lecturerId, user: { firstname, lastname } }: Lecturer): JSX.Element {
  const fullName = `${lastname || ''} ${firstname || ''}`;
  const lecturerIdStr = lecturerId ? `(${lecturerId})` : '';

  return (
    <Space>
      <Avatar src={getAvatarUrl(id)} size="small" icon={<UserOutlined />}>
        {fullName[0]}
      </Avatar>
      {`${fullName} ${lecturerIdStr}`}
    </Space>
  );
}

export const ThesisTableColumns: ColumnsType<Thesis> = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'subject',
    width: '20%',
    sorter: { compare: (a, b) => sortByString(a.subject, b.subject), multiple: 1 },
    render: (value: string) => <TextData text={value} />
  },
  {
    title: 'Người tạo',
    dataIndex: 'creator',
    sorter: { compare: (a, b) => sortByNumber(a.creatorId, b.creatorId), multiple: 2 },
    render: creatorRender
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startTime',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.startTime), moment(b.startTime)),
      multiple: 3
    },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endTime',
    sorter: { compare: (a, b) => sortByDate(moment(a.endTime), moment(b.endTime)), multiple: 4 },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: 'Giai đoạn hiện tại',
    dataIndex: 'state',
    sorter: { compare: (a, b) => sortByNumber(a.state, b.state), multiple: 5 },
    render: (value: ThesisState) => <ThesisStateRender state={value} />
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    sorter: { compare: (a, b) => sortByNumber(a.status, b.status), multiple: 6 },
    render: (value: ThesisStatus) => <ThesisStatusRender status={value} />
  }
];
