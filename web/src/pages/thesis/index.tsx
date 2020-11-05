import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import SearchBox from '../../components/Common/SearchBox';
import MainLayout from '../../components/Layout/MainLayout';
import { ThesisTableColumns } from '../../components/Thesis/ThesisTableColumns';
import { CommonPageProps, NextPageWithLayout } from '../../libs/common/common.interface';
import { DEFAULT_PAGE_SIZE, SIDER_KEYS } from '../../libs/common/common.resource';
import { THESIS_PATH_ROOT, ThesisPath } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import { UserType } from '../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const [keyword, setKeyword] = useState<string>('');
  const thesisService = ThesisService.getInstance();
  const { data, isLoading } = thesisService.useTheses(
    pagination.current,
    pagination.pageSize,
    keyword
  );
  const handleTableChange = (paginationValues: PaginationProps) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  const onSearch = (value: string) => {
    setKeyword(value);
  };

  return (
    <Card
      title={ThesisTerminology.THESIS_3}
      extra={
        <Space size="large">
          <SearchBox onSearch={onSearch} />
          {LoginUser.getInstance().isAdmin() && (
            <Link href={ThesisPath.CREATE}>
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
        columns={ThesisTableColumns}
        dataSource={data && data.theses}
        loading={isLoading}
        pagination={pagination}
        size="middle"
        onChange={handleTableChange}
      />
    </Card>
  );
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: ThesisTerminology.THESIS_3,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [{ text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT }],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
