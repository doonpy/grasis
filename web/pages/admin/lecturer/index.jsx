import { FileTextTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Row, Table, Tag, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useFindAllForListLecturer } from '../../../hooks/lecturer.hook';
import withAuth from '../../../hooks/withAuth';
import Main from '../../../layouts/Main';
import {
  formatLecturerForGetMany,
  LECTURER_LIMIT,
  sortByLecturerId,
  sortByPosition
} from '../../../services/lecturer/lecturer.service';
import {
  GENDER,
  sortByFirstname,
  sortByGender,
  sortByLastname,
  sortByStatus,
  sortByUsername,
  USER_STATUS
} from '../../../services/user.service';

const columns = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: (id) => (
      <Link href={`/admin/lecturer/${id}`}>
        <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
      </Link>
    )
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'username',
    key: 'username',
    sorter: {
      compare: sortByUsername,
      multiple: 1
    }
  },
  {
    title: 'Họ và tên đệm',
    dataIndex: 'lastname',
    key: 'lastname',
    sorter: {
      compare: sortByLastname,
      multiple: 2
    }
  },
  {
    title: 'Tên',
    dataIndex: 'firstname',
    key: 'firstname',
    sorter: {
      compare: sortByFirstname,
      multiple: 3
    }
  },
  {
    title: 'Giới tính',
    dataIndex: 'gender',
    key: 'gender',
    width: '10%',
    render: (gender) => (gender === GENDER.FEMALE ? 'Nữ' : 'Nam'),
    sorter: {
      compare: sortByGender,
      multiple: 4
    }
  },
  {
    title: 'Mã giảng viên',
    dataIndex: 'lecturerId',
    key: 'lecturerId',
    width: '10%',
    sorter: {
      compare: sortByLecturerId,
      multiple: 6
    }
  },
  {
    title: 'Chức vụ',
    dataIndex: 'position',
    key: 'position',
    sorter: {
      compare: sortByPosition,
      multiple: 7
    }
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status) =>
      status === USER_STATUS.ACTIVE ? (
        <Tag color="green">Đang hoạt động</Tag>
      ) : (
        <Tag color="volcano">Ngưng hoạt động</Tag>
      ),
    sorter: {
      compare: sortByStatus,
      multiple: 5
    }
  }
];

function Index() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: LECTURER_LIMIT,
    total: 0,
    onChange: (page) => {
      setPagination({ ...pagination, current: page });
    }
  });
  const { data, isLoading } = useFindAllForListLecturer(pagination.current);
  const [lecturers, setLecturers] = useState([]);
  useEffect(() => {
    if (data && data.error) {
      message.error(data.message);
    }

    if (data) {
      setLecturers(formatLecturerForGetMany(data.lecturers));
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  return (
    <Card
      title="Danh sách giảng viên"
      extra={
        <Link href={'/admin/lecturer/create'}>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" />
        </Link>
      }>
      <Table
        bordered
        columns={columns}
        dataSource={lecturers}
        loading={isLoading}
        pagination={pagination}
        size="middle"
      />
    </Card>
  );
}

Index.layout = Main;
Index.getInitialProps = async (ctx) => {
  return { title: 'Giảng viên', selectedMenu: '7' };
};

export default withAuth(Index);
