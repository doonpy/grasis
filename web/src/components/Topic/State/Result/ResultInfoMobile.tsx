import { Collapse, Empty, Space, Spin, Table, Tabs, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { ResultTerminology } from '../../../../assets/terminology/result.terminology';
import ResultService from '../../../../libs/result/result.service';
import { ResultForView, ResultOfStudentForView } from '../../../../libs/result/result.type';
import TopicService from '../../../../libs/topic/topic.service';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import StudentFastView from '../../../Student/StudentFastView';
import ResultEditMobile from './ResultEditMobile';
import ResultPointRender from './ResultPointRender';
import { ResultPointTableColumns } from './ResultPointTableColumns';

interface ComponentProps {
  topicId: number;
  canFetch: boolean;
}

const ResultInfoMobile: React.FC<ComponentProps> = ({ topicId, canFetch }) => {
  const login = LoginUser.getInstance();
  const topicService = TopicService.getInstance();
  const resultService = ResultService.getInstance();
  const { data, isLoading } = topicService.useTopicResult(topicId, canFetch);
  const [results, setResults] = useState<ResultOfStudentForView[]>(data ? data.results : []);
  useEffect(() => {
    if (data) {
      setResults(data.results);
    }
  }, [data]);

  if (isLoading) {
    return <Spin />;
  }

  if (results.length === 0) {
    return <Empty description={ResultTerminology.RESULT_11} />;
  }

  const defenseResultRender = (studentId: number, result: ResultForView[]) => {
    if (result.length === 0) {
      return <Empty description={ResultTerminology.RESULT_11} />;
    }

    return result.map((item, key) => (
      <Table
        key={key}
        title={() => (
          <ResultEditMobile
            result={item}
            results={results}
            setResults={setResults}
            studentId={studentId}
          />
        )}
        bordered
        columns={ResultPointTableColumns}
        dataSource={
          item.point
            ? item.point.map((point, index) => ({
                ...point,
                key: index.toString()
              }))
            : []
        }
        size="middle"
        pagination={false}
      />
    ));
  };

  return (
    <Tabs defaultActiveKey="0" tabPosition="top" size="small">
      {results.map((result, index) => (
        <Tabs.TabPane
          tab={
            <Space direction="vertical" align="start" style={{ width: '100%' }}>
              <StudentFastView student={result.student} />
              <ResultPointRender
                title={ResultTerminology.RESULT_14}
                value={resultService.calculateResultOfStudent(result)}
              />
            </Space>
          }
          key={index}>
          <Collapse>
            {result.instructor && result.instructor.creator.id === login.getId() && (
              <Collapse.Panel
                key="1"
                header={
                  <Space size="small">
                    <Typography.Title level={5}>{ResultTerminology.RESULT_8}</Typography.Title>
                    {result.instructor && (
                      <ResultPointRender title={<></>} value={result.instructor.average} />
                    )}
                  </Space>
                }>
                <Table
                  title={() => (
                    <ResultEditMobile
                      result={result.instructor}
                      results={results}
                      setResults={setResults}
                      studentId={result.student.id}
                    />
                  )}
                  bordered
                  columns={ResultPointTableColumns}
                  dataSource={
                    result.instructor && result.instructor.point
                      ? result.instructor.point.map((point, index) => ({
                          ...point,
                          key: index.toString()
                        }))
                      : []
                  }
                  size="middle"
                  pagination={false}
                />
              </Collapse.Panel>
            )}
            {result.review && result.review.creator.id === login.getId() && (
              <Collapse.Panel
                key="2"
                header={
                  <Space size="large">
                    <Typography.Title level={5}>{ResultTerminology.RESULT_9}</Typography.Title>
                    {result.review && (
                      <ResultPointRender title={<></>} value={result.review?.average} />
                    )}
                  </Space>
                }>
                <Table
                  title={() => (
                    <ResultEditMobile
                      result={result.review}
                      results={results}
                      setResults={setResults}
                      studentId={result.student.id}
                    />
                  )}
                  bordered
                  columns={ResultPointTableColumns}
                  dataSource={
                    result.review && result.review.point
                      ? result.review.point.map((point, index) => ({
                          ...point,
                          key: index.toString()
                        }))
                      : []
                  }
                  size="middle"
                  pagination={false}
                />
              </Collapse.Panel>
            )}
            {result.defense &&
              result.defense.findIndex((item) => item.creator.id === login.getId()) !== -1 && (
                <Collapse.Panel
                  key="3"
                  header={
                    <Space size="large">
                      <Typography.Title level={5}>{ResultTerminology.RESULT_10}</Typography.Title>
                      <ResultPointRender
                        title={<></>}
                        value={resultService.calculateDefenseAverage(result.defense)}
                      />
                    </Space>
                  }>
                  <Space direction="vertical" size="large">
                    {defenseResultRender(result.student.id, result.defense)}
                  </Space>
                </Collapse.Panel>
              )}
          </Collapse>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default ResultInfoMobile;
