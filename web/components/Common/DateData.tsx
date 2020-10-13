import { Typography } from 'antd';
import React from 'react';

interface ComponentProps {
  date?: string | number | Date;
}

const DateData: React.FC<ComponentProps> = ({ date }) => {
  const convertDate = new Date(date).toLocaleString();

  return <Typography.Text disabled={!date}>{convertDate ?? 'NULL'}</Typography.Text>;
};

export default DateData;
