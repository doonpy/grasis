import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Switch } from 'antd';
import React from 'react';

const StudentFormItem: React.FC = () => {
  return (
    <div>
      <Form.Item name={['student', 'studentId']} label="Mã sinh viên">
        <Input maxLength={8} />
      </Form.Item>
      <Form.Item name={['student', 'schoolYear']} label="Niên khóa">
        <Input maxLength={4} />
      </Form.Item>
      <Form.Item name={['student', 'studentClass']} label="Lớp">
        <Input />
      </Form.Item>
      <Form.Item
        name={['student', 'isGraduate']}
        label="Tình trạng tốt nghiệp"
        valuePropName="checked">
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </div>
  );
};

export default StudentFormItem;
