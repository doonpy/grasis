import { Tag } from 'antd';
import React from 'react';

import { ProgressReportResultText } from '../../../../libs/progress-report/progress-report.resource';
import {
  StateResult,
  StateResultColor
} from '../../../../libs/topic/topic-state/topic-state.resource';

interface ComponentProps {
  result: StateResult;
}

const ProgressReportResult: React.FC<ComponentProps> = ({ result }) => {
  return <Tag color={StateResultColor[result]}>{ProgressReportResultText[result]}</Tag>;
};

export default ProgressReportResult;
