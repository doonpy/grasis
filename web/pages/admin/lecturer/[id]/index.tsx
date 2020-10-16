import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React, { CSSProperties } from 'react';

import AvatarView from '../../../../components/Avatar/AvatarView';
import MainLayout from '../../../../components/Layout/MainLayout';
import LecturerView from '../../../../components/Lecturer/LecturerView';
import UserView from '../../../../components/User/UserView';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import { LecturerRequestBody } from '../../../../libs/lecturer/lecturer.interface';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../../libs/lecturer/lecturer.resource';
import LecturerService from '../../../../libs/lecturer/lecturer.service';
import { UserType } from '../../../../libs/user/user.resource';
const { confirm } = Modal;

interface PageProps extends CommonPageProps {
  currentLecturer: LecturerRequestBody;
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

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

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const lecturerService = LecturerService.getInstance();
  const lecturerId = parseInt(params.id);
  const { data, isLoading } = lecturerService.useLecturer(lecturerId);

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
          await lecturerService.deleteLecturer(lecturerId);
          await lecturerService.redirectService.redirectTo(LECTURER_ADMIN_PATH_ROOT);
        } catch (error) {
          await lecturerService.requestErrorHandler(error);
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
          <Link href={`${LECTURER_ADMIN_PATH_ROOT}/${lecturerId}/edit`}>
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
