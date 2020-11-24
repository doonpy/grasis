import { Descriptions, Empty, Table } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ResultTerminology } from '../../../../assets/terminology/result.terminology';
import { ResultForView } from '../../../../libs/result/result.type';
import DateData from '../../../Common/DateData';
import TextData from '../../../Common/TextData';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import { ResultPointTableColumns } from './ResultPointTableColumns';

interface ComponentProps {
  result: ResultForView | null;
  extra?: React.ReactNode;
}

const ResultItem: React.FC<ComponentProps> = ({ result, extra }) => {
  if (!result) {
    return <Empty description={ResultTerminology.RESULT_11} />;
  }

  const { creator, note, point, createdAt, updatedAt } = result;

  return (
    <Descriptions bordered size="small" extra={extra}>
      <Descriptions.Item span={3} label={<b>{ResultTerminology.RESULT_2}</b>}>
        <LecturerFastView lecturer={creator} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>{ResultTerminology.RESULT_3}</b>}>
        <TextData text={note} />
      </Descriptions.Item>
      <Descriptions.Item span={1} label={<b>{CommonTerminology.COMMON_1}</b>}>
        <DateData date={createdAt} />
      </Descriptions.Item>
      <Descriptions.Item span={2} label={<b>{CommonTerminology.COMMON_2}</b>}>
        <DateData date={updatedAt} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>{ResultTerminology.RESULT_4}</b>}>
        {point && (
          <Table
            bordered
            columns={ResultPointTableColumns}
            dataSource={point.map((point, index) => ({ ...point, key: index.toString() }))}
            size="middle"
            pagination={false}
          />
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ResultItem;
