import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, Row } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import AvatarView from '../../../../components/Avatar/AvatarView';
import LecturerView from '../../../../components/Lecturer/LecturerView';
import UserView from '../../../../components/User/UserView';
import withAuth from '../../../../hoc/withAuth';
import { useFindOneLecturer } from '../../../../hooks/lecturer.hook';
import Main from '../../../../layouts/Main';
import { SidebarKey } from '../../../../module/common/sidebar';
import {
  deleteLecturer,
  formatLecturerForGetOne,
  getInitialLecturer
} from '../../../../module/lecturer/lecturer.service';
import { USER_TYPE } from '../../../../module/user/user.resource';
import { isAdminCheck, userTypeCheck } from '../../../../module/user/user.service';
const { confirm } = Modal;

const styles = {
  rowContentBox: {
    paddingLeft: 10
  },
  colContentBox: {
    marginLeft: 20
  },
  rowContentItem: {
    margin: 20
  },
  controlButton: {
    marginRight: 20
  },
  avatar: { textAlign: 'center' }
};

function Edit({ initLecturer, initUser }) {
  const router = useRouter();
  const [lecturer, setLecturer] = useState({ ...initLecturer, ...initUser });
  const { data, isLoading } = useFindOneLecturer(router.query.id);
  const showDeleteConfirm = () => {
    confirm({
      title: 'Bạn có muốn xóa giảng viên này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể phục hồi.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        const res = await deleteLecturer(router.query.id);
        if (res.message) {
          message.error(res.message);
        } else {
          await router.replace(`/admin/lecturer`);
        }
      }
    });
  };

  useEffect(() => {
    if (data && data.message) {
      message.error(data.message);
      return;
    }

    if (!isLoading && data) {
      setLecturer(formatLecturerForGetOne(data.lecturer));
    }
  }, [data]);

  return (
    <Card
      title="Chi tiết giảng viên"
      loading={isLoading}
      extra={
        <div>
          <Link href={`/admin/lecturer/${router.query.id}/edit`}>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="large"
              style={styles.controlButton}
            />
          </Link>
          <Button
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            size="large"
            style={styles.controlButton}
            onClick={showDeleteConfirm}
          />
        </div>
      }>
      <Row justify="center">
        <Col span={8} style={styles.avatar}>
          <AvatarView userId={initUser.id} />
        </Col>
        <UserView user={lecturer} />
        <LecturerView lecturer={lecturer} />
      </Row>
    </Card>
  );
}

Edit.layout = Main;
Edit.getInitialProps = async ({ isAdmin, userType, asPath, query, req, res }) => {
  isAdminCheck(isAdmin, res);
  userTypeCheck([USER_TYPE.LECTURER, USER_TYPE.STUDENT], userType, res);

  return {
    ...(await getInitialLecturer(query.id, { req }, { res })),
    title: 'Chi tiết giảng viên',
    selectedMenu: SidebarKey.ADMIN_LECTURER,
    breadcrumbs: [
      { text: 'Danh sách giảng viên', href: '/admin/lecturer' },
      { text: 'Chi tiết giảng viên', href: asPath }
    ]
  };
};

export default withAuth(Edit);
