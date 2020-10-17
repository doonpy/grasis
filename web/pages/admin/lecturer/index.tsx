import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Table } from 'antd';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import MainLayout from '../../../components/Layout/MainLayout';
import { LECTURER_TABLE_COLUMNS } from '../../../components/Lecturer/LecturerColumns';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { DEFAULT_PAGE_SIZE, SIDER_KEYS } from '../../../libs/common/common.resource';
import { LECTURER_PATH } from '../../../libs/lecturer/lecturer.resource';
import LecturerService from '../../../libs/lecturer/lecturer.service';
import { UserType } from '../../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const lecturerService = LecturerService.getInstance();
  const { data, isLoading } = lecturerService.useLecturers(pagination.current, pagination.pageSize);
  const handleTableChange = (paginationValues) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  useEffect(() => {
    if (data) {
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  return (
    <Card
      title="Danh sách giảng viên"
      extra={
        <Link href={LECTURER_PATH.CREATE}>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            disabled={isLoading}
          />
        </Link>
      }>
      <Table
        bordered
        columns={LECTURER_TABLE_COLUMNS}
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
      title: 'Danh sách giảng viên',
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [{ text: 'Danh sách giảng viên' }],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
