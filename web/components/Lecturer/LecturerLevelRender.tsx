import { Tag } from 'antd';
import React from 'react';

import TextData from '../Common/TextData';

interface ComponentProps {
  level?: string[];
}

const LecturerLevelRender: React.FC<ComponentProps> = ({ level }) => {
  if (!Array.isArray(level)) {
    return <TextData />;
  }

  return (
    <>
      {level.map((item, index) => (
        <Tag color="blue" key={index}>
          {item}
        </Tag>
      ))}
    </>
  );
};

export default LecturerLevelRender;
