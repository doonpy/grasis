import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Table } from 'antd';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import MainLayout from '../../../components/Layout/MainLayout';
import { STUDENT_TABLE_COLUMNS } from '../../../components/Student/StudentColumns';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { DEFAULT_PAGE_SIZE, SIDER_KEYS } from '../../../libs/common/common.resource';
import AdminStudentService from '../../../libs/student/admin/admin.student.service';
import { STUDENT_PATH } from '../../../libs/student/student.resource';
import { UserType } from '../../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const adminStudentService = AdminStudentService.getInstance();
  const { data, isLoading } = adminStudentService.useStudents(
    pagination.current,
    pagination.pageSize
  );
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
      title="Danh sách sinh viên"
      extra={
        <Link href={STUDENT_PATH.CREATE}>
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
        columns={STUDENT_TABLE_COLUMNS}
        dataSource={data && data.students}
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
      title: 'Danh sách sinh viên',
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [{ text: 'Danh sách sinh viên' }],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
