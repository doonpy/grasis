import { Tag } from 'antd';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicRegisterStatus } from '../../libs/topic/topic.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  registerStatus: TopicRegisterStatus;
}

const TopicRegisterStatusRender: React.FC<ComponentProps> = ({ registerStatus }) => {
  if (registerStatus === TopicRegisterStatus.ENABLE) {
    return <Tag color="green">{TopicTerminology.TOPIC_32}</Tag>;
  }

  if (registerStatus === TopicRegisterStatus.DISABLE) {
    return <Tag color="red">{TopicTerminology.TOPIC_33}</Tag>;
  }

  return <TextData />;
};

export default TopicRegisterStatusRender;
