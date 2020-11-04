import { Space, Typography } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import Datetime from '../../libs/datetime/Datetime';

interface ComponentProps {
  date?: string | number | Date | Moment;
  isRelative?: boolean;
  dateOnly?: boolean;
}

const DateData: React.FC<ComponentProps> = ({ date, isRelative, dateOnly }) => {
  if (!date) {
    return <Typography.Text disabled>NULL</Typography.Text>;
  }

  const datetime = new Datetime(date);

  return (
    <Space>
      <Typography.Text disabled={!date}>
        {dateOnly ? datetime.getDate() : datetime.getWithLocalTimezone()}
      </Typography.Text>
      {isRelative && (
        <Typography.Text type="secondary">
          <i>{`(${datetime.getRelativeTime()})`}</i>
        </Typography.Text>
      )}
    </Space>
  );
};

export default DateData;
