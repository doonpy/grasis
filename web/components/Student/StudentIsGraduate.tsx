import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import React from 'react';

import { IsGraduate } from '../../libs/student/student.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  isGraduate?: IsGraduate;
}

const StudentIsGraduate: React.FC<ComponentProps> = ({ isGraduate }) => {
  if (isGraduate === IsGraduate.TRUE) {
    return <CheckCircleTwoTone twoToneColor="#52c41a" />;
  }

  if (isGraduate === IsGraduate.FALSE) {
    return <CloseCircleTwoTone twoToneColor="#f5222d" />;
  }

  return <TextData />;
};

export default StudentIsGraduate;
