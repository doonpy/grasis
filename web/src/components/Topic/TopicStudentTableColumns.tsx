import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import UserTerminology from '../../assets/terminology/user.terminology';
import { sortByDate, sortByNumber, sortByString } from '../../libs/common/common.helper';
import CommonService from '../../libs/common/common.service';
import { StudentPath } from '../../libs/student/student.resource';
import { TopicStudentStatus } from '../../libs/topic/topic-student/topic-student.resource';
import { TopicStudentForView } from '../../libs/topic/topic-student/topic-student.type';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import TopicStudentStatusRender from './TopicStudentStatusRender';

function idRender(id: number): JSX.Element {
  return (
    <Link href={CommonService.getInstance().replaceParams(StudentPath.SPECIFY, [id])}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const TopicStudentTableColumns: ColumnsType<TopicStudentForView> = [
  {
    key: 'id',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: 'Mã sinh viên',
    key: 'studentId',
    width: '10%',
    sorter: {
      compare: (a, b) => sortByString(a.studentId, b.studentId),
      multiple: 1
    },
    render: (record) => <TextData text={record.studentId} />
  },
  {
    title: UserTerminology.USER_5,
    key: 'lastname',
    sorter: {
      compare: (a, b) => sortByString(a.lastname, b.lastname),
      multiple: 2
    },
    render: (value, { lastname }) => <TextData text={lastname} />
  },
  {
    title: UserTerminology.USER_4,
    key: 'firstname',
    sorter: {
      compare: (a, b) => sortByString(a.firstname, b.firstname),
      multiple: 3
    },
    render: (value, { firstname }) => <TextData text={firstname} />
  },
  {
    title: TopicTerminology.TOPIC_42,
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.updatedAt), moment(b.updatedAt)),
      multiple: 4
    },
    render: (value: string) => <DateData date={value} isRelative={true} />
  },
  {
    title: TopicTerminology.TOPIC_41,
    key: 'status',
    dataIndex: 'status',
    sorter: {
      compare: (a, b) => sortByNumber(a.status, b.status),
      multiple: 5
    },
    render: (value: TopicStudentStatus) => <TopicStudentStatusRender status={value} />
  },
  {
    key: 'action',
    width: '5%',
    align: 'center'
    // render: (value: TopicStudentForView) => (
    //   <TopicStudentRegisterAction topicStudent={value} test={() => console.log('as')} />
    // )
  }
];
