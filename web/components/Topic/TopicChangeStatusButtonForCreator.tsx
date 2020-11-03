import Icon from '@ant-design/icons';
import { Button, Space } from 'antd';
import React from 'react';

import ArrowAltCircleDown from '../../assets/svg/regular/arrow-alt-circle-down.svg';
import BanIcon from '../../assets/svg/regular/ban.svg';
import PaperPlanIcon from '../../assets/svg/regular/paper-plane.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';

interface ComponentProps {
  onButtonClick: (action: TopicStateAction) => void;
  withdrawOnly?: boolean;
}

const TopicChangeStatusButtonForCreator: React.FC<ComponentProps> = ({
  onButtonClick,
  withdrawOnly
}) => {
  if (withdrawOnly) {
    return (
      <Button
        type="primary"
        icon={<Icon component={ArrowAltCircleDown} />}
        onClick={() => onButtonClick(TopicStateAction.WITHDRAW)}>
        {TopicTerminology.TOPIC_26}
      </Button>
    );
  }

  return (
    <Space size="large">
      <Button
        type="primary"
        icon={<Icon component={PaperPlanIcon} />}
        onClick={() => onButtonClick(TopicStateAction.SEND_REQUEST)}>
        {TopicTerminology.TOPIC_30}
      </Button>
      <Button
        type="primary"
        danger
        icon={<Icon component={BanIcon} />}
        onClick={() => onButtonClick(TopicStateAction.CANCELED)}>
        {TopicTerminology.TOPIC_29}
      </Button>
    </Space>
  );
};

export default TopicChangeStatusButtonForCreator;
