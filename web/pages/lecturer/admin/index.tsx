import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import LecturerTerminology from '../../../assets/terminology/lecturer.terminology';
import SearchBox from '../../../components/Common/SearchBox';
import MainLayout from '../../../components/Layout/MainLayout';
import { LecturerTableColumns } from '../../../components/Lecturer/LecturerTableColumns';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { DEFAULT_PAGE_SIZE, SIDER_KEYS } from '../../../libs/common/common.resource';
import LecturerAdminService from '../../../libs/lecturer/admin.service';
import { LECTURER_PATH } from '../../../libs/lecturer/lecturer.resource';
import { UserType } from '../../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const [keyword, setKeyword] = useState<string>('');
  const adminService = LecturerAdminService.getInstance();
  const { data, isLoading } = adminService.useLecturers(
    pagination.current,
    pagination.pageSize,
    keyword
  );
  const handleTableChange = (paginationValues) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  const onSearch = (value: string) => {
    setKeyword(value);
  };

  useEffect(() => {
    if (data) {
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  return (
    <Card
      title={LecturerTerminology.LECTURER_1}
      extra={
        <Space size="large">
          <SearchBox onSearch={onSearch} />
          <Link href={LECTURER_PATH.CREATE}>
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              size="large"
              disabled={isLoading}
            />
          </Link>
        </Space>
      }>
      <Table
        bordered
        columns={LecturerTableColumns}
        dataSource={data && data.lecturers}
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
      title: LecturerTerminology.LECTURER_1,
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [{ text: LecturerTerminology.LECTURER_1 }],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
