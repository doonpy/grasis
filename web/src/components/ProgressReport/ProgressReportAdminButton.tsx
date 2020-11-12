import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import React, { useState } from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import EditIcon from '../../assets/svg/regular/edit.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import { IsPassed } from '../../libs/progress-report/progress-report.resource';
import ProgressReportService from '../../libs/progress-report/progress-report.service';
import { ProgressReportForView } from '../../libs/progress-report/progress-report.type';
import ProgressReportEditModal from './ProgressReportEditModal';

const { confirm } = Modal;

interface ComponentProps {
  progressReport: ProgressReportForView;
}

const ProgressReportAdminButton: React.FC<ComponentProps> = ({ progressReport }) => {
  const progressReportService = ProgressReportService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const onClickEditButton = () => {
    if (!editModalVisible) {
      setEditModalVisible(true);
    }
  };

  const onClickChangeResult = async (result: IsPassed) => {
    confirm({
      title: ProgressReportTerminology.PR_16,
      icon: <ExclamationCircleOutlined />,
      okText: ProgressReportTerminology.PR_17,
      cancelText: ProgressReportTerminology.PR_18,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          setLoading(true);
          await progressReportService.changeResult(
            progressReport.id,
            progressReport.topicId,
            result
          );
          message.success(ProgressReportTerminology.PR_19);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          await progressReportService.requestErrorHandler(error);
        }
      }
    });
  };

  const buttonRender = () => {
    switch (progressReport.isPassed) {
      case IsPassed.NOT_DECIDED:
        return (
          <>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={CheckCircleIcon} />}
              onClick={() => onClickChangeResult(IsPassed.TRUE)}>
              {ProgressReportTerminology.PR_13}
            </Button>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={MinusCircleIcon} />}
              onClick={() => onClickChangeResult(IsPassed.FALSE)}
              danger>
              {ProgressReportTerminology.PR_14}
            </Button>
          </>
        );
      case IsPassed.TRUE:
        return (
          <Button
            loading={loading}
            type="primary"
            icon={<Icon component={MinusCircleIcon} />}
            onClick={() => onClickChangeResult(IsPassed.FALSE)}
            danger>
            {ProgressReportTerminology.PR_14}
          </Button>
        );
      case IsPassed.FALSE:
        return (
          <Button
            loading={loading}
            type="primary"
            icon={<Icon component={CheckCircleIcon} />}
            onClick={() => onClickChangeResult(IsPassed.TRUE)}>
            {ProgressReportTerminology.PR_13}
          </Button>
        );
      default:
        return <></>;
    }
  };

  return (
    <Space>
      <ProgressReportEditModal
        progressReport={progressReport}
        visible={editModalVisible}
        setVisible={setEditModalVisible}
      />
      <Button type="primary" icon={<Icon component={EditIcon} />} onClick={onClickEditButton}>
        {ProgressReportTerminology.PR_8}
      </Button>
      {buttonRender()}
    </Space>
  );
};

export default ProgressReportAdminButton;
