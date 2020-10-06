import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, message, Table } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import withAuth from '../../../hoc/withAuth';
import { useFindAllForListLecturer } from '../../../hooks/lecturer.hook';
import Main from '../../../layouts/Main';
import { SidebarKey } from '../../../resource/sidebar';
import { USER_TABLE_COLUMNS, USER_TYPE } from '../../../resource/user';
import {
  DEFAULT_PAGE_SIZE,
  formatLecturerForGetMany
} from '../../../services/lecturer/lecturer.service';
import { isAdminCheck, userTypeCheck } from '../../../services/user/user.service';

function Index() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const { data, isLoading } = useFindAllForListLecturer(pagination.current, pagination.pageSize);
  const [lecturers, setLecturers] = useState([]);
  const handleTableChange = (paginationValues) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  useEffect(() => {
    if (data && data.message) {
      message.error(data.message);
      return;
    }

    if (data) {
      setLecturers(formatLecturerForGetMany(data.lecturers));
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  return (
    <div>
      <Card
        title="Danh sách giảng viên"
        extra={
          <Link href={'/admin/lecturer/create'}>
            <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" />
          </Link>
        }>
        <Table
          bordered
          columns={USER_TABLE_COLUMNS}
          dataSource={lecturers}
          loading={isLoading}
          pagination={pagination}
          size="middle"
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}

Index.layout = Main;
Index.getInitialProps = ({ isAdmin, userType, asPath, res }) => {
  isAdminCheck(isAdmin, res);
  userTypeCheck([USER_TYPE.LECTURER, USER_TYPE.STUDENT], userType, res);

  return {
    title: 'Danh sách giảng viên',
    selectedMenu: SidebarKey.ADMIN_LECTURER,
    breadcrumbs: [{ text: 'Danh sách giảng viên', href: asPath }]
  };
};

export default withAuth(Index);
