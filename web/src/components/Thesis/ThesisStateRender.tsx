import { Tag } from 'antd';
import React from 'react';

import { ThesisState, ThesisStateTexts } from '../../libs/thesis/thesis.resource';

interface ComponentProps {
  state: ThesisState;
}

const ThesisStateRender: React.FC<ComponentProps> = ({ state }) => {
  if (state === ThesisState.NOT_START) {
    return <Tag color="gray">{ThesisStateTexts[ThesisState.NOT_START]}</Tag>;
  }

  if (state === ThesisState.FINISH) {
    return <Tag color="green">{ThesisStateTexts[ThesisState.FINISH]}</Tag>;
  }

  return <Tag color="orange">{ThesisStateTexts[state]}</Tag>;
};

export default ThesisStateRender;
