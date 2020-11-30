import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

const { confirm } = Modal;
import { StudentTerminology } from '../../../../assets/terminology/student.terminology';
import AvatarView from '../../../../components/Avatar/AvatarView';
import MainLayout from '../../../../components/Layout/MainLayout';
import StudentView from '../../../../components/Student/StudentView';
import UserView from '../../../../components/User/UserView';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.type';
import StudentAdminService from '../../../../libs/student/admin.service';
import { STUDENT_ADMIN_PATH_ROOT } from '../../../../libs/student/student.resource';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const adminService = StudentAdminService.getInstance();
  const studentId = parseInt(params.id);
  const { data, isLoading } = adminService.useStudent(studentId);

  const showDeleteConfirm = () => {
    confirm({
      title: StudentTerminology.STUDENT_8,
      icon: <ExclamationCircleOutlined />,
      content: StudentTerminology.STUDENT_9,
      okText: StudentTerminology.STUDENT_10,
      cancelText: StudentTerminology.STUDENT_11,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await adminService.deleteStudent(studentId);
          await adminService.redirectService.redirectTo(STUDENT_ADMIN_PATH_ROOT);
        } catch (error) {
          await adminService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Card
      title={StudentTerminology.STUDENT_7}
      loading={isLoading}
      extra={
        <Space>
          <Link href={`${STUDENT_ADMIN_PATH_ROOT}/${studentId}/edit`}>
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
            disabled={isLoading}
          />
        </Space>
      }>
      {data && (
        <Space size={48} align={'start'}>
          <Space direction="vertical" align="center">
            <AvatarView userId={studentId} width={250} height={250} />
          </Space>
          <UserView user={data.student.user} userType={UserType.STUDENT} />
          <StudentView student={data.student} />
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
      title: StudentTerminology.STUDENT_7,
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        { text: StudentTerminology.STUDENT_1, href: STUDENT_ADMIN_PATH_ROOT },
        {
          text: StudentTerminology.STUDENT_7
        }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
