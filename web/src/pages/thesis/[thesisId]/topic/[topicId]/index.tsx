import Icon, { InfoCircleOutlined, LockOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Empty, Tabs } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import FileChartLineIcon from '../../../../../assets/svg/regular/file-chart-line.svg';
import FileSearchIcon from '../../../../../assets/svg/regular/file-search.svg';
import { ProgressReportTerminology } from '../../../../../assets/terminology/progress-report.terminology';
import { ReviewTerminology } from '../../../../../assets/terminology/review.terminology';
import { ThesisTerminology } from '../../../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../../../assets/terminology/topic.terminology';
import MainLayout from '../../../../../components/Layout/MainLayout';
import ProgressReportInfo from '../../../../../components/Topic/State/ProgressReport/ProgressReportInfo';
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
import { TopicTabKey } from '../../../../../libs/topic/topic.resource';
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
  const { data, isLoading } = thesisService.useThesis(thesisId);

  const onTabChange = (activeKey: string) => {
    setCurrentTab(activeKey);
  };

  if (!data) {
    return <Empty />;
  }

  return (
    <Card title={TopicTerminology.TOPIC_11} loading={isLoading}>
      <Tabs defaultActiveKey={currentTab} onChange={onTabChange}>
        <Tabs.TabPane
          tab={
            <span>
              <InfoCircleOutlined />
              {TopicTerminology.TOPIC_12}
            </span>
          }
          key={TopicTabKey.INFO}>
          <TopicInfo
            topicId={topicId}
            thesisId={thesisId}
            canFetch={currentTab === TopicTabKey.INFO}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <LockOutlined />
              {TopicTerminology.TOPIC_13}
            </span>
          }
          key={TopicTabKey.PRIVATE_CONTENT}>
          <TopicPrivateInfo
            topicId={topicId}
            thesis={data.thesis}
            canFetch={currentTab === TopicTabKey.PRIVATE_CONTENT}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <UnorderedListOutlined />
              {TopicTerminology.TOPIC_46}
            </span>
          }
          key={TopicTabKey.STUDENT_INFO}>
          <TopicStudentInfo topicId={topicId} canFetch={currentTab === TopicTabKey.STUDENT_INFO} />
        </Tabs.TabPane>
        {data.thesis.state >= ThesisState.PROGRESS_REPORT && (
          <Tabs.TabPane
            tab={
              <span>
                <Icon component={FileChartLineIcon} />
                {ProgressReportTerminology.PR_1}
              </span>
            }
            key={TopicTabKey.PROGRESS_REPORT}>
            <ProgressReportInfo
              topicId={topicId}
              thesis={data.thesis}
              canFetch={currentTab === TopicTabKey.PROGRESS_REPORT}
            />
          </Tabs.TabPane>
        )}
        {data.thesis.state >= ThesisState.REVIEW && (
          <Tabs.TabPane
            tab={
              <span>
                <Icon component={FileSearchIcon} />
                {ReviewTerminology.REVIEW_3}
              </span>
            }
            key={TopicTabKey.REVIEW}>
            <ReviewInfo
              topicId={topicId}
              thesis={data.thesis}
              canFetch={currentTab === TopicTabKey.REVIEW}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
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
