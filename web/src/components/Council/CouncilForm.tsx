import { Button, Drawer, Form, Input, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import CouncilAdminService from '../../libs/council/admin.service';
import { CouncilRequestBodyField } from '../../libs/council/council.resource';
import { CouncilForView, CouncilRequestBody } from '../../libs/council/council.type';
import ThesisSelectLecturerAttendee from '../Thesis/ThesisSelectLecturerAttendee';

interface ComponentProps {
  thesisId: number;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  council?: CouncilForView;
}

const CouncilForm: React.FC<ComponentProps> = ({ thesisId, council, visible, setVisible }) => {
  const councilService = CouncilAdminService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = useForm<CouncilRequestBody>();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    if (!council) {
      form.resetFields();
    }
    setVisible(false);
  };

  const handleSubmitButton = async (formValues: CouncilRequestBody) => {
    try {
      setLoading(true);
      formValues.thesisId = thesisId;
      if (council) {
        await councilService.updateById(council.id, formValues);
        message.success(CouncilTerminology.COUNCIL_13);
      } else {
        await councilService.create(formValues);
        message.success(CouncilTerminology.COUNCIL_12);
      }
      setVisible(false);
      setLoading(false);
    } catch (error) {
      await councilService.requestErrorHandler(error);
      setLoading(false);
    }
  };

  if (council) {
    useEffect(() => {
      if (!visible) {
        form.setFieldsValue(councilService.convertToRequestBody(council));
      }
    }, [council]);
  }

  return (
    <Drawer
      title={council ? CouncilTerminology.COUNCIL_7 : CouncilTerminology.COUNCIL_6}
      width={720}
      onClose={handleCancel}
      visible={visible}>
      <Form form={form} requiredMark={true} layout="vertical" onFinish={handleSubmitButton}>
        <Form.Item
          label={<b>{CouncilTerminology.COUNCIL_2}</b>}
          name="name"
          rules={council ? [] : [{ required: true, message: CouncilTerminology.COUNCIL_8 }]}>
          <Input />
        </Form.Item>
        <ThesisSelectLecturerAttendee
          thesisId={thesisId}
          fieldName={CouncilRequestBodyField.CHAIRMAN_ID}
          defaultValue={council ? council.chairman : null}
          label={CouncilTerminology.COUNCIL_3}
          rules={council ? [] : [{ required: true, message: CouncilTerminology.COUNCIL_9 }]}
        />
        <ThesisSelectLecturerAttendee
          thesisId={thesisId}
          fieldName={CouncilRequestBodyField.INSTRUCTOR_ID}
          defaultValue={council ? council.instructor : null}
          label={CouncilTerminology.COUNCIL_4}
          rules={council ? [] : [{ required: true, message: CouncilTerminology.COUNCIL_10 }]}
        />
        <ThesisSelectLecturerAttendee
          thesisId={thesisId}
          fieldName={CouncilRequestBodyField.COMMISSIONER_ID}
          defaultValue={council ? council.commissioner : null}
          label={CouncilTerminology.COUNCIL_5}
          rules={council ? [] : [{ required: true, message: CouncilTerminology.COUNCIL_11 }]}
        />
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
  );
};

export default CouncilForm;
