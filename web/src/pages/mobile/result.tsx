import { Card, Form } from 'antd';
import { GetStaticProps } from 'next';
import React, { useState } from 'react';

import { ResultTerminology } from '../../assets/terminology/result.terminology';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import MainLayout from '../../components/Layout/MainLayout';
import ThesisSelector from '../../components/Thesis/ThesisSelector';
import ResultInfoMobile from '../../components/Topic/State/Result/ResultInfoMobile';
import TopicInfoMobile from '../../components/Topic/TopicInfoMobile';
import TopicSelector from '../../components/Topic/TopicSelector';
import { CommonPageProps, NextPageWithLayout } from '../../libs/common/common.type';
import TopicService from '../../libs/topic/topic.service';
import { UserType } from '../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const [thesisId, setThesisId] = useState<number>(0);
  const [topicId, setTopicId] = useState<number>(0);
  const topicService = TopicService.getInstance();
  const { data: topicData } = topicService.useTopic(topicId, topicId !== 0);

  return (
    <Card title={ResultTerminology.RESULT_17}>
      <Form>
        <Form.Item label={ThesisTerminology.THESIS_50}>
          <ThesisSelector thesisId={thesisId} setThesisId={setThesisId} />
        </Form.Item>
        <Form.Item label={TopicTerminology.TOPIC_69}>
          <TopicSelector thesisId={thesisId} topicId={topicId} setTopicId={setTopicId} />
        </Form.Item>
        {topicData && (
          <>
            <Form.Item label={TopicTerminology.TOPIC_12}>
              <TopicInfoMobile topic={topicData.topic} />
            </Form.Item>
            <Form.Item>
              <ResultInfoMobile topicId={topicId} canFetch={topicId !== 0} />
            </Form.Item>
          </>
        )}
      </Form>
    </Card>
  );
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: ResultTerminology.RESULT_17,
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
