import { Typography } from 'antd';
import React from 'react';

import Datetime from '../../libs/datetime/Datetime';

interface ComponentProps {
  date?: string | number | Date;
  isRelative?: boolean;
  dateOnly?: boolean;
}

const DateData: React.FC<ComponentProps> = ({ date, isRelative, dateOnly }) => {
  if (!date) {
    return <Typography.Text disabled>NULL</Typography.Text>;
  }

  const datetime = new Datetime(date);

  return (
    <Typography.Text disabled={!date}>
      {dateOnly ? datetime.getDate() : datetime.getWithLocalTimezone()}&nbsp;
      {isRelative && (
        <Typography.Text type="secondary">
          <i>{`(${datetime.getRelativeTime()})`}</i>
        </Typography.Text>
      )}
    </Typography.Text>
  );
};

export default DateData;
