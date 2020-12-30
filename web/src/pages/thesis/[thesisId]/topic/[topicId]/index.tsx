import Icon, { InfoCircleOutlined, LockOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import FileChartLineIcon from '../../../../../assets/svg/regular/file-chart-line.svg';
import FileSearchIcon from '../../../../../assets/svg/regular/file-search.svg';
import PollPeopleIcon from '../../../../../assets/svg/regular/poll-people.svg';
import ShieldAltIcon from '../../../../../assets/svg/regular/shield-alt.svg';
import { DefenseTerminology } from '../../../../../assets/terminology/defense.terminology';
import { ProgressReportTerminology } from '../../../../../assets/terminology/progress-report.terminology';
import { ResultTerminology } from '../../../../../assets/terminology/result.terminology';
import { ReviewTerminology } from '../../../../../assets/terminology/review.terminology';
import { ThesisTerminology } from '../../../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../../../assets/terminology/topic.terminology';
import MainLayout from '../../../../../components/Layout/MainLayout';
import DefenseInfo from '../../../../../components/Topic/State/Defense/DefenseInfo';
import ProgressReportInfo from '../../../../../components/Topic/State/ProgressReport/ProgressReportInfo';
import ResultInfo from '../../../../../components/Topic/State/Result/ResultInfo';
import ReviewInfo from '../../../../../components/Topic/State/Review/ReviewInfo';
import TopicInfo from '../../../../../components/Topic/TopicInfo';
import TopicPrivateInfo from '../../../../../components/Topic/TopicPrivateInfo';
import TopicStudentInfo from '../../../../../components/Topic/TopicStudentsInfo';
import { SIDER_KEYS } from '../../../../../libs/common/common.resource';
import CommonService from '../../../../../libs/common/common.service';
import { CommonPageProps, NextPageWithLayout } from '../../../../../libs/common/common.type';
import {
  THESIS_PATH_ROOT,
  ThesisPath,
  ThesisState
} from '../../../../../libs/thesis/thesis.resource';
import ThesisService from '../../../../../libs/thesis/thesis.service';
import { TopicStateAction } from '../../../../../libs/topic/topic-state/topic-state.resource';
import { TopicTabKey } from '../../../../../libs/topic/topic.resource';
import TopicService from '../../../../../libs/topic/topic.service';
import { UserType } from '../../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId: string;
  topicId: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const thesisId = parseInt(params.thesisId);
  const topicId = parseInt(params.topicId);
  const [currentTab, setCurrentTab] = useState<string>(TopicTabKey.INFO);
  const thesisService = ThesisService.getInstance();
  const { data: thesisData, isLoading: thesisLoading } = thesisService.useThesis(thesisId);
  const topicService = TopicService.getInstance();
  const { data: topicData, isLoading: topicLoading } = topicService.useTopic(topicId);

  const onTabChange = (activeKey: string) => {
    setCurrentTab(activeKey);
  };

  return (
    <Card title={TopicTerminology.TOPIC_11} loading={thesisLoading || topicLoading}>
      {thesisData && topicData && (
        <Tabs defaultActiveKey={currentTab} onChange={onTabChange}>
          <Tabs.TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                {TopicTerminology.TOPIC_12}
              </span>
            }
            key={TopicTabKey.INFO}>
            <TopicInfo topic={topicData.topic} thesis={thesisData.thesis} />
          </Tabs.TabPane>
          {topicService.hasPrivateContentPermission(thesisData.thesis, topicData.topic) && (
            <Tabs.TabPane
              tab={
                <span>
                  <LockOutlined />
                  {TopicTerminology.TOPIC_13}
                </span>
              }
              key={TopicTabKey.PRIVATE_CONTENT}>
              <TopicPrivateInfo
                topic={topicData.topic}
                thesis={thesisData.thesis}
                canFetch={currentTab === TopicTabKey.PRIVATE_CONTENT}
              />
            </Tabs.TabPane>
          )}
          {topicData.topic.status === TopicStateAction.APPROVED && (
            <>
              <Tabs.TabPane
                tab={
                  <span>
                    <UnorderedListOutlined />
                    {TopicTerminology.TOPIC_46}
                  </span>
                }
                key={TopicTabKey.STUDENT_INFO}>
                <TopicStudentInfo
                  topic={topicData.topic}
                  canFetch={currentTab === TopicTabKey.STUDENT_INFO}
                />
              </Tabs.TabPane>
              {thesisData.thesis.state >= ThesisState.PROGRESS_REPORT && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon component={FileChartLineIcon} />
                      {ProgressReportTerminology.PR_1}
                    </span>
                  }
                  key={TopicTabKey.PROGRESS_REPORT}>
                  <ProgressReportInfo
                    topic={topicData.topic}
                    thesis={thesisData.thesis}
                    canFetch={currentTab === TopicTabKey.PROGRESS_REPORT}
                  />
                </Tabs.TabPane>
              )}
              {thesisData.thesis.state >= ThesisState.REVIEW && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon component={FileSearchIcon} />
                      {ReviewTerminology.REVIEW_3}
                    </span>
                  }
                  key={TopicTabKey.REVIEW}>
                  <ReviewInfo
                    topic={topicData.topic}
                    thesis={thesisData.thesis}
                    canFetch={currentTab === TopicTabKey.REVIEW}
                  />
                </Tabs.TabPane>
              )}
              {thesisData.thesis.state >= ThesisState.DEFENSE && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon component={ShieldAltIcon} />
                      {DefenseTerminology.DEFENSE_4}
                    </span>
                  }
                  key={TopicTabKey.DEFENSE}>
                  <DefenseInfo
                    topicId={topicId}
                    thesis={thesisData.thesis}
                    canFetch={currentTab === TopicTabKey.DEFENSE}
                  />
                </Tabs.TabPane>
              )}
              {thesisData.thesis.state >= ThesisState.DEFENSE && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon component={PollPeopleIcon} />
                      {ResultTerminology.RESULT_1}
                    </span>
                  }
                  key={TopicTabKey.RESULT}>
                  <ResultInfo topicId={topicId} canFetch={currentTab === TopicTabKey.RESULT} />
                </Tabs.TabPane>
              )}
            </>
          )}
        </Tabs>
      )}
    </Card>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<CommonPageProps, PageParams> = async ({ params }) => {
  const commonService = CommonService.getInstance();

  return {
    props: {
      params,
      title: TopicTerminology.TOPIC_11,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        {
          text: ThesisTerminology.THESIS_4,
          href: commonService.replaceParams(ThesisPath.SPECIFY, [
            (params && params.thesisId) || NaN
          ])
        },
        {
          text: TopicTerminology.TOPIC_11
        }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
