import { Descriptions } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicForView } from '../../libs/topic/topic.type';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';

interface ComponentProps {
  topic: TopicForView;
}

const TopicInfoMobile: React.FC<ComponentProps> = ({ topic }) => {
  return (
    <Descriptions bordered size="small" column={3}>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_2}</b>} span={3}>
        <TextData text={topic.subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{TopicTerminology.TOPIC_7}</b>} span={3}>
        <LecturerFastView lecturer={topic.creator} />
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

export default TopicInfoMobile;
