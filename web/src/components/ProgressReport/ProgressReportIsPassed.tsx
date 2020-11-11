import { Tag } from 'antd';
import React from 'react';

import {
  IsPassed,
  IsPassedColor,
  IsPassedText
} from '../../libs/progress-report/progress-report.resource';

interface ComponentProps {
  isPassed: IsPassed;
}

const ProgressReportIsPassed: React.FC<ComponentProps> = ({ isPassed }) => {
  return <Tag color={IsPassedColor[isPassed]}>{IsPassedText[isPassed]}</Tag>;
};

export default ProgressReportIsPassed;
