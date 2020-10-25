import 'moment/locale/vi';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, Space, Switch } from 'antd';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

import styles from '../../assets/css/components/thesis/thesis-form-item.module.css';

interface ComponentProps {
  isEdit?: boolean;
}

const ThesisFormItem: React.FC<ComponentProps> = ({ isEdit }) => {
  const [duration, setDuration] = useState<[Moment, Moment]>([undefined, undefined]);
  const [lecturerTopicRegister, setLecturerTopicRegister] = useState<Moment>(undefined);
  const [studentTopicRegister, setStudentTopicRegister] = useState<Moment>(undefined);
  const [progressReport, setProgressReport] = useState<Moment>(undefined);
  const [review, setReview] = useState<Moment>(undefined);
  const [defense, setDefense] = useState<Moment>(undefined);
  const format = 'DD-MM-YYYY';

  const dateRangeForDuration = (current: Moment) => {
    return current && current < moment().startOf('days');
  };

  const dateRangeForState = (current: Moment, startState?: Moment, endState?: Moment) => {
    if (!duration) {
      return false;
    }

    const [startDate, endDate] = duration;
    const beginRange = startState
      ? current < moment(startState).endOf('day')
      : startDate && current < moment(startDate).endOf('day');
    const endRange = endState
      ? current > moment(endState).startOf('days')
      : endDate && current > moment(endDate).startOf('days');

    return beginRange || endRange;
  };

  return (
    <Space direction="vertical">
      <Form.Item
        name="subject"
        label="Tiêu đề"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="duration"
        label="Thời gian diễn ra"
        rules={[{ required: true, message: 'Vui lòng nhập thời gian diễn ra!' }]}>
        <DatePicker.RangePicker
          format={format}
          onChange={(values) => setDuration(values)}
          disabledDate={dateRangeForDuration}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="lecturerTopicRegister"
        label="Hạn chót giảng viên đăng ký đề tài"
        rules={[{ required: true, message: 'Vui lòng nhập hạn chót giảng viên đăng ký đề tài!' }]}>
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
        label="Hạn chót sinh viên đăng ký đề tài"
        rules={[{ required: true, message: 'Vui lòng nhập hạn chót sinh viên đăng ký đề tài!' }]}>
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
        label="Hạn chót báo cáo tiến độ"
        rules={[{ required: true, message: 'Vui lòng nhập hạn chót báo cáo tiến độ!' }]}>
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
        label="Hạn chót phản biện"
        rules={[{ required: true, message: 'Vui lòng nhập hạn chót phản biện!' }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) => dateRangeForState(current, progressReport, defense)}
          onChange={(value) => setReview(value)}
          className={styles.datePicker}
        />
      </Form.Item>
      <Form.Item
        name="defense"
        label="Hạn chót bảo vệ"
        rules={[{ required: true, message: 'Vui lòng nhập hạn chót bảo vệ!' }]}>
        <DatePicker
          format={format}
          disabledDate={(current: Moment) => dateRangeForState(current, review, undefined)}
          onChange={(value) => setDefense(value)}
          className={styles.datePicker}
        />
      </Form.Item>
      {isEdit && (
        <Form.Item name="status" label="Trạng thái" valuePropName="checked">
          <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Form.Item>
      )}
    </Space>
  );
};

export default ThesisFormItem;
