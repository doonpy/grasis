import { DatePicker, Form, Input } from 'antd';
import moment, { Moment } from 'moment';
import React from 'react';

import { TopicTerminology } from '../../../assets/terminology/topic.terminology';

interface ComponentProps {
  validDateRange: [string | Moment, string | Moment];
}

const StateEditBaseItem: React.FC<ComponentProps> = ({ validDateRange }) => {
  const dateRange = (date: Moment): boolean => {
    const [startDate, endDate] = validDateRange;

    return date.isSameOrBefore(startDate, 'day') || date.isAfter(endDate, 'day');
  };

  return (
    <>
      <Form.Item name="time" label={<b>{TopicTerminology.TOPIC_55}</b>}>
        <DatePicker
          format="YYYY-MM-DD HH:mm"
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
          disabledDate={dateRange}
        />
      </Form.Item>
      <Form.Item name="place" label={<b>{TopicTerminology.TOPIC_56}</b>}>
        <Input />
      </Form.Item>
      <Form.Item name="note" label={<b>{TopicTerminology.TOPIC_57}</b>}>
        <Input.TextArea rows={3} />
      </Form.Item>
    </>
  );
};

export default StateEditBaseItem;
