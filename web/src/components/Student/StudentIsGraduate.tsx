import { Tag } from 'antd';
import React from 'react';

import { IsGraduate, IsGraduateColor, IsGraduateText } from '../../libs/student/student.resource';

interface ComponentProps {
  isGraduate: IsGraduate;
}

const StudentIsGraduate: React.FC<ComponentProps> = ({ isGraduate }) => {
  return <Tag color={IsGraduateColor[isGraduate]}>{IsGraduateText[isGraduate]}</Tag>;
};

export default StudentIsGraduate;
