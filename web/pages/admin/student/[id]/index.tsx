import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React, { CSSProperties } from 'react';

import AvatarView from '../../../../components/Avatar/AvatarView';
import MainLayout from '../../../../components/Layout/MainLayout';
import StudentView from '../../../../components/Student/StudentView';
import UserView from '../../../../components/User/UserView';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import { StudentRequestBody } from '../../../../libs/student/student.interface';
import { STUDENT_ADMIN_PATH_ROOT } from '../../../../libs/student/student.resource';
import StudentService from '../../../../libs/student/student.service';
import { UserType } from '../../../../libs/user/user.resource';
const { confirm } = Modal;

interface PageProps extends CommonPageProps {
  currentStudent: StudentRequestBody;
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
  const studentService = StudentService.getInstance();
  const studentId = parseInt(params.id);
  const { data, isLoading } = studentService.useStudent(studentId);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Bạn có muốn xóa sinh viên này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Thao tác này không thể phục hồi.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await studentService.deleteStudent(studentId);
          await studentService.redirectService.redirectTo(STUDENT_ADMIN_PATH_ROOT);
        } catch (error) {
          await studentService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Card
      title="Chi tiết sinh viên"
      loading={isLoading}
      extra={
        <div>
          <Link href={`${STUDENT_ADMIN_PATH_ROOT}/${studentId}/edit`}>
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
          <AvatarView userId={studentId} />
        </Col>
        <Col offset={1} span={9}>
          <UserView user={data && data.student} />
        </Col>
        <Col offset={1} span={9}>
          <StudentView student={data && data.student} />
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
      title: 'Chi tiết sinh viên',
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        { text: 'Danh sách sinh viên', href: STUDENT_ADMIN_PATH_ROOT },
        {
          text: 'Chi tiết sinh viên'
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
