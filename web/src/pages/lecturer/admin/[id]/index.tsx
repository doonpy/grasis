import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import styles from '../../../../assets/css/pages/lecturer/admin/index.module.css';
import { LecturerTerminology } from '../../../../assets/terminology/lecturer.terminology';
import AvatarView from '../../../../components/Avatar/AvatarView';
import MainLayout from '../../../../components/Layout/MainLayout';
import LecturerView from '../../../../components/Lecturer/LecturerView';
import UserView from '../../../../components/User/UserView';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.type';
import LecturerAdminService from '../../../../libs/lecturer/admin.service';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../../libs/lecturer/lecturer.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import { UserType } from '../../../../libs/user/user.resource';

const { confirm } = Modal;

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const adminService = LecturerAdminService.getInstance();
  const lecturerId = parseInt(params.id);
  const { data, isLoading } = adminService.useLecturer(lecturerId);
  const loginUserId = LoginUser.getInstance().getId();

  const showDeleteConfirm = () => {
    confirm({
      title: LecturerTerminology.LECTURER_11,
      icon: <ExclamationCircleOutlined />,
      content: LecturerTerminology.LECTURER_12,
      okText: LecturerTerminology.LECTURER_13,
      cancelText: LecturerTerminology.LECTURER_14,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await adminService.deleteLecturer(lecturerId);
          await adminService.redirectService.redirectTo(LECTURER_ADMIN_PATH_ROOT);
        } catch (error) {
          await adminService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Card
      title={LecturerTerminology.LECTURER_10}
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
      {data && (
        <Space size={48} align={'start'}>
          <div className={styles.avatar}>
            <AvatarView userId={lecturerId} width={250} height={250} />
          </div>
          <UserView user={data.lecturer.user} userType={UserType.LECTURER} />
          <LecturerView lecturer={data.lecturer} />
        </Space>
      )}
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
      title: LecturerTerminology.LECTURER_10,
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [
        { text: LecturerTerminology.LECTURER_1, href: LECTURER_ADMIN_PATH_ROOT },
        {
          text: LecturerTerminology.LECTURER_10
        }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
