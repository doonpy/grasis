import Icon, {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Button, Card, Modal, Space, Tabs } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import FileChartLineIcon from '../../../../../assets/svg/regular/file-chart-line.svg';
import { ProgressReportTerminology } from '../../../../../assets/terminology/progress-report.terminology';
import { ThesisTerminology } from '../../../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../../../assets/terminology/topic.terminology';
import MainLayout from '../../../../../components/Layout/MainLayout';
import ProgressReportInfo from '../../../../../components/ProgressReport/ProgressReportInfo';
import TopicInfo from '../../../../../components/Topic/TopicInfo';
import TopicPrivateInfo from '../../../../../components/Topic/TopicPrivateInfo';
import TopicStudentInfo from '../../../../../components/Topic/TopicStudentsInfo';
import { SIDER_KEYS } from '../../../../../libs/common/common.resource';
import CommonService from '../../../../../libs/common/common.service';
import { CommonPageProps, NextPageWithLayout } from '../../../../../libs/common/common.type';
import { THESIS_PATH_ROOT, ThesisPath } from '../../../../../libs/thesis/thesis.resource';
import { TopicStateAction } from '../../../../../libs/topic/topic-state/topic-state.resource';
import { TOPIC_PATH_ROOT, TopicPath } from '../../../../../libs/topic/topic.resource';
import TopicService from '../../../../../libs/topic/topic.service';
import { UserType } from '../../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId: string;
  topicId: string;
}

const { confirm } = Modal;

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const topicService = TopicService.getInstance();
  const thesisId = parseInt(params.thesisId);
  const topicId = parseInt(params.topicId);
  const { data, isLoading } = topicService.useTopic(thesisId, topicId);

  const showDeleteConfirm = () => {
    confirm({
      title: TopicTerminology.TOPIC_17,
      icon: <ExclamationCircleOutlined />,
      content: TopicTerminology.TOPIC_18,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.deleteById(thesisId, topicId);
          await topicService.redirectService.redirectTo(
            topicService.replaceParams(TOPIC_PATH_ROOT, [thesisId])
          );
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Card
      loading={isLoading}
      title={TopicTerminology.TOPIC_11}
      extra={
        data &&
        topicService.canEdit(data.topic) && (
          <Space>
            <Link href={topicService.replaceParams(TopicPath.EDIT, [thesisId, topicId])}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                size="large"
                disabled={isLoading}
              />
            </Link>
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              size="large"
              onClick={showDeleteConfirm}
              disabled={isLoading}
            />
          </Space>
        )
      }>
      {data && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                {TopicTerminology.TOPIC_12}
              </span>
            }
            key="1">
            <TopicInfo topic={data.topic} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <UnorderedListOutlined />
                {TopicTerminology.TOPIC_46}
              </span>
            }
            key="2">
            <TopicStudentInfo
              students={data.topic.students}
              creatorId={data.topic.creatorId}
              maxStudent={data.topic.maxStudent}
              currentStudent={data.topic.currentStudent}
            />
          </Tabs.TabPane>
          {topicService.hasPrivateContentPermission(data.topic) && (
            <Tabs.TabPane
              tab={
                <span>
                  <LockOutlined />
                  {TopicTerminology.TOPIC_13}
                </span>
              }
              key="3">
              <TopicPrivateInfo topic={data.topic} />
            </Tabs.TabPane>
          )}
          {data.topic.status === TopicStateAction.APPROVED &&
            topicService.hasPermissionWithLoginUser(data.topic) && (
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon component={FileChartLineIcon} />
                    {ProgressReportTerminology.PR_1}
                  </span>
                }
                key="4">
                <ProgressReportInfo topicId={topicId} thesis={data.topic.thesis} />
              </Tabs.TabPane>
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
          text: TopicTerminology.TOPIC_6,
          href: commonService.replaceParams(TOPIC_PATH_ROOT, [(params && params.thesisId) || NaN])
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
