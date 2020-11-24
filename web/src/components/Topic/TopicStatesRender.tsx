import Icon from '@ant-design/icons';
import { Empty, Space, Tag, Timeline } from 'antd';
import React from 'react';

import {
  TopicStateActionColor,
  TopicStateActionIcon,
  TopicStateActionText
} from '../../libs/topic/topic-state/topic-state.resource';
import { TopicStateForView } from '../../libs/topic/topic-state/topic-state.type';
import LecturerComment from '../Lecturer/LecturerComment';

interface ComponentProps {
  states: TopicStateForView[];
}

const TopicStatesRender: React.FC<ComponentProps> = ({ states }) => {
  if (states.length === 0) {
    return <Empty />;
  }

  return (
    <Timeline>
      {states.map(({ createdAt, note, action, processor }, index) => {
        return (
          <Timeline.Item
            key={index}
            color={TopicStateActionColor[action]}
            dot={
              <Icon
                style={{ color: TopicStateActionColor[action] }}
                component={TopicStateActionIcon[action]}
              />
            }>
            <Space>
              <Tag color={TopicStateActionColor[action]}>{TopicStateActionText[action]}</Tag>
            </Space>
            <LecturerComment lecturer={processor} date={createdAt} comment={note} />
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default TopicStatesRender;
