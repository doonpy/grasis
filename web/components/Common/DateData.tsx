import { Typography } from 'antd';
import React from 'react';

import Datetime from '../../libs/datetime/Datetime';

interface ComponentProps {
  date?: string | number | Date;
  isRelative?: boolean;
}

const DateData: React.FC<ComponentProps> = ({ date, isRelative }) => {
  const datetime = new Datetime(date);

  return (
    <Typography.Text disabled={!date}>
      {datetime.getWithLocalTimezone()}&nbsp;
      {isRelative && (
        <Typography.Text type="secondary">
          <i>{`(${datetime.getRelativeTime()})`}</i>
        </Typography.Text>
      )}
    </Typography.Text>
  );
};

export default DateData;
