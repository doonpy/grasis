import { Typography } from 'antd';
import React from 'react';

interface ComponentProps {
  text?: string | null;
  enableTruncate?: boolean;
  isParagraph?: boolean;
}

const TRUNCATE_LIMIT = 50;

function truncateString(str?: string | null): string {
  if (!str) {
    return 'NULL';
  }

  if (str.length <= TRUNCATE_LIMIT) {
    return str;
  }

  return `${str.slice(0, TRUNCATE_LIMIT)}...`;
}

const TextData: React.FC<ComponentProps> = ({ text, enableTruncate, isParagraph }) => {
  if (enableTruncate) {
    text = truncateString(text);
  }

  if (isParagraph && typeof text === 'string') {
    const paragraphs = text.split(/\r|\n/g);

    return (
      <div>
        {paragraphs.map((paragraph, index) => (
          <Typography.Paragraph key={index}>{paragraph}</Typography.Paragraph>
        ))}
      </div>
    );
  }

  if (typeof text === 'undefined' || text === null) {
    return <Typography.Text disabled>NULL</Typography.Text>;
  }

  return <Typography.Text>{text}</Typography.Text>;
};

export default TextData;
