import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import { ThesisTerminology } from '../../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import SearchBox from '../../../../components/Common/SearchBox';
import MainLayout from '../../../../components/Layout/MainLayout';
import { TopicTableColumns } from '../../../../components/Topic/TopicTableColumns';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { DEFAULT_PAGE_SIZE, SIDER_KEYS } from '../../../../libs/common/common.resource';
import CommonService from '../../../../libs/common/common.service';
import { THESIS_PATH_ROOT, ThesisPath, ThesisState } from '../../../../libs/thesis/thesis.resource';
import ThesisService from '../../../../libs/thesis/thesis.service';
import { TopicPath } from '../../../../libs/topic/topic.resource';
import TopicService from '../../../../libs/topic/topic.service';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId?: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const thesisId: number = parseInt(params.thesisId as string);
  const loginUser = LoginUser.getInstance();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const [keyword, setKeyword] = useState<string>('');
  const topicService = TopicService.getInstance();
  const thesisService = ThesisService.getInstance();
  const { data: topicData, isLoading } = topicService.useTopics(
    thesisId,
    pagination.current,
    pagination.pageSize,
    keyword
  );
  const { data: thesisData } = thesisService.useThesis(thesisId);
  const handleTableChange = (paginationValues) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  const onSearch = (value: string) => {
    setKeyword(value);
  };

  return (
    <Card
      title={TopicTerminology.TOPIC_6}
      extra={
        <Space size="large">
          <SearchBox onSearch={onSearch} />
          {loginUser.isLecturer() &&
            thesisData &&
            thesisData.thesis.state === ThesisState.LECTURER_TOPIC_REGISTER && (
              <Link href={topicService.replaceParams(TopicPath.CREATE, [thesisId])}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="large"
                  disabled={isLoading}
                />
              </Link>
            )}
        </Space>
      }>
      <Table
        bordered
        columns={TopicTableColumns}
        dataSource={topicData && topicData.topics}
        loading={isLoading}
        pagination={pagination}
        size="middle"
        onChange={handleTableChange}
      />
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
      title: TopicTerminology.TOPIC_6,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        {
          text: ThesisTerminology.THESIS_4,
          href: commonService.replaceParams(ThesisPath.SPECIFY, [params.thesisId])
        },
        {
          text: TopicTerminology.TOPIC_6
        }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
