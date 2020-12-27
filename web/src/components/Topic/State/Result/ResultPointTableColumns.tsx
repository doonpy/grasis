import { ColumnsType } from 'antd/lib/table';
import React from 'react';

import { ResultTerminology } from '../../../../assets/terminology/result.terminology';
import { ResultPoint } from '../../../../libs/result/result.type';
import TextData from '../../../Common/TextData';

export const ResultPointTableColumns: ColumnsType<ResultPoint> = [
  {
    title: <b>{ResultTerminology.RESULT_5}</b>,
    dataIndex: 'title',
    key: 'title',
    width: '80%',
    render: (value: string) => <TextData text={value} />
  },
  {
    title: <b>{ResultTerminology.RESULT_6}</b>,
    dataIndex: 'rate',
    key: 'rate',
    align: 'center',
    width: '10%',
    render: (value: number) => <TextData text={`${value}%`} />
  },
  {
    title: <b>{ResultTerminology.RESULT_7}</b>,
    dataIndex: 'value',
    key: 'value',
    align: 'center',
    width: '10%',
    render: (value: number | null) => <TextData text={value !== null ? value.toFixed(2) : null} />
  }
];
