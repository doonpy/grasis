import { Form, Select, Spin, Typography } from 'antd';
import React, { useState } from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { LecturerForFastView } from '../../libs/lecturer/lecturer.type';
import ThesisService from '../../libs/thesis/thesis.service';
import LecturerFastView from '../Lecturer/LecturerFastView';

interface ComponentProps {
  thesisId: number;
  defaultValue: LecturerForFastView | null;
  fieldName: string;
  label: string;
}

const ThesisSelectLecturerInThesis: React.FC<ComponentProps> = ({
  thesisId,
  defaultValue,
  fieldName,
  label
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
      console.log(result);
      setLecturers(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await thesisService.requestErrorHandler(error);
    }
  };

  return (
    <Form.Item label={<b>{label}</b>} name={fieldName}>
      <Select
        size="large"
        defaultActiveFirstOption={false}
        showSearch={true}
        defaultValue={defaultValue?.id || NaN}
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={onSearch}>
        <Select.Option value={NaN}>
          <Typography.Text type="secondary">{ThesisTerminology.THESIS_47}</Typography.Text>
        </Select.Option>
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
