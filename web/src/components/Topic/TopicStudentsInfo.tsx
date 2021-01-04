import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, message, Modal, Space, Statistic, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useEffect, useState } from 'react';

import BanIcon from '../../assets/svg/regular/ban.svg';
import CheckIcon from '../../assets/svg/regular/check.svg';
import SigmaIcon from '../../assets/svg/regular/sigma.svg';
import SignInAltIcon from '../../assets/svg/regular/sign-in-alt.svg';
import UserPlusIcon from '../../assets/svg/regular/user-plus.svg';
import UsersClassIcon from '../../assets/svg/regular/users-class.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView } from '../../libs/topic/topic.type';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { TopicStudentStatus } from '../../libs/topic/topic-student/topic-student.resource';
import TopicStudentService from '../../libs/topic/topic-student/topic-student.service';
import { TopicStudentForView } from '../../libs/topic/topic-student/topic-student.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import TopicStudentRegisterAction from './TopicStudentRegisterAction';
import { TopicStudentTableColumns } from './TopicStudentTableColumns';

const { confirm } = Modal;

interface ComponentProps {
  topic: TopicForView;
  canFetch: boolean;
}

const TopicStudentInfo: React.FC<ComponentProps> = ({ topic: initTopic, canFetch }) => {
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
  const [topic, setTopic] = useState<TopicForView>(initTopic);
  const { data: topicStudentsData } = topicStudentService.useTopicStudents(
    topic.id,
    pagination.current,
    pagination.pageSize,
    canFetch
  );
  const [topicStudents, setTopicStudents] = useState<TopicStudentForView[]>(
    topicStudentsData ? topicStudentsData.students : []
  );
  useEffect(() => {
    if (topicStudentsData) {
      setTopicStudents(topicStudentsData.students);
    }
  }, [topicStudentsData]);

  let topicStudentTableColumn = [...TopicStudentTableColumns];
  if (loginUser.getId() !== topic.creator.id) {
    topicStudentTableColumn = topicStudentTableColumn.filter(({ key }) => key !== 'action');
  } else {
    const actionColumn = topicStudentTableColumn.find(({ key }) => key === 'action');
    if (actionColumn) {
      actionColumn.render = (value: TopicStudentForView) => (
        <TopicStudentRegisterAction
          topicStudent={value}
          topic={topic}
          setTopic={setTopic}
          topicStudents={topicStudents}
          setTopicStudents={setTopicStudents}
        />
      );
    }
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
          const { data } = await topicService.registerTopic(topic.id, loginUser.getId());
          setTopicStudents([...topicStudents, data.student]);
          message.success(TopicTerminology.TOPIC_45);
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  const registerTopicButton = () => {
    const isRegistered =
      topicStudents.findIndex(
        ({ id, status }) =>
          (status === TopicStudentStatus.APPROVED || status === TopicStudentStatus.PENDING) &&
          loginUser.getId() === id
      ) !== -1;
    if (
      loginUser.isStudent() &&
      !isRegistered &&
      topic.status === TopicStateAction.APPROVED &&
      topic.registerStatus === TopicRegisterStatus.ENABLE
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
    if (loginUser.getId() !== topic.creator.id) {
      return <></>;
    }

    const total = topicStudents.length;
    const acceptAmount = topicStudents.filter(
      ({ status }) => status === TopicStudentStatus.APPROVED
    ).length;
    const rejectAmount = topicStudents.filter(
      ({ status }) => status === TopicStudentStatus.REJECTED
    ).length;
    const remainAmount = topic.maxStudent - topic.currentStudent;

    return (
      <Space size="large" split={<Divider type="vertical" />}>
        <Statistic
          title={TopicTerminology.TOPIC_5}
          prefix={<Icon component={UsersClassIcon} />}
          value={topic.maxStudent}
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
          dataSource={topicStudents}
          bordered
          pagination={pagination}
          style={{ width: '100%' }}
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicStudentInfo;
