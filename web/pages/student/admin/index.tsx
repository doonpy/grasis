import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import StudentTerminology from '../../../assets/terminology/student.terminology';
import SearchBox from '../../../components/Common/SearchBox';
import MainLayout from '../../../components/Layout/MainLayout';
import { StudentTableColumns } from '../../../components/Student/StudentTableColumns';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { DEFAULT_PAGE_SIZE, SIDER_KEYS } from '../../../libs/common/common.resource';
import StudentAdminService from '../../../libs/student/admin.service';
import { StudentPath } from '../../../libs/student/student.resource';
import { UserType } from '../../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const [keyword, setKeyword] = useState<string>('');
  const adminService = StudentAdminService.getInstance();
  const { data, isLoading } = adminService.useStudents(
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
      title={StudentTerminology.STUDENT_1}
      extra={
        <Space size="large">
          <SearchBox onSearch={onSearch} />
          <Link href={StudentPath.CREATE}>
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
        columns={StudentTableColumns}
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
      title: StudentTerminology.STUDENT_1,
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [{ text: StudentTerminology.STUDENT_1 }],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
