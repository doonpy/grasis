import { Statistic } from 'antd';
import React from 'react';

interface ComponentProps {
  title: React.ReactNode;
  value: number;
}

const ResultPointRender: React.FC<ComponentProps> = ({ title, value }) => {
  const color = { RED: '#cf1322', GREEN: '#3f8600' };
  console.log(value);
  return (
    <Statistic
      title={title}
      value={value}
      valueStyle={{ color: value < 5 ? color.RED : color.GREEN }}
    />
  );
};

export default ResultPointRender;
