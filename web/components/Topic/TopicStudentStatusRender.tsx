import { Tag } from 'antd';
import React from 'react';

import {
  TopicStudentStatus,
  TopicStudentStatusColor,
  TopicStudentStatusText
} from '../../libs/topic/topic-student/topic-student.resource';

interface ComponentProps {
  status: TopicStudentStatus;
}

const TopicStudentStatusRender: React.FC<ComponentProps> = ({ status }) => {
  return <Tag color={TopicStudentStatusColor[status]}>{TopicStudentStatusText[status]}</Tag>;
};

export default TopicStudentStatusRender;
