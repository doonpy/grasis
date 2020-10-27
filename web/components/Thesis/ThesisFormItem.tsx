import 'moment/locale/vi';

import { DatePicker, Form, Input, Space } from 'antd';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

import styles from '../../assets/css/components/thesis/thesis-form-item.module.css';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { ThesisRequestBody } from '../../libs/thesis/thesis.interface';

interface ComponentProps {
  initThesis?: ThesisRequestBody;
}

const ThesisFormItem: React.FC<ComponentProps> = ({ initThesis }) => {
  const [duration, setDuration] = useState<[Moment, Moment]>(
    initThesis ? initThesis.duration : [undefined, undefined]
  );
  const [lecturerTopicRegister, setLecturerTopicRegister] = useState<Moment>(
    initThesis ? (initThesis.lecturerTopicRegister as Moment) : undefined
  );
  const [studentTopicRegister, setStudentTopicRegister] = useState<Moment>(
    initThesis ? (initThesis.studentTopicRegister as Moment) : undefined
  );
  const [progressReport, setProgressReport] = useState<Moment>(
    initThesis ? (initThesis.progressReport as Moment) : undefined
  );
  const [review, setReview] = useState<Moment>(
    initThesis ? (initThesis.review as Moment) : undefined
  );
  const [defense, setDefense] = useState<Moment>(
    initThesis ? (initThesis.defense as Moment) : undefined
  );
  const format = 'DD-MM-YYYY';

  const dateRangeForDuration = (current: Moment) => {
    return current && current < moment().startOf('days');
  };

  const dateRangeForState = (date: Moment, startState?: Moment, endState?: Moment) => {
    if (!duration) {
      return false;
    }

    const [startDate, endDate] = duration;
    const beginRange = startState
      ? date.isSameOrBefore(startState, 'day')
      : startDate && date.isBefore(startDate, 'day');
    const endRange = endState
      ? date.isSameOrAfter(endState.endOf('day'), 'day')
      : endDate && date.isAfter(endDate.endOf('day'), 'day');

    return beginRange || endRange;
  };

  return (
    <Space direction="vertical">
      <Form.Item
        name="subject"
        label={ThesisTerminology.THESIS_10}
        rules={[{ required: true, message: ThesisTerminology.THESIS_30 }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="duration"
        label={ThesisTerminology.THESIS_31}
        rules={[{ required: true, message: ThesisTerminology.THESIS_32 }]}>
        <DatePicker.RangePicker
          format={format}
          onChange={(values) => setDuration(values)}
          disabledDate={dateRangeForDuration}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="lecturerTopicRegister"
        label={ThesisTerminology.THESIS_14}
        rules={[{ required: true, message: ThesisTerminology.THESIS_33 }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) =>
            dateRangeForState(current, undefined, studentTopicRegister)
          }
          onChange={(value) => setLecturerTopicRegister(value)}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="studentTopicRegister"
        label={ThesisTerminology.THESIS_15}
        rules={[{ required: true, message: ThesisTerminology.THESIS_34 }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) =>
            dateRangeForState(current, lecturerTopicRegister, progressReport)
          }
          onChange={(value) => setStudentTopicRegister(value)}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="progressReport"
        label={ThesisTerminology.THESIS_16}
        rules={[{ required: true, message: ThesisTerminology.THESIS_35 }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) =>
            dateRangeForState(current, studentTopicRegister, review)
          }
          onChange={(value) => setProgressReport(value)}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="review"
        label={ThesisTerminology.THESIS_17}
        rules={[{ required: true, message: ThesisTerminology.THESIS_36 }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) => dateRangeForState(current, progressReport, defense)}
          onChange={(value) => setReview(value)}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="defense"
        label={ThesisTerminology.THESIS_18}
        rules={[{ required: true, message: ThesisTerminology.THESIS_37 }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) => dateRangeForState(current, review, undefined)}
          onChange={(value) => setDefense(value)}
          className={styles.datePicker}
        />
      </Form.Item>
    </Space>
  );
};

export default ThesisFormItem;
