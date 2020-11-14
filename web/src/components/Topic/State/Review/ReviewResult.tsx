import { Tag } from 'antd';
import React from 'react';

import { ReviewResultText } from '../../../../libs/review/review.resource';
import {
  StateResult,
  StateResultColor
} from '../../../../libs/topic/topic-state/topic-state.resource';

interface ComponentProps {
  result: StateResult;
}

const ReviewResult: React.FC<ComponentProps> = ({ result }) => {
  return <Tag color={StateResultColor[result]}>{ReviewResultText[result]}</Tag>;
};

export default ReviewResult;
