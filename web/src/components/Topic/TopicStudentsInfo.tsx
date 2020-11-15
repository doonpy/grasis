import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Empty,
  message,
  Modal,
  Space,
  Statistic,
  Table
} from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React from 'react';

import BanIcon from '../../assets/svg/regular/ban.svg';
import CheckIcon from '../../assets/svg/regular/check.svg';
import SigmaIcon from '../../assets/svg/regular/sigma.svg';
import SignInAltIcon from '../../assets/svg/regular/sign-in-alt.svg';
import UserPlusIcon from '../../assets/svg/regular/user-plus.svg';
import UsersClassIcon from '../../assets/svg/regular/users-class.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { TopicStudentStatus } from '../../libs/topic/topic-student/topic-student.resource';
import TopicStudentService from '../../libs/topic/topic-student/topic-student.service';
import { TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import { TopicStudentTableColumns } from './TopicStudentTableColumns';

const { confirm } = Modal;

interface ComponentProps {
  topicId: number;
  canFetch: boolean;
}

const TopicStudentInfo: React.FC<ComponentProps> = ({ topicId, canFetch }) => {
  const topicService = TopicService.getInstance();
  const topicStudentService = TopicStudentService.getInstance();
  const loginUser = LoginUser.getInstance();
  const pagination: PaginationProps = {
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    size: 'small',
    showSizeChanger: false
  };
  const { data: topicData } = topicService.useTopic(topicId, canFetch);
  const { data: topicStudentsData } = topicStudentService.useTopicStudents(
    topicId,
    pagination.current,
    pagination.pageSize
  );
  if (!topicData || !topicStudentsData) {
    return <Empty />;
  }

  let topicStudentTableColumn = [...TopicStudentTableColumns];
  if (loginUser.getId() !== topicData.topic.creator.id) {
    topicStudentTableColumn = topicStudentTableColumn.filter(({ key }) => key !== 'action');
  }

  const onConfirmRegisterTopic = async () => {
    confirm({
      title: TopicTerminology.TOPIC_39,
      icon: <ExclamationCircleOutlined />,
      content: TopicTerminology.TOPIC_40,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.registerTopic(topicId, loginUser.getId());
          message.success(TopicTerminology.TOPIC_45);
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  const registerTopicButton = () => {
    const isRegistered =
      topicStudentsData.students.findIndex(
        ({ id, status }) =>
          (status === TopicStudentStatus.APPROVED || status === TopicStudentStatus.PENDING) &&
          loginUser.getId() === id
      ) !== -1;
    if (
      loginUser.isStudent() &&
      !isRegistered &&
      topicData.topic.status === TopicStateAction.APPROVED &&
      topicData.topic.registerStatus === TopicRegisterStatus.ENABLE
    ) {
      return (
        <Button
          type="primary"
          icon={<Icon component={SignInAltIcon} />}
          onClick={onConfirmRegisterTopic}>
          {TopicTerminology.TOPIC_38}
        </Button>
      );
    }
  };

  const studentsStatistic = () => {
    if (loginUser.getId() !== topicData.topic.creator.id) {
      return <></>;
    }

    const total = topicStudentsData.students.length;
    const acceptAmount = topicStudentsData.students.filter(
      ({ status }) => status === TopicStudentStatus.APPROVED
    ).length;
    const rejectAmount = topicStudentsData.students.filter(
      ({ status }) => status === TopicStudentStatus.REJECTED
    ).length;
    const remainAmount = topicData.topic.maxStudent - topicData.topic.currentStudent;

    return (
      <Space size="large" split={<Divider type="vertical" />}>
        <Statistic
          title={TopicTerminology.TOPIC_5}
          prefix={<Icon component={UsersClassIcon} />}
          value={topicData.topic.maxStudent}
        />
        <Statistic
          title={TopicTerminology.TOPIC_51}
          prefix={<Icon component={SigmaIcon} />}
          value={total}
        />
        <Statistic
          title={TopicTerminology.TOPIC_22}
          prefix={<Icon component={CheckIcon} />}
          valueStyle={{ color: '#3f8600' }}
          value={acceptAmount}
        />
        <Statistic
          title={TopicTerminology.TOPIC_23}
          prefix={<Icon component={BanIcon} />}
          valueStyle={{ color: '#cf1322' }}
          value={rejectAmount}
        />
        <Statistic
          title={TopicTerminology.TOPIC_53}
          valueStyle={remainAmount === 0 ? { color: '#cf1322' } : { color: '#3f8600' }}
          prefix={<Icon component={UserPlusIcon} />}
          value={remainAmount}
        />
      </Space>
    );
  };

  return (
    <Descriptions title={registerTopicButton()}>
      <Descriptions.Item span={3}>
        <Table
          title={studentsStatistic}
          columns={topicStudentTableColumn}
          dataSource={topicStudentsData.students}
          bordered
          pagination={pagination}
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicStudentInfo;
