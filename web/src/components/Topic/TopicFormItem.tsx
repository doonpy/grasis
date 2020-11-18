import { Form, Input, InputNumber } from 'antd';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';

const TopicFormItem: React.FC = () => {
  return (
    <>
      <Form.Item
        label={<b>{TopicTerminology.TOPIC_2}</b>}
        name="subject"
        rules={[{ required: true, message: TopicTerminology.TOPIC_4 }]}>
        <Input />
      </Form.Item>
      <Form.Item label={<b>{TopicTerminology.TOPIC_3}</b>} name="description">
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item label={<b>{TopicTerminology.TOPIC_5}</b>} name="maxStudent">
        <InputNumber min={1} max={2} defaultValue={2} />
      </Form.Item>
    </>
  );
};

export default TopicFormItem;
