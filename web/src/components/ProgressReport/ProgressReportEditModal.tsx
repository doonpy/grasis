import { DatePicker, Form, Input, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import ProgressReportAdminService from '../../libs/progress-report/admin.service';
import {
  ProgressReportForView,
  ProgressReportRequestBody
} from '../../libs/progress-report/progress-report.type';
import ThesisService from '../../libs/thesis/thesis.service';

interface ComponentProps {
  progressReport: ProgressReportForView;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ProgressReportEditModal: React.FC<ComponentProps> = ({
  progressReport,
  visible,
  setVisible
}) => {
  const thesisService = ThesisService.getInstance();
  const adminService = ProgressReportAdminService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const router = useRouter();
  const thesisId = parseInt(router.query.thesisId as string);
  const { data: thesisData } = thesisService.useThesis(thesisId);

  const dateRange = (date: Moment): boolean => {
    if (thesisData) {
      const { studentTopicRegister, progressReport } = thesisData.thesis;

      return (
        date.isSameOrBefore(studentTopicRegister, 'day') || date.isAfter(progressReport, 'day')
      );
    }

    return false;
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
      await adminService.updateById(progressReport.topicId, progressReport.id, formValues);
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

  return (
    <Modal
      confirmLoading={loading}
      title={ProgressReportTerminology.PR_9}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}>
      <Form
        form={form}
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 4 }}
        onFinish={onFormSubmit}>
        <Form.Item name="time" label={ProgressReportTerminology.PR_2}>
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
            disabledDate={dateRange}
          />
        </Form.Item>
        <Form.Item name="place" label={ProgressReportTerminology.PR_3}>
          <Input />
        </Form.Item>
        <Form.Item name="note" label={ProgressReportTerminology.PR_4}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProgressReportEditModal;
