import Icon from '@ant-design/icons';
import { Button, Drawer, Form, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import EditIcon from '../../../../assets/svg/regular/edit.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import ProgressReportAdminService from '../../../../libs/progress-report/admin.service';
import {
  ProgressReportForView,
  ProgressReportRequestBody
} from '../../../../libs/progress-report/progress-report.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import StateEditBaseItem from '../StateEditBaseItem';

interface ComponentProps {
  progressReport: ProgressReportForView;
  setProgressReport: React.Dispatch<ProgressReportForView>;
  validDateRange: [string | Moment, string | Moment];
  thesisCreatorId: number;
}

const ProgressReportEdit: React.FC<ComponentProps> = ({
  progressReport,
  setProgressReport,
  validDateRange,
  thesisCreatorId
}) => {
  const adminService = ProgressReportAdminService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();
  const onClickEditButton = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFormSubmit = async (formValues: ProgressReportRequestBody) => {
    setLoading(true);
    try {
      const { data } = await adminService.updateById(progressReport.id, formValues);
      setProgressReport({ ...progressReport, ...data.progressReport });
      message.success(ProgressReportTerminology.PR_21);
      setLoading(false);
      setVisible(false);
    } catch (error) {
      setLoading(false);
      await adminService.requestErrorHandler(error);
    }
  };

  useEffect(() => {
    if (!visible) {
      progressReport.time = moment(progressReport.time);
      form.setFieldsValue(progressReport);
    }
  }, [progressReport]);

  if (
    !loginUser.isAdmin() ||
    loginUser.getId() !== thesisCreatorId ||
    progressReport.result !== StateResult.NOT_DECIDED
  ) {
    return <></>;
  }

  return (
    <>
      <Drawer
        title={ProgressReportTerminology.PR_9}
        width={720}
        onClose={handleCancel}
        visible={visible}>
        <Form form={form} requiredMark={true} layout="vertical" onFinish={onFormSubmit}>
          <StateEditBaseItem validDateRange={validDateRange} />
          <Space size="middle">
            <Button loading={loading} onClick={handleOk} type="primary">
              {CommonTerminology.COMMON_9}
            </Button>
            <Button loading={loading} onClick={handleCancel} type="primary" danger>
              {CommonTerminology.COMMON_10}
            </Button>
          </Space>
        </Form>
      </Drawer>
      <Button type="primary" icon={<Icon component={EditIcon} />} onClick={onClickEditButton}>
        {TopicTerminology.TOPIC_59}
      </Button>
    </>
  );
};

export default ProgressReportEdit;
