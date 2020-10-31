import Icon, { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space } from 'antd';
import React from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { Topic } from '../../libs/topic/topic.interface';
import { TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import TextData from '../Common/TextData';
import LecturerInfo from '../Lecturer/LecturerInfo';
import TopicRegisterStatusRender from './TopicRegisterStatusRender';

const { confirm } = Modal;

interface ComponentProps {
  topic: Topic;
}

const TopicInfo: React.FC<ComponentProps> = ({
  topic: {
    subject,
    description,
    maxStudent,
    creator,
    registerStatus,
    status,
    creatorId,
    thesisId,
    id
  }
}) => {
  const topicService = TopicService.getInstance();
  const loginUser = LoginUser.getInstance();

  const onConfirmChangeRegisterStatus = async () => {
    confirm({
      title:
        registerStatus === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_34
          : TopicTerminology.TOPIC_36,
      icon: <ExclamationCircleOutlined />,
      content:
        registerStatus === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_35
          : TopicTerminology.TOPIC_37,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.changeRegisterStatus(thesisId, id);
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  const changeRegisterStatusButton = () => {
    if (status !== TopicStateAction.APPROVED || creatorId !== loginUser.getId()) {
      return <></>;
    }

    if (registerStatus === TopicRegisterStatus.DISABLE) {
      return (
        <Button
          type="primary"
          icon={<Icon component={CheckCircleIcon} />}
          onClick={onConfirmChangeRegisterStatus}>
          {TopicTerminology.TOPIC_32}
        </Button>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={<Icon component={MinusCircleIcon} />}
          onClick={onConfirmChangeRegisterStatus}
          danger>
          {TopicTerminology.TOPIC_33}
        </Button>
      );
    }
  };

  return (
    <Descriptions
      title={
        <Space>
          <InfoCircleOutlined />
          {TopicTerminology.TOPIC_12}
        </Space>
      }
      column={4}
      extra={changeRegisterStatusButton()}>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_2}</b>} span={4}>
        <TextData text={subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_7}</b>} span={4}>
        <LecturerInfo lecturer={creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_5}</b>} span={2}>
        {maxStudent}
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_9}</b>} span={2}>
        <TopicRegisterStatusRender registerStatus={registerStatus} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_3}</b>} span={4}>
        <TextData text={description} isParagraph={true} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicInfo;
