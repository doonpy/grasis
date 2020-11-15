import { Descriptions, Empty } from 'antd';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import ThesisService from '../../libs/thesis/thesis.service';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import TopicStateService from '../../libs/topic/topic-state/topic-state.service';
import TopicService from '../../libs/topic/topic.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import LecturerFastView from '../Lecturer/LecturerFastView';
import TopicChangeStatus from './TopicChangeStatus';
import TopicStatesRender from './TopicStatesRender';
import TopicStatusRender from './TopicStatusRender';

interface ComponentProps {
  topicId: number;
  thesisId: number;
  canFetch: boolean;
}

const TopicPrivateInfo: React.FC<ComponentProps> = ({ topicId, thesisId, canFetch }) => {
  const topicService = TopicService.getInstance();
  const thesisService = ThesisService.getInstance();
  const loginUser = LoginUser.getInstance();
  const { data: thesisData } = thesisService.useThesis(thesisId, canFetch);
  const { data: topicData } = topicService.useTopic(topicId, canFetch);
  const topicStateService = TopicStateService.getInstance();
  const { data: topicStateData } = topicStateService.useTopicStates(
    topicId,
    canFetch &&
      thesisData &&
      topicData &&
      topicService.hasPrivateContentPermission(thesisData.thesis, topicData.topic)
  );
  if (!topicData || !thesisData) {
    return <Empty description={TopicTerminology.TOPIC_63} />;
  }

  if (!topicService.hasPrivateContentPermission(thesisData.thesis, topicData.topic)) {
    return <Empty description={TopicTerminology.TOPIC_65} />;
  }

  if (!topicStateData) {
    return <Empty description={TopicTerminology.TOPIC_66} />;
  }

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

  if (!loginUser.isAdmin() && loginUser.getId() !== topicData.topic.creator.id) {
    return <></>;
  }

  const changeStatusRender = () => {
    if (
      notShowButtonActions.includes(topicData.topic.status) ||
      (loginUser.getId() === topicData.topic.creator.id &&
        creatorActions.includes(topicData.topic.status)) ||
      (loginUser.getId() === topicData.topic.approver.id &&
        approverActions.includes(topicData.topic.status))
    ) {
      return <></>;
    }

    return (
      <Descriptions.Item span={4}>
        <TopicChangeStatus thesisId={thesisId} topic={topicData.topic} />
      </Descriptions.Item>
    );
  };

  return (
    <Descriptions column={4}>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_14}</b>} span={2}>
        <LecturerFastView lecturer={topicData.topic.approver} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_8}</b>} span={2}>
        <TopicStatusRender status={topicData.topic.status} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_15}</b>} span={4}>
        <Descriptions bordered column={4}>
          <Descriptions.Item span={4}>
            <TopicStatesRender states={topicStateData.states} />
          </Descriptions.Item>
          {changeStatusRender()}
        </Descriptions>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicPrivateInfo;
