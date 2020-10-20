import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import styles from '../../../../assets/css/pages/admin/lecturer/index.module.css';
import AvatarView from '../../../../components/Avatar/AvatarView';
import MainLayout from '../../../../components/Layout/MainLayout';
import LecturerView from '../../../../components/Lecturer/LecturerView';
import UserView from '../../../../components/User/UserView';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import AdminLecturerService from '../../../../libs/lecturer/admin/admin.lecturer.service';
import { StudentRequestBody } from '../../../../libs/lecturer/lecturer.interface';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../../libs/lecturer/lecturer.resource';
import { UserType } from '../../../../libs/user/user.resource';

const { confirm } = Modal;

interface PageProps extends CommonPageProps {
  currentLecturer: StudentRequestBody;
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const adminLecturerService = AdminLecturerService.getInstance();
  const loginUserId = adminLecturerService.jwtService.accessTokenPayload.userId;
  const lecturerId = parseInt(params.id);
  const { data, isLoading } = adminLecturerService.useLecturer(lecturerId, true);

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
          await adminLecturerService.deleteLecturer(lecturerId);
          await adminLecturerService.redirectService.redirectTo(LECTURER_ADMIN_PATH_ROOT);
        } catch (error) {
          await adminLecturerService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Card
      title="Chi tiết giảng viên"
      loading={isLoading}
      extra={
        <Space>
          <Link href={`${LECTURER_ADMIN_PATH_ROOT}/${lecturerId}/edit`}>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="large"
              disabled={isLoading}
            />
          </Link>
          <Button
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            size="large"
            onClick={showDeleteConfirm}
            disabled={isLoading || lecturerId === loginUserId}
          />
        </Space>
      }>
      <Space size={48} align={'start'}>
        <div className={styles.avatar}>
          <AvatarView userId={lecturerId} />
        </div>
        <UserView user={data && data.lecturer} userType={UserType.LECTURER} />
        <LecturerView lecturer={data && data.lecturer} />
      </Space>
    </Card>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async ({ params }) => {
  return {
    props: {
      params,
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
    },
    revalidate: 1
  };
};

Index.Layout = MainLayout;

export default Index;
