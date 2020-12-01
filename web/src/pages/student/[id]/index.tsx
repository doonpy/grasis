import { Card, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { StudentTerminology } from '../../../assets/terminology/student.terminology';
import AvatarFormItem from '../../../components/Avatar/AvatarFormItem';
import MainLayout from '../../../components/Layout/MainLayout';
import StudentView from '../../../components/Student/StudentView';
import UserView from '../../../components/User/UserView';
import { getAvatarUrl } from '../../../libs/avatar/avatar.service';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.type';
import StudentService from '../../../libs/student/student.service';
import LoginUser from '../../../libs/user/instance/LoginUser';
import { UserType } from '../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const studentService = StudentService.getInstance();
  const studentId = parseInt(params.id);
  const login = LoginUser.getInstance();
  const { data, isLoading } = studentService.useStudent(studentId);

  return (
    <Card title={StudentTerminology.STUDENT_7} loading={isLoading}>
      {data && (
        <Space size={48} align={'start'}>
          <Space direction="vertical" align="center">
            {login.getId() === data.student.id && (
              <AvatarFormItem
                defaultImageUrl={getAvatarUrl(login.getId())}
                width={250}
                height={250}
              />
            )}
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
      title: 'Chi tiết sinh viên',
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        {
          text: 'Chi tiết sinh viên'
        }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
