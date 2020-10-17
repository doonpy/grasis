import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Switch } from 'antd';
import React from 'react';

const StudentFormItem: React.FC = () => {
  return (
    <div>
      <Form.Item name="studentId" label="Mã sinh viên">
        <Input name="studentId" maxLength={8} />
      </Form.Item>
      <Form.Item name="schoolYear" label="Niên khóa">
        <Input name="schoolYear" maxLength={4} />
      </Form.Item>
      <Form.Item name="studentClass" label="Lớp">
        <Input name="studentClass" />
      </Form.Item>
      <Form.Item name="isGraduate" label="Tình trạng tốt nghiệp" valuePropName="checked">
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </div>
  );
};

export default StudentFormItem;
