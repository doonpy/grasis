import { Typography } from 'antd';
import React from 'react';

interface ComponentProps {
  text?: string | null;
}

const TextData: React.FC<ComponentProps> = ({ text }) => {
  return <Typography.Text disabled={!text}>{text ?? 'NULL'}</Typography.Text>;
};

export default TextData;
