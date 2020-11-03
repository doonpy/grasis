import Icon from '@ant-design/icons';
import { Button, Space } from 'antd';
import React from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import SendBackIcon from '../../assets/svg/regular/send-back.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';

interface ComponentProps {
  onButtonClick: (action: TopicStateAction) => void;
}

const TopicChangeStatusButtonForApprover: React.FC<ComponentProps> = ({ onButtonClick }) => {
  return (
    <Space size="large">
      <Button
        type="primary"
        icon={<Icon component={CheckCircleIcon} />}
        onClick={() => onButtonClick(TopicStateAction.APPROVED)}>
        {TopicTerminology.TOPIC_22}
      </Button>
      <Button
        type="primary"
        icon={<Icon component={SendBackIcon} />}
        onClick={() => onButtonClick(TopicStateAction.SEND_BACK)}>
        {TopicTerminology.TOPIC_24}
      </Button>
      <Button
        type="primary"
        danger
        icon={<Icon component={MinusCircleIcon} />}
        onClick={() => onButtonClick(TopicStateAction.REJECTED)}>
        {TopicTerminology.TOPIC_23}
      </Button>
    </Space>
  );
};

export default TopicChangeStatusButtonForApprover;
