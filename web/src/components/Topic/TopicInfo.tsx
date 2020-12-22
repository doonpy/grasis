import Icon, { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, message, Modal, Space } from 'antd';
import React, { useState } from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { TOPIC_PATH_ROOT, TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView } from '../../libs/topic/topic.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';
import TopicCreateAndUpdate from './TopicCreateAndUpdate';
import TopicRegisterStatusRender from './TopicRegisterStatusRender';

const { confirm } = Modal;

interface ComponentProps {
  topic: TopicForView;
  thesis: ThesisForView;
}

const TopicInfo: React.FC<ComponentProps> = ({ topic: initTopic, thesis }) => {
  const topicService = TopicService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [topic, setTopic] = useState<TopicForView>(initTopic);

  const onConfirmChangeRegisterStatus = async () => {
    confirm({
      title:
        topic.registerStatus === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_34
          : TopicTerminology.TOPIC_36,
      icon: <ExclamationCircleOutlined />,
      content:
        topic.registerStatus === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_35
          : TopicTerminology.TOPIC_37,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.changeRegisterStatus(topic.id);
          if (topic.registerStatus === TopicRegisterStatus.DISABLE) {
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
      topic.status !== TopicStateAction.APPROVED ||
      topic.creator.id !== loginUser.getId() ||
      thesis.state !== ThesisState.STUDENT_TOPIC_REGISTER
    ) {
      return <></>;
    }

    if (topic.registerStatus === TopicRegisterStatus.DISABLE) {
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
          await topicService.deleteById(topic.id);
          await topicService.redirectService.redirectTo(
            topicService.replaceParams(TOPIC_PATH_ROOT, [thesis.id])
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
          {topicService.canEdit(topic) && (
            <Space size="middle">
              <TopicCreateAndUpdate thesisId={thesis.id} topic={topic} setTopic={setTopic} />
              <Button type="primary" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
                {TopicTerminology.TOPIC_64}
              </Button>
            </Space>
          )}
          {changeRegisterStatusButton()}
        </>
      }>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_2}</b>} span={3}>
        <TextData text={topic.subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_7}</b>} span={3}>
        <LecturerFastView lecturer={topic.creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_5}</b>} span={3}>
        {topic.maxStudent}
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_52}</b>} span={3}>
        {topic.currentStudent}
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_9}</b>} span={3}>
        <TopicRegisterStatusRender registerStatus={topic.registerStatus} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_3}</b>} span={3}>
        <TextData text={topic.description} isParagraph={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={3}>
        <DateData date={topic.createdAt as string} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={3}>
        <DateData date={topic.updatedAt as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicInfo;
