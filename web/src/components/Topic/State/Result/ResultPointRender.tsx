import { Statistic } from 'antd';
import React from 'react';

import { ResultPointColor } from '../../../../libs/result/result.resource';

interface ComponentProps {
  title: React.ReactNode;
  value: number;
}

const ResultPointRender: React.FC<ComponentProps> = ({ title, value }) => {
  return (
    <Statistic
      title={title}
      value={value}
      valueStyle={{ color: value < 5 ? ResultPointColor.RED : ResultPointColor.GREEN }}
      precision={2}
    />
  );
};

export default ResultPointRender;
