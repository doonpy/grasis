import { Form, Select, Spin, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useState } from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { FAILED_ID } from '../../libs/common/common.resource';
import { LecturerForFastView } from '../../libs/lecturer/lecturer.type';
import ThesisService from '../../libs/thesis/thesis.service';
import LecturerFastView from '../Lecturer/LecturerFastView';

interface ComponentProps {
  thesisId: number;
  defaultValue: LecturerForFastView | null;
  fieldName: string;
  label: string;
  emptyValue?: boolean;
  rules?: Rule[];
}

const ThesisSelectLecturerInThesis: React.FC<ComponentProps> = ({
  thesisId,
  defaultValue,
  fieldName,
  label,
  emptyValue,
  rules
}) => {
  const [lecturers, setLecturers] = useState<LecturerForFastView[]>(
    defaultValue ? [defaultValue] : []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const thesisService = ThesisService.getInstance();

  const onSearch = async (value: string) => {
    try {
      setLoading(true);
      const result = await thesisService.searchLecturerInThesis(value, thesisId);
      setLecturers(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await thesisService.requestErrorHandler(error);
    }
  };

  return (
    <Form.Item label={<b>{label}</b>} name={fieldName} rules={rules}>
      <Select
        size="large"
        defaultActiveFirstOption={false}
        showSearch={true}
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={onSearch}>
        {emptyValue && (
          <Select.Option value={FAILED_ID}>
            <Typography.Text type="secondary">{ThesisTerminology.THESIS_47}</Typography.Text>
          </Select.Option>
        )}
        {lecturers.map((lecturer, index) => (
          <Select.Option key={index} value={lecturer.id}>
            <LecturerFastView lecturer={lecturer} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default ThesisSelectLecturerInThesis;
