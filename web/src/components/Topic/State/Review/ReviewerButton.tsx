import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import React, { useState } from 'react';

import CheckCircleIcon from '../../../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../../../assets/svg/regular/minus-circle.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import { ReviewResultText } from '../../../../libs/review/review.resource';
import ReviewService from '../../../../libs/review/review.service';
import { ProgressReport } from '../../../../libs/review/review.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';

const { confirm } = Modal;

interface ComponentProps {
  review: ProgressReport;
}

const ReviewerButton: React.FC<ComponentProps> = ({ review }) => {
  const progressReportService = ReviewService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const onClickChangeResult = async (result: StateResult) => {
    confirm({
      title: ReviewTerminology.REVIEW_6,
      icon: <ExclamationCircleOutlined />,
      okText: CommonTerminology.COMMON_9,
      cancelText: CommonTerminology.COMMON_10,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          setLoading(true);
          await progressReportService.changeResult(review.id, result);
          message.success(TopicTerminology.TOPIC_61);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          await progressReportService.requestErrorHandler(error);
        }
      }
    });
  };

  const buttonRender = () => {
    switch (review.result) {
      case StateResult.NOT_DECIDED:
        return (
          <>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={CheckCircleIcon} />}
              onClick={() => onClickChangeResult(StateResult.TRUE)}>
              {ReviewResultText[StateResult.FALSE]}
            </Button>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={MinusCircleIcon} />}
              onClick={() => onClickChangeResult(StateResult.FALSE)}
              danger>
              {ReviewResultText[StateResult.TRUE]}
            </Button>
          </>
        );
      case StateResult.TRUE:
        return (
          <Button
            loading={loading}
            type="primary"
            icon={<Icon component={MinusCircleIcon} />}
            onClick={() => onClickChangeResult(StateResult.FALSE)}
            danger>
            {ReviewResultText[StateResult.FALSE]}
          </Button>
        );
      case StateResult.FALSE:
        return (
          <Button
            loading={loading}
            type="primary"
            icon={<Icon component={CheckCircleIcon} />}
            onClick={() => onClickChangeResult(StateResult.TRUE)}>
            {ReviewResultText[StateResult.TRUE]}
          </Button>
        );
      default:
        return <></>;
    }
  };

  if (!review.reviewer || review.reviewer.id !== loginUser.getId()) {
    return <></>;
  }

  return <Space>{buttonRender()}</Space>;
};

export default ReviewerButton;
