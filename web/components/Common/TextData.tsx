import { Typography } from 'antd';
import React from 'react';

interface ComponentProps {
  text?: string | null;
}

const TRUNCATE_LIMIT = 50;

function truncateString(str?: string): string {
  if (!str) {
    return null;
  }

  if (str.length <= TRUNCATE_LIMIT) {
    return str;
  }

  return `${str.slice(0, TRUNCATE_LIMIT)}...`;
}

const TextData: React.FC<ComponentProps> = ({ text }) => {
  return <Typography.Text disabled={!text}>{truncateString(text) ?? 'NULL'}</Typography.Text>;
};

export default TextData;
