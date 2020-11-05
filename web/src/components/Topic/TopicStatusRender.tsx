import { Tag } from 'antd';
import React from 'react';

import {
  TopicStateAction,
  TopicStateActionColor,
  TopicStateActionText
} from '../../libs/topic/topic-state/topic-state.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  status?: TopicStateAction;
}

const TopicStatusRender: React.FC<ComponentProps> = ({ status }) => {
  if (!status) {
    return <TextData />;
  }

  return <Tag color={TopicStateActionColor[status]}>{TopicStateActionText[status]}</Tag>;
};

export default TopicStatusRender;
