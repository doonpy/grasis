import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import SignInAltIcon from '../../assets/svg/regular/sign-in-alt.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import { Topic } from '../../libs/topic/topic.type';
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
    currentStudent,
    status,
    creatorId,
    thesisId,
    id,
    students
  }
}) => {
  const topicService = TopicService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [registerStatusState, setRegisterStatusState] = useState<TopicRegisterStatus>(
    registerStatus
  );
  const [canRegister, setCanRegister] = useState<boolean>(
    !topicService.hasStudentParticipated(students)
  );

  const onConfirmChangeRegisterStatus = async () => {
    confirm({
      title:
        registerStatusState === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_34
          : TopicTerminology.TOPIC_36,
      icon: <ExclamationCircleOutlined />,
      content:
        registerStatusState === TopicRegisterStatus.DISABLE
          ? TopicTerminology.TOPIC_35
          : TopicTerminology.TOPIC_37,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.changeRegisterStatus(thesisId, id);
          if (registerStatusState === TopicRegisterStatus.DISABLE) {
            setRegisterStatusState(TopicRegisterStatus.ENABLE);
            message.success(TopicTerminology.TOPIC_47);
          } else {
            setRegisterStatusState(TopicRegisterStatus.DISABLE);
            message.success(TopicTerminology.TOPIC_48);
          }
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

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
          await topicService.registerTopic(thesisId, id, loginUser.getId());
          setCanRegister(false);
          message.success(TopicTerminology.TOPIC_45);
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

    if (registerStatusState === TopicRegisterStatus.DISABLE) {
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

  const registerTopicButton = () => {
    if (
      loginUser.isStudent() &&
      canRegister &&
      status === TopicStateAction.APPROVED &&
      registerStatusState === TopicRegisterStatus.ENABLE
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

  useEffect(() => {
    setRegisterStatusState(registerStatus);
  }, [registerStatus]);

  useEffect(() => {
    setCanRegister(!topicService.hasStudentParticipated(students));
  }, [topicService.hasStudentParticipated(students)]);

  return (
    <Descriptions
      title={
        <div>
          {registerTopicButton()}
          {changeRegisterStatusButton()}
        </div>
      }
      column={4}>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_2}</b>} span={4}>
        <TextData text={subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_7}</b>} span={4}>
        <LecturerInfo lecturer={creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_5}</b>} span={1}>
        {maxStudent}
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_52}</b>} span={1}>
        {currentStudent}
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
