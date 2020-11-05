import { Descriptions } from 'antd';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { Topic } from '../../libs/topic/topic.interface';
import LoginUser from '../../libs/user/instance/LoginUser';
import LecturerInfo from '../Lecturer/LecturerInfo';
import TopicChangeStatus from './TopicChangeStatus';
import TopicStatesRender from './TopicStatesRender';
import TopicStatusRender from './TopicStatusRender';

interface ComponentProps {
  topic: Topic;
}

const TopicPrivateInfo: React.FC<ComponentProps> = ({ topic }) => {
  const { approver, creatorId, status, states, approverId } = topic;
  const loginUser = LoginUser.getInstance();
  const creatorActions = [TopicStateAction.CANCELED];
  const approverActions = [
    TopicStateAction.WITHDRAW,
    TopicStateAction.APPROVED,
    TopicStateAction.REJECTED,
    TopicStateAction.SEND_BACK
  ];
  const notShowButtonActions = [
    TopicStateAction.APPROVED,
    TopicStateAction.REJECTED,
    TopicStateAction.CANCELED
  ];

  if (!loginUser.isAdmin() && loginUser.getId() !== creatorId) {
    return <></>;
  }

  const changeStatusRender = () => {
    if (
      notShowButtonActions.includes(status) ||
      (loginUser.getId() === creatorId && creatorActions.includes(status)) ||
      (loginUser.getId() === approverId && approverActions.includes(status))
    ) {
      return <></>;
    }

    return (
      <Descriptions.Item span={4}>
        <TopicChangeStatus topic={topic} />
      </Descriptions.Item>
    );
  };

  return (
    <Descriptions column={4}>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_14}</b>} span={2}>
        <LecturerInfo lecturer={approver} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_8}</b>} span={2}>
        <TopicStatusRender status={status} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_15}</b>} span={4}>
        <Descriptions bordered column={4}>
          <Descriptions.Item span={4}>
            <TopicStatesRender states={states} />
          </Descriptions.Item>
          {changeStatusRender()}
        </Descriptions>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicPrivateInfo;
