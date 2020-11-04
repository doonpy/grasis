import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Switch } from 'antd';
import React from 'react';

import { StudentTerminology } from '../../assets/terminology/student.terminology';

const StudentFormItem: React.FC = () => {
  return (
    <div>
      <Form.Item name={['student', 'studentId']} label={StudentTerminology.STUDENT_3}>
        <Input maxLength={8} />
      </Form.Item>
      <Form.Item name={['student', 'schoolYear']} label={StudentTerminology.STUDENT_4}>
        <Input maxLength={4} />
      </Form.Item>
      <Form.Item name={['student', 'studentClass']} label={StudentTerminology.STUDENT_5}>
        <Input />
      </Form.Item>
      <Form.Item
        name={['student', 'isGraduate']}
        label={StudentTerminology.STUDENT_6}
        valuePropName="checked">
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </div>
  );
};

export default StudentFormItem;
