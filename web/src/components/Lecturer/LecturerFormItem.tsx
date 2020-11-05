import { Form, Input, Select } from 'antd';
import React from 'react';

import { LecturerTerminology } from '../../assets/terminology/lecturer.terminology';

const LecturerFormItem: React.FC = () => {
  return (
    <div>
      <Form.Item name={['lecturer', 'lecturerId']} label={LecturerTerminology.LECTURER_3}>
        <Input maxLength={4} />
      </Form.Item>
      <Form.Item name={['lecturer', 'level']} label={LecturerTerminology.LECTURER_4}>
        <Select mode="multiple" optionLabelProp="label">
          <Select.Option
            value={LecturerTerminology.LECTURER_5}
            label={LecturerTerminology.LECTURER_5}>
            {LecturerTerminology.LECTURER_5}
          </Select.Option>
          <Select.Option
            value={LecturerTerminology.LECTURER_6}
            label={LecturerTerminology.LECTURER_6}>
            {LecturerTerminology.LECTURER_6}
          </Select.Option>
          <Select.Option
            value={LecturerTerminology.LECTURER_7}
            label={LecturerTerminology.LECTURER_7}>
            {LecturerTerminology.LECTURER_7}
          </Select.Option>
          <Select.Option
            value={LecturerTerminology.LECTURER_5}
            label={LecturerTerminology.LECTURER_8}>
            {LecturerTerminology.LECTURER_8}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name={['lecturer', 'position']} label={LecturerTerminology.LECTURER_9}>
        <Input />
      </Form.Item>
    </div>
  );
};

export default LecturerFormItem;
