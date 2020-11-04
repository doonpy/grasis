import { Badge, Space, Tooltip, Typography } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import Datetime from '../../libs/datetime/Datetime';
import DateData from '../Common/DateData';

interface ComponentProps {
  date: string | Moment;
  withSubInfo?: boolean;
}

const ThesisDateData: React.FC<ComponentProps> = ({ date, withSubInfo }) => {
  const datetime = new Datetime(date);
  const countDownDays = datetime.getCountDownDays();

  return (
    <Space>
      <DateData date={date as string} dateOnly={true} />
      {withSubInfo && countDownDays > 0 && (
        <Typography.Text type="secondary">
          <i>{`(Còn ${countDownDays} ngày)`}</i>
        </Typography.Text>
      )}
      {withSubInfo && countDownDays === 0 && (
        <Typography.Text type="secondary">
          <i>{`(Còn ${datetime.getCountDownHours()} giờ)`}</i>
        </Typography.Text>
      )}
      {withSubInfo && datetime.isSameOrAfterCurrentDate() && (
        <Tooltip title={ThesisTerminology.THESIS_46} color="blue">
          <Badge status="processing" />
        </Tooltip>
      )}
    </Space>
  );
};

export default ThesisDateData;
