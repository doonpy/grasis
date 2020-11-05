import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { sortByDate, sortByNumber, sortByString } from '../../libs/common/common.helper';
import CommonService from '../../libs/common/common.service';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { Topic } from '../../libs/topic/topic.interface';
import { TopicPath, TopicRegisterStatus } from '../../libs/topic/topic.resource';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerInfo from '../Lecturer/LecturerInfo';
import TopicRegisterStatusRender from './TopicRegisterStatusRender';
import TopicStatusRender from './TopicStatusRender';

function idRender(id: number, { thesisId }: Topic): JSX.Element {
  return (
    <Link href={CommonService.getInstance().replaceParams(TopicPath.SPECIFY, [thesisId, id])}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
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
    key: 'subject',
    width: '20%',
    sorter: { compare: (a, b) => sortByString(a.subject, b.subject), multiple: 1 },
    render: (value: string) => <TextData text={value} enableTruncate={true} />
  },
  {
    title: TopicTerminology.TOPIC_7,
    dataIndex: 'creator',
    key: 'creator',
    sorter: { compare: (a, b) => sortByNumber(a.creatorId, b.creatorId), multiple: 2 },
    render: (value: Lecturer) => <LecturerInfo lecturer={value} />
  },
  {
    title: TopicTerminology.TOPIC_53,
    key: 'remainSlot',
    align: 'center',
    sorter: {
      compare: (a, b) =>
        sortByNumber(a.maxStudent - a.currentStudent, b.maxStudent - b.currentStudent),
      multiple: 3
    },
    render: (value, { currentStudent, maxStudent }) => (
      <TextData text={(maxStudent - currentStudent).toString()} />
    )
  },
  {
    title: TopicTerminology.TOPIC_5,
    dataIndex: 'maxStudent',
    key: 'maxStudent',
    align: 'center',
    sorter: { compare: (a, b) => sortByNumber(a.maxStudent, b.maxStudent), multiple: 4 },
    render: (value) => <TextData text={value} />
  },
  {
    title: TopicTerminology.TOPIC_9,
    dataIndex: 'registerStatus',
    key: 'registerStatus',
    align: 'center',
    sorter: { compare: (a, b) => sortByNumber(a.registerStatus, b.registerStatus), multiple: 5 },
    render: (value: TopicRegisterStatus) => <TopicRegisterStatusRender registerStatus={value} />
  },
  {
    title: TopicTerminology.TOPIC_10,
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.createdAt), moment(b.createdAt)),
      multiple: 6
    },
    render: (value: string) => <DateData date={value} dateOnly={true} />
  },
  {
    title: TopicTerminology.TOPIC_8,
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    sorter: { compare: (a, b) => sortByNumber(a.status, b.status), multiple: 7 },
    render: (value: TopicStateAction) => <TopicStatusRender status={value} />
  }
];
