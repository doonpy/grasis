import Icon, { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Empty, message, Modal, Space } from 'antd';
import React from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { TOPIC_PATH_ROOT, TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';
import TopicCreateAndUpdate from './TopicCreateAndUpdate';
import TopicRegisterStatusRender from './TopicRegisterStatusRender';

const { confirm } = Modal;

interface ComponentProps {
  topicId: number;
  thesisId: number;
  canFetch: boolean;
}

const TopicInfo: React.FC<ComponentProps> = ({ topicId, thesisId, canFetch }) => {
  const topicService = TopicService.getInstance();
  const { data } = topicService.useTopic(topicId, canFetch);
  const loginUser = LoginUser.getInstance();
  if (!data) {
    return <Empty description={TopicTerminology.TOPIC_63} />;
  }

  const onConfirmChangeRegisterStatus = async () => {
    confirm({
      title:
        data.topic.registerStatus === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_34
          : TopicTerminology.TOPIC_36,
      icon: <ExclamationCircleOutlined />,
      content:
        data.topic.registerStatus === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_35
          : TopicTerminology.TOPIC_37,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.changeRegisterStatus(data.topic.id);
          if (data.topic.registerStatus === TopicRegisterStatus.DISABLE) {
            message.success(TopicTerminology.TOPIC_47);
          } else {
            message.success(TopicTerminology.TOPIC_48);
          }
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  const changeRegisterStatusButton = () => {
    if (
      data.topic.status !== TopicStateAction.APPROVED ||
      data.topic.creator.id !== loginUser.getId()
    ) {
      return <></>;
    }

    if (data.topic.registerStatus === TopicRegisterStatus.DISABLE) {
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

  const showDeleteConfirm = () => {
    confirm({
      title: TopicTerminology.TOPIC_17,
      icon: <ExclamationCircleOutlined />,
      content: TopicTerminology.TOPIC_18,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.deleteById(topicId);
          await topicService.redirectService.redirectTo(
            topicService.replaceParams(TOPIC_PATH_ROOT, [thesisId])
          );
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Descriptions
      bordered
      title={
        <>
          {topicService.canEdit(data.topic) && (
            <Space size="middle">
              <TopicCreateAndUpdate thesisId={thesisId} topic={data.topic} />
              <Button type="primary" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
                {TopicTerminology.TOPIC_64}
              </Button>
            </Space>
          )}
          {changeRegisterStatusButton()}
        </>
      }>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_2}</b>} span={3}>
        <TextData text={data.topic.subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_7}</b>} span={3}>
        <LecturerFastView lecturer={data.topic.creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_5}</b>} span={3}>
        {data.topic.maxStudent}
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_52}</b>} span={3}>
        {data.topic.currentStudent}
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_9}</b>} span={3}>
        <TopicRegisterStatusRender registerStatus={data.topic.registerStatus} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_3}</b>} span={3}>
        <TextData text={data.topic.description} isParagraph={true} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicInfo;
