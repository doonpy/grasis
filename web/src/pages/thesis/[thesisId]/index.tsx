import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import ChalkBoardTeacherIcon from '../../../assets/svg/regular/chalkboard-teacher.svg';
import ListAltIcon from '../../../assets/svg/regular/list-alt.svg';
import UsersClassIcon from '../../../assets/svg/regular/users-class.svg';
import { ThesisTerminology } from '../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../assets/terminology/topic.terminology';
import MainLayout from '../../../components/Layout/MainLayout';
import ThesisInfo from '../../../components/Thesis/ThesisInfo';
import ThesisLecturerList from '../../../components/Thesis/ThesisLecturerList';
import ThesisStudentList from '../../../components/Thesis/ThesisStudentList';
import TopicList from '../../../components/Topic/TopicList';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.type';
import { THESIS_PATH_ROOT, ThesisTabKey } from '../../../libs/thesis/thesis.resource';
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

  const onTabChange = (activeKey: string) => {
    setCurrentTab(activeKey);
  };

  return (
    <Card title={ThesisTerminology.THESIS_4}>
      <Tabs defaultActiveKey={currentTab} onChange={onTabChange}>
        <Tabs.TabPane
          tab={
            <span>
              <InfoCircleOutlined />
              {ThesisTerminology.THESIS_9}
            </span>
          }
          key={ThesisTabKey.INFO}>
          <ThesisInfo thesisId={thesisId} canFetch={currentTab === ThesisTabKey.INFO} />
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
          <ThesisStudentList thesisId={thesisId} canFetch={currentTab === ThesisTabKey.STUDENTS} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon component={ListAltIcon} />
              {TopicTerminology.TOPIC_6}
            </span>
          }
          key={ThesisTabKey.TOPICS}>
          <TopicList thesisId={thesisId} canFetch={currentTab === ThesisTabKey.TOPICS} />
        </Tabs.TabPane>
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
