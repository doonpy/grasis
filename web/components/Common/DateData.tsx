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
  const UTC_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  const LOCAL_FORMAT = 'LTS, L';
  moment.updateLocale('vi', localization);
  const utcDate = moment(date).format(UTC_FORMAT);
  const convertDate = moment.utc(utcDate).local().format(LOCAL_FORMAT);
  const utcRelativeDate = moment(date).format(UTC_FORMAT);
  const convertRelativeDate = moment.utc(utcRelativeDate).local().fromNow();

  return (
    <Typography.Text disabled={!date}>
      {convertDate}&nbsp;
      {isRelative && (
        <Typography.Text type="secondary">
          <i>{`(${convertRelativeDate})`}</i>
        </Typography.Text>
      )}
    </Typography.Text>
  );
};

export default DateData;
