import { FileTextTwoTone, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
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

function sortByCreator(a: Thesis, b: Thesis): number {
  if (a.creator.id > b.creator.id) {
    return 1;
  }

  if (a.creator.id < b.creator.id) {
    return -1;
  }

  return 0;
}

function sortBySubject(a: Thesis, b: Thesis): number {
  if (a.subject > b.subject) {
    return 1;
  }

  if (a.subject < b.subject) {
    return -1;
  }

  return 0;
}

function sortByStartTime(a: Thesis, b: Thesis): number {
  if (moment(a.startTime).isBefore(b.startTime)) {
    return 1;
  }

  if (moment(b.startTime).isBefore(a.startTime)) {
    return -1;
  }

  return 0;
}

function sortByEndTime(a: Thesis, b: Thesis): number {
  if (moment(a.endTime).isBefore(b.endTime)) {
    return -1;
  }

  if (moment(b.endTime).isBefore(a.endTime)) {
    return 1;
  }

  return 0;
}

function sortByState(a: Thesis, b: Thesis): number {
  if (a.state > b.state) {
    return 1;
  }

  if (a.state < b.state) {
    return -1;
  }

  return 0;
}

function sortByStatus(a: Thesis, b: Thesis): number {
  if (a.status > b.status) {
    return 1;
  }

  if (a.status < b.status) {
    return -1;
  }

  return 0;
}

export const ThesisTableColumns: ColumnsType = [
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
    sorter: { compare: sortBySubject, multiple: 1 },
    render: (value: string) => <TextData text={value} />
  },
  {
    title: 'Người tạo',
    dataIndex: 'creator',
    sorter: { compare: sortByCreator, multiple: 2 },
    render: creatorRender
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startTime',
    sorter: { compare: sortByStartTime, multiple: 3 },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endTime',
    sorter: { compare: sortByEndTime, multiple: 4 },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: 'Giai đoạn hiện tại',
    dataIndex: 'state',
    sorter: { compare: sortByState, multiple: 5 },
    render: (value: ThesisState) => <ThesisStateRender state={value} />
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    sorter: { compare: sortByStatus, multiple: 6 },
    render: (value: ThesisStatus) => <ThesisStatusRender status={value} />
  }
];
