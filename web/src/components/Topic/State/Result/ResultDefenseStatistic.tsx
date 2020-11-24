import { Divider, Space, Tag, Typography } from 'antd';
import React from 'react';

import { CouncilTerminology } from '../../../../assets/terminology/council.terminology';
import { ResultTerminology } from '../../../../assets/terminology/result.terminology';
import ResultService from '../../../../libs/result/result.service';
import { ResultForView } from '../../../../libs/result/result.type';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import ResultPointRender from './ResultPointRender';

interface ComponentProps {
  results: ResultForView[];
}

const ResultDefenseStatistic: React.FC<ComponentProps> = ({ results }) => {
  const resultService = ResultService.getInstance();
  const councilPosition = [
    CouncilTerminology.COUNCIL_3,
    CouncilTerminology.COUNCIL_4,
    CouncilTerminology.COUNCIL_5
  ];

  return (
    <Space size="large">
      {results.map((result, index) => (
        <ResultPointRender
          key={index}
          title={
            <Space direction="vertical" align="end">
              <LecturerFastView lecturer={result.creator} />
              <Tag color="blue">{councilPosition[index]}</Tag>
            </Space>
          }
          value={result?.average}
        />
      ))}
      <Divider type="vertical" />
      <ResultPointRender
        title={<Typography.Title level={5}>{ResultTerminology.RESULT_13}</Typography.Title>}
        value={resultService.calculateDefenseAverage(results)}
      />
    </Space>
  );
};

export default ResultDefenseStatistic;
