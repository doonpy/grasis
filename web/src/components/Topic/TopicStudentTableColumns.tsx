import Icon, { ExclamationCircleOutlined, FileTextTwoTone } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import CheckIcon from '../../assets/svg/regular/check.svg';
import MinusIcon from '../../assets/svg/regular/minus.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import UserTerminology from '../../assets/terminology/user.terminology';
import { sortByDate, sortByNumber, sortByString } from '../../libs/common/common.helper';
import CommonService from '../../libs/common/common.service';
import { StudentPath } from '../../libs/student/student.resource';
import { TopicStudent } from '../../libs/topic/topic-student/topic-student.interface';
import { TopicStudentStatus } from '../../libs/topic/topic-student/topic-student.resource';
import TopicService from '../../libs/topic/topic.service';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import TopicStudentStatusRender from './TopicStudentStatusRender';

const { confirm } = Modal;

function idRender(id: number, { studentId }: TopicStudent): JSX.Element {
  return (
    <Link href={CommonService.getInstance().replaceParams(StudentPath.SPECIFY, [studentId])}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

function actionRender({
  topicId,
  topic: { thesisId },
  studentId,
  status
}: TopicStudent): JSX.Element {
  const [disableButton, setDisableButton] = useState<TopicStudentStatus>(status);
  const topicService = TopicService.getInstance();
  const onConfirmChangeStudentRegisterStatus: (status: TopicStudentStatus) => void = (status) => {
    confirm({
      title:
        status === TopicStudentStatus.APPROVED
          ? TopicTerminology.TOPIC_49
          : TopicTerminology.TOPIC_50,
      icon: <ExclamationCircleOutlined />,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.changeStudentRegisterStatus(thesisId, topicId, studentId, status);
          message.success(TopicTerminology.TOPIC_43);
          setDisableButton(status);
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  useEffect(() => {
    setDisableButton(status);
  }, [status]);

  return (
    <Space size="middle">
      <Button
        shape="circle"
        type="primary"
        icon={<Icon component={CheckIcon} />}
        onClick={() => onConfirmChangeStudentRegisterStatus(TopicStudentStatus.APPROVED)}
        disabled={disableButton !== TopicStudentStatus.PENDING}
      />
      <Button
        shape="circle"
        type="primary"
        icon={<Icon component={MinusIcon} />}
        danger
        onClick={() => onConfirmChangeStudentRegisterStatus(TopicStudentStatus.REJECTED)}
        disabled={disableButton !== TopicStudentStatus.PENDING}
      />
    </Space>
  );
}

export const TopicStudentTableColumns: ColumnsType<TopicStudent> = [
  {
    key: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: 'Mã sinh viên',
    key: 'studentId',
    width: '10%',
    sorter: {
      compare: (a, b) => sortByString(a.student.studentId, b.student.studentId),
      multiple: 1
    },
    render: (record) => <TextData text={record.student.studentId} />
  },
  {
    title: UserTerminology.USER_5,
    key: 'lastname',
    sorter: {
      compare: (a, b) => sortByString(a.student.user.lastname, b.student.user.lastname),
      multiple: 2
    },
    render: (
      value,
      {
        student: {
          user: { lastname }
        }
      }
    ) => <TextData text={lastname} />
  },
  {
    title: UserTerminology.USER_4,
    key: 'firstname',
    sorter: {
      compare: (a, b) => sortByString(a.student.user.firstname, b.student.user.firstname),
      multiple: 3
    },
    render: ({
      student: {
        user: { firstname }
      }
    }) => <TextData text={firstname} />
  },
  {
    title: TopicTerminology.TOPIC_42,
    key: 'createdAt',
    dataIndex: 'createdAt',
    sorter: {
      compare: (a, b) => sortByDate(moment(a.createdAt), moment(b.createdAt)),
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
    align: 'center',
    render: actionRender
  }
];