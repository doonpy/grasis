import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Empty, Tabs } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import ChalkBoardTeacherIcon from '../../../assets/svg/regular/chalkboard-teacher.svg';
import ListAltIcon from '../../../assets/svg/regular/list-alt.svg';
import UsersClassIcon from '../../../assets/svg/regular/users-class.svg';
import UsersIcon from '../../../assets/svg/regular/users.svg';
import { CouncilTerminology } from '../../../assets/terminology/council.terminology';
import { ThesisTerminology } from '../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../assets/terminology/topic.terminology';
import CouncilList from '../../../components/Council/CouncilList';
import MainLayout from '../../../components/Layout/MainLayout';
import ThesisInfo from '../../../components/Thesis/ThesisInfo';
import ThesisLecturerList from '../../../components/Thesis/ThesisLecturerList';
import ThesisStudentList from '../../../components/Thesis/ThesisStudentList';
import TopicList from '../../../components/Topic/TopicList';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.type';
import { THESIS_PATH_ROOT, ThesisState, ThesisTabKey } from '../../../libs/thesis/thesis.resource';
import ThesisService from '../../../libs/thesis/thesis.service';
import LoginUser from '../../../libs/user/instance/LoginUser';
import { UserType } from '../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const thesisId = parseInt(params.thesisId);
  const [currentTab, setCurrentTab] = useState<string>(ThesisTabKey.INFO);
  const loginUser = LoginUser.getInstance();
  const thesisService = ThesisService.getInstance();
  const { data } = thesisService.useThesis(thesisId);
  const onTabChange = (activeKey: string) => {
    setCurrentTab(activeKey);
  };

  if (!data) {
    return <Empty description={TopicTerminology.TOPIC_63} />;
  }

  const topicListRender = () => {
    if (
      (loginUser.isStudent() && data.thesis.state >= ThesisState.STUDENT_TOPIC_REGISTER) ||
      (loginUser.isLecturer() && data.thesis.state >= ThesisState.LECTURER_TOPIC_REGISTER)
    ) {
      return (
        <Tabs.TabPane
          tab={
            <span>
              <Icon component={ListAltIcon} />
              {TopicTerminology.TOPIC_6}
            </span>
          }
          key={ThesisTabKey.TOPICS}>
          <TopicList thesis={data.thesis} canFetch={currentTab === ThesisTabKey.TOPICS} />
        </Tabs.TabPane>
      );
    }

    return <></>;
  };

  return (
    <Card title={ThesisTerminology.THESIS_4}>
      {!data ? (
        <Empty description={ThesisTerminology.THESIS_48} />
      ) : (
        <Tabs defaultActiveKey={currentTab} onChange={onTabChange}>
          <Tabs.TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                {ThesisTerminology.THESIS_9}
              </span>
            }
            key={ThesisTabKey.INFO}>
            <ThesisInfo thesis={data.thesis} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <Icon component={ChalkBoardTeacherIcon} />
                {ThesisTerminology.THESIS_6}
              </span>
            }
            key={ThesisTabKey.LECTURERS}>
            <ThesisLecturerList
              thesisId={thesisId}
              canFetch={currentTab === ThesisTabKey.LECTURERS}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <Icon component={UsersClassIcon} />
                {ThesisTerminology.THESIS_7}
              </span>
            }
            key={ThesisTabKey.STUDENTS}>
            <ThesisStudentList
              thesisId={thesisId}
              canFetch={currentTab === ThesisTabKey.STUDENTS}
            />
          </Tabs.TabPane>
          {topicListRender()}
          {data.thesis.state >= ThesisState.DEFENSE && loginUser.getId() === data.thesis.creatorId && (
            <Tabs.TabPane
              tab={
                <span>
                  <Icon component={UsersIcon} />
                  {CouncilTerminology.COUNCIL_1}
                </span>
              }
              key={ThesisTabKey.COUNCILS}>
              <CouncilList thesis={data.thesis} canFetch={currentTab === ThesisTabKey.COUNCILS} />
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

export const getStaticProps: GetStaticProps<CommonPageProps> = async ({ params }) => {
  return {
    props: {
      params,
      title: ThesisTerminology.THESIS_4,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        { text: ThesisTerminology.THESIS_4 }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
