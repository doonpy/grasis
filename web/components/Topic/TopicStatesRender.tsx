import Icon from '@ant-design/icons';
import { Space, Tag, Timeline } from 'antd';
import React from 'react';

import { TopicState } from '../../libs/topic/topic-state/topic-state.interface';
import {
  TopicStateActionColor,
  TopicStateActionIcon,
  TopicStateActionText
} from '../../libs/topic/topic-state/topic-state.resource';
import LecturerComment from '../Lecturer/LecturerComment';

interface ComponentProps {
  states: TopicState[];
}

const TopicStatesRender: React.FC<ComponentProps> = ({ states }) => {
  return (
    <Timeline>
      {states.map(({ createdAt, note, action, processor }, index) => {
        return (
          <Timeline.Item
            key={index}
            color={TopicStateActionColor[action]}
            dot={<Icon component={TopicStateActionIcon[action]} />}>
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
