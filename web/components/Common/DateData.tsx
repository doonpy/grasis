import { Typography } from 'antd';
import moment from 'moment';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import localization from 'moment/locale/vi';
import React from 'react';

interface ComponentProps {
  date?: string | number | Date;
  isRelative?: boolean;
}

const DateData: React.FC<ComponentProps> = ({ date, isRelative }) => {
  moment.updateLocale('vi', localization);
  const convertDate = moment(date).format('LTS, L');

  return (
    <Typography.Text disabled={!date}>
      {convertDate ?? 'NULL'}&nbsp;
      {isRelative && (
        <Typography.Text type="secondary">
          <i>{moment(date).fromNow()}</i>
        </Typography.Text>
      )}
    </Typography.Text>
  );
};

export default DateData;
