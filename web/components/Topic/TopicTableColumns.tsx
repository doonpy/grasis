import { FileTextTwoTone, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { sortByCreatedAt } from '../../libs/common/common.helper';
import CommonService from '../../libs/common/common.service';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { Topic } from '../../libs/topic/topic.interface';
import { TopicPath, TopicRegisterStatus } from '../../libs/topic/topic.resource';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import TopicRegisterStatusRender from './TopicRegisterStatusRender';
import TopicStatusRender from './TopicStatusRender';

function idRender(id: number, { thesisId }: Topic): JSX.Element {
  return (
    <Link href={CommonService.getInstance().replaceParams(TopicPath.SPECIFY, [thesisId, id])}>
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

function sortByCreator(a: Topic, b: Topic): number {
  if (a.creator.id > b.creator.id) {
    return 1;
  }

  if (a.creator.id < b.creator.id) {
    return -1;
  }

  return 0;
}

function sortBySubject(a: Topic, b: Topic): number {
  if (a.subject > b.subject) {
    return 1;
  }

  if (a.subject < b.subject) {
    return -1;
  }

  return 0;
}

function sortByRegisterStatus(a: Topic, b: Topic): number {
  if (a.registerStatus > b.registerStatus) {
    return 1;
  }

  if (a.registerStatus < b.registerStatus) {
    return -1;
  }

  return 0;
}

function sortByMaxStudent(a: Topic, b: Topic): number {
  if (a.maxStudent > b.maxStudent) {
    return 1;
  }

  if (a.maxStudent < b.maxStudent) {
    return -1;
  }

  return 0;
}

function sortByStatus(a: Topic, b: Topic): number {
  if (a.status > b.status) {
    return 1;
  }

  if (a.status < b.status) {
    return -1;
  }

  return 0;
}

export const TopicTableColumns: ColumnsType<Topic> = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: TopicTerminology.TOPIC_2,
    dataIndex: 'subject',
    width: '20%',
    sorter: { compare: sortBySubject, multiple: 1 },
    render: (value: string) => <TextData text={value} enableTruncate={true} />
  },
  {
    title: TopicTerminology.TOPIC_7,
    dataIndex: 'creator',
    sorter: { compare: sortByCreator, multiple: 2 },
    render: creatorRender
  },
  {
    title: TopicTerminology.TOPIC_5,
    dataIndex: 'maxStudent',
    align: 'center',
    sorter: { compare: sortByMaxStudent, multiple: 3 },
    render: (value: string) => <TextData text={value} />
  },
  {
    title: TopicTerminology.TOPIC_9,
    dataIndex: 'registerStatus',
    align: 'center',
    sorter: { compare: sortByRegisterStatus, multiple: 4 },
    render: (value: TopicRegisterStatus) => <TopicRegisterStatusRender registerStatus={value} />
  },
  {
    title: TopicTerminology.TOPIC_10,
    dataIndex: 'createdAt',
    sorter: { compare: sortByCreatedAt, multiple: 5 },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: TopicTerminology.TOPIC_8,
    dataIndex: 'status',
    align: 'center',
    sorter: { compare: sortByStatus, multiple: 6 },
    render: (value: TopicStateAction) => <TopicStatusRender status={value} />
  }
];