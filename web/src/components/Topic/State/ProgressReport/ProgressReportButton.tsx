import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import React, { useState } from 'react';

import CheckCircleIcon from '../../../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../../../assets/svg/regular/minus-circle.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import { ProgressReportResultText } from '../../../../libs/progress-report/progress-report.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import { ProgressReportForView } from '../../../../libs/progress-report/progress-report.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';

const { confirm } = Modal;

interface ComponentProps {
  progressReport: ProgressReportForView;
  thesisCreatorId: number;
}

const ProgressReportButton: React.FC<ComponentProps> = ({ progressReport, thesisCreatorId }) => {
  const progressReportService = ProgressReportService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const onClickChangeResult = async (result: StateResult) => {
    confirm({
      title: ProgressReportTerminology.PR_16,
      icon: <ExclamationCircleOutlined />,
      okText: CommonTerminology.COMMON_9,
      cancelText: CommonTerminology.COMMON_10,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          setLoading(true);
          await progressReportService.changeResult(progressReport.id, result);
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
    switch (progressReport.result) {
      case StateResult.NOT_DECIDED:
        return (
          <>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={CheckCircleIcon} />}
              onClick={() => onClickChangeResult(StateResult.TRUE)}>
              {ProgressReportResultText[StateResult.FALSE]}
            </Button>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={MinusCircleIcon} />}
              onClick={() => onClickChangeResult(StateResult.FALSE)}
              danger>
              {ProgressReportResultText[StateResult.TRUE]}
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
            {ProgressReportResultText[StateResult.FALSE]}
          </Button>
        );
      case StateResult.FALSE:
        return (
          <Button
            loading={loading}
            type="primary"
            icon={<Icon component={CheckCircleIcon} />}
            onClick={() => onClickChangeResult(StateResult.TRUE)}>
            {ProgressReportResultText[StateResult.TRUE]}
          </Button>
        );
      default:
        return <></>;
    }
  };

  if (thesisCreatorId !== loginUser.getId()) {
    return <></>;
  }

  return <Space>{buttonRender()}</Space>;
};

export default ProgressReportButton;
