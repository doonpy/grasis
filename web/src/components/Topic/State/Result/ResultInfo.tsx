import { Collapse, Empty, Space, Tabs, Typography } from 'antd';
import React from 'react';

import { ResultTerminology } from '../../../../assets/terminology/result.terminology';
import ResultService from '../../../../libs/result/result.service';
import { ResultForView } from '../../../../libs/result/result.type';
import TopicService from '../../../../libs/topic/topic.service';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import StudentFastView from '../../../Student/StudentFastView';
import ResultDefenseStatistic from './ResultDefenseStatistic';
import ResultEdit from './ResultEdit';
import ResultItem from './ResultItem';
import ResultPointRender from './ResultPointRender';

interface ComponentProps {
  topicId: number;
  canFetch: boolean;
}

const ResultInfo: React.FC<ComponentProps> = ({ topicId, canFetch }) => {
  const topicService = TopicService.getInstance();
  const resultService = ResultService.getInstance();
  const { data } = topicService.useTopicResult(topicId, canFetch);
  if (!data) {
    return <Empty description={ResultTerminology.RESULT_11} />;
  }

  const defenseResultRender = (result: ResultForView[]) => {
    return result.map((item, key) => (
      <ResultItem key={key} result={item} extra={<ResultEdit result={item} />} />
    ));
  };

  return (
    <Tabs defaultActiveKey="0" tabPosition="left">
      {data.results.map((result, index) => (
        <Tabs.TabPane
          tab={
            <Space direction="vertical" align="end" style={{ width: '100%' }}>
              <StudentFastView student={result.student} />
              <ResultPointRender
                title={ResultTerminology.RESULT_14}
                value={resultService.calculateResultOfStudent(result)}
              />
            </Space>
          }
          key={index}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Collapse>
              <Collapse.Panel
                key="1"
                header={
                  <Space size="large">
                    <Typography.Title level={5}>{ResultTerminology.RESULT_8}</Typography.Title>
                    {result.instructor && (
                      <ResultPointRender
                        title={<LecturerFastView lecturer={result.instructor.creator} />}
                        value={result.instructor.average}
                      />
                    )}
                  </Space>
                }>
                <ResultItem
                  result={result.instructor}
                  extra={<ResultEdit result={result.instructor} />}
                />
              </Collapse.Panel>
              <Collapse.Panel
                key="2"
                header={
                  <Space size="large">
                    <Typography.Title level={5}>{ResultTerminology.RESULT_9}</Typography.Title>
                    {result.review && (
                      <ResultPointRender
                        title={<LecturerFastView lecturer={result.review.creator} />}
                        value={result.review?.average}
                      />
                    )}
                  </Space>
                }>
                <ResultItem result={result.review} extra={<ResultEdit result={result.review} />} />
              </Collapse.Panel>
              <Collapse.Panel
                key="3"
                header={
                  <Space size="large">
                    <Typography.Title level={5}>{ResultTerminology.RESULT_10}</Typography.Title>
                    <ResultDefenseStatistic results={result.defense} />
                  </Space>
                }>
                <Space direction="vertical" size="large">
                  {defenseResultRender(result.defense)}
                </Space>
              </Collapse.Panel>
            </Collapse>
          </Space>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default ResultInfo;
