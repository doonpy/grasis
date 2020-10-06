import { Form, Input, Select } from 'antd';
import React from 'react';

function LecturerFormItem() {
  return (
    <div>
      <Form.Item name="lecturerId" label="Mã giảng viên">
        <Input name="lecturerId" maxLength={4} />
      </Form.Item>
      <Form.Item name="level" label="Trình độ học vấn">
        <Select name="level" mode="multiple" optionLabelProp="label">
          <Select.Option value="Thạc sĩ" label="Thạc sĩ">
            Thạc sĩ
          </Select.Option>
          <Select.Option value="Tiến sĩ" label="Tiến sĩ">
            Tiến sĩ
          </Select.Option>
          <Select.Option value="Phó giáo sư" label="Phó giáo sư">
            Phó giáo sư
          </Select.Option>
          <Select.Option value="Giáo sư" label="Giáo sư">
            Giáo sư
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="position" label="Chức vụ">
        <Input name="position" />
      </Form.Item>
    </div>
  );
}

export default LecturerFormItem;
