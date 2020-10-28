import { Form, Input, InputNumber } from 'antd';
import React from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';

interface ComponentProps {
  isEdit?: boolean;
}

function getSubjectRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: TopicTerminology.TOPIC_4 }];
}

const TopicFormItem: React.FC<ComponentProps> = ({ isEdit }) => {
  return (
    <>
      <Form.Item label={TopicTerminology.TOPIC_2} name="subject" rules={getSubjectRules(isEdit)}>
        <Input />
      </Form.Item>
      <Form.Item label={TopicTerminology.TOPIC_3} name="description">
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item label={TopicTerminology.TOPIC_5} name="maxStudent">
        <InputNumber min={1} max={2} defaultValue={2} />
      </Form.Item>
    </>
  );
};

export default TopicFormItem;
