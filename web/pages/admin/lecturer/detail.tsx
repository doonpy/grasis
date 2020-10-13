import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row } from 'antd';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { CSSProperties } from 'react';

import AvatarView from '../../../components/Avatar/AvatarView';
import MainLayout from '../../../components/Layout/MainLayout';
import LecturerView from '../../../components/Lecturer/LecturerView';
import UserView from '../../../components/User/UserView';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import LecturerClient from '../../../libs/lecturer/lecturer.client';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../libs/lecturer/lecturer.resource';
import { UserType } from '../../../libs/user/user.resource';
const { confirm } = Modal;

const styles: Record<string, CSSProperties> = {
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

const Detail: NextPageWithLayout = () => {
  const lecturerClient = LecturerClient.getInstance();
  const router = useRouter();
  const lecturerId = parseInt(router.query.id as string);
  const { data, isLoading } = lecturerClient.useLecturer(lecturerId);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Bạn có muốn xóa giảng viên này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể phục hồi.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await lecturerClient.deleteLecturer(lecturerId);
          await lecturerClient.redirectService.redirectTo(LECTURER_ADMIN_PATH_ROOT);
        } catch (error) {
          await lecturerClient.requestErrorHandler(error);
        }
      }
    });
  };

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
              disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
      }>
      <Row>
        <Col span={4} style={styles.avatar}>
          <AvatarView userId={lecturerId} />
        </Col>
        <Col offset={1} span={9}>
          <UserView user={data && data.lecturer} />
        </Col>
        <Col offset={1} span={9}>
          <LecturerView lecturer={data && data.lecturer} />
        </Col>
      </Row>
    </Card>
  );
};

export const getStaticProps: GetServerSideProps<CommonPageProps> = async () => {
  return {
    props: {
      title: 'Chi tiết giảng viên',
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [
        { text: 'Danh sách giảng viên', href: LECTURER_ADMIN_PATH_ROOT },
        {
          text: 'Chi tiết giảng viên'
        }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Detail.Layout = MainLayout;

export default Detail;
