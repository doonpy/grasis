import { Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView } from '../../libs/topic/topic.type';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import TopicStateService from '../../libs/topic/topic-state/topic-state.service';
import { TopicStateForView } from '../../libs/topic/topic-state/topic-state.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import LecturerFastView from '../Lecturer/LecturerFastView';
import TopicChangeStatus from './TopicChangeStatus';
import TopicStatesRender from './TopicStatesRender';
import TopicStatusRender from './TopicStatusRender';

interface ComponentProps {
  topic: TopicForView;
  thesis: ThesisForView;
  canFetch: boolean;
}

const TopicPrivateInfo: React.FC<ComponentProps> = ({ topic, thesis, canFetch }) => {
  const topicService = TopicService.getInstance();
  const loginUser = LoginUser.getInstance();
  const topicStateService = TopicStateService.getInstance();
  const { data: topicStateData } = topicStateService.useTopicStates(
    topic.id,
    canFetch && topicService.hasPrivateContentPermission(thesis, topic)
  );
  const [states, setStates] = useState<TopicStateForView[]>(
    topicStateData ? topicStateData.states : []
  );
  const [currentState, setCurrentState] = useState<TopicStateAction>(topic.status);
  useEffect(() => {
    if (topicStateData) {
      setStates(topicStateData.states);
    }
  }, [topicStateData]);

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

  if (!loginUser.isAdmin() && loginUser.getId() !== topic.creator.id) {
    return <></>;
  }

  const changeStatusRender = () => {
    if (
      notShowButtonActions.includes(currentState) ||
      (((loginUser.getId() === topic.creator.id && creatorActions.includes(currentState)) ||
        (loginUser.getId() === topic.approver.id && approverActions.includes(currentState))) &&
        topic.approver.id !== topic.creator.id) // allow approval action when Administrator is creator.
    ) {
      return <></>;
    }

    return (
      <Descriptions.Item span={4}>
        <TopicChangeStatus
          topic={topic}
          setStates={setStates}
          currentState={currentState}
          setCurrentState={setCurrentState}
        />
      </Descriptions.Item>
    );
  };

  return (
    <Descriptions column={4}>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_14}</b>} span={2}>
        <LecturerFastView lecturer={topic.approver} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_8}</b>} span={2}>
        <TopicStatusRender status={currentState} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_15}</b>} span={4}>
        <Descriptions bordered column={4} style={{ width: '100%' }}>
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
