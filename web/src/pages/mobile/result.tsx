import { Alert, Card, Form } from 'antd';
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
import { ThesisState } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import TopicService from '../../libs/topic/topic.service';
import { UserType } from '../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const thesisService = ThesisService.getInstance();
  const topicService = TopicService.getInstance();
  const [thesisId, setThesisId] = useState<number>(0);
  const [topicId, setTopicId] = useState<number>(0);
  const { data: thesisData } = thesisService.useThesis(thesisId, thesisId !== 0);
  const { data: topicData } = topicService.useTopic(
    topicId,
    topicId !== 0 && thesisData && thesisData.thesis.state >= ThesisState.DEFENSE
  );

  const renderTopicSelector = () => {
    if (thesisData) {
      if (thesisData.thesis.state >= ThesisState.DEFENSE) {
        return (
          <Form.Item label={<b>{TopicTerminology.TOPIC_69}</b>}>
            <TopicSelector thesisId={thesisId} topicId={topicId} setTopicId={setTopicId} />
          </Form.Item>
        );
      } else {
        return <Alert message={<b>{ResultTerminology.RESULT_18}</b>} type="error" showIcon />;
      }
    }
  };

  return (
    <Card title={ResultTerminology.RESULT_17}>
      <Form>
        <Form.Item label={<b>{ThesisTerminology.THESIS_50}</b>}>
          <ThesisSelector thesisId={thesisId} setThesisId={setThesisId} />
        </Form.Item>
        {renderTopicSelector()}
        {topicData && (
          <>
            <Form.Item label={<b>{TopicTerminology.TOPIC_12}</b>}>
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
