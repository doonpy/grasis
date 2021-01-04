import Icon from '@ant-design/icons';
import { Button, Drawer, Form, Input, InputNumber, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';

import EditIcon from '../../../../assets/svg/regular/edit.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ResultTerminology } from '../../../../assets/terminology/result.terminology';
import ResultService from '../../../../libs/result/result.service';
import {
  ResultForView,
  ResultOfStudentForView,
  ResultRequestBody
} from '../../../../libs/result/result.type';
import LoginUser from '../../../../libs/user/instance/LoginUser';

interface ComponentProps {
  result: ResultForView | null;
  results: ResultOfStudentForView[];
  setResults: React.Dispatch<ResultOfStudentForView[]>;
  studentId: number;
}

const ResultEdit: React.FC<ComponentProps> = ({ result, results, setResults, studentId }) => {
  const loginUser = LoginUser.getInstance();
  const resultService = ResultService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (!visible && result && result.point) {
      form.setFieldsValue(result);
    }
  }, [result]);

  if (!result || !result.point || loginUser.getId() !== result.creator.id) {
    return <></>;
  }

  const onClickEditButton: React.MouseEventHandler<HTMLElement> = () => {
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

  const onFormSubmit = async (formValues: ResultRequestBody) => {
    setLoading(true);
    try {
      const { data } = await resultService.updateById(result.id, formValues);
      setResults([...resultService.updateResultList(studentId, results, data.result, result.type)]);
      message.success(ResultTerminology.RESULT_16);
      setLoading(false);
      setVisible(false);
    } catch (error) {
      setLoading(false);
      await resultService.requestErrorHandler(error);
    }
  };

  return (
    <>
      <Drawer
        title={ResultTerminology.RESULT_15}
        width={720}
        onClose={handleCancel}
        visible={visible}>
        <Form form={form} requiredMark={true} layout="vertical" onFinish={onFormSubmit}>
          {result.point.map((item, key) => (
            <Form.Item key={key} label={item.title} name={['point', key, 'value']}>
              <InputNumber max={10} min={0} step={0.05} placeholder={ResultTerminology.RESULT_7} />
            </Form.Item>
          ))}
          <Form.Item label={ResultTerminology.RESULT_3} name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
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
        {CommonTerminology.COMMON_12}
      </Button>
    </>
  );
};

export default ResultEdit;
