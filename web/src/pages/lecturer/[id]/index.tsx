import { Card, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { LecturerTerminology } from '../../../assets/terminology/lecturer.terminology';
import AvatarFormItem from '../../../components/Avatar/AvatarFormItem';
import MainLayout from '../../../components/Layout/MainLayout';
import LecturerView from '../../../components/Lecturer/LecturerView';
import UserView from '../../../components/User/UserView';
import { getAvatarUrl } from '../../../libs/avatar/avatar.service';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.type';
import LecturerService from '../../../libs/lecturer/lecturer.service';
import LoginUser from '../../../libs/user/instance/LoginUser';
import { UserType } from '../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const lecturerService = LecturerService.getInstance();
  const lecturerId = parseInt(params.id);
  const login = LoginUser.getInstance();
  const { data, isLoading } = lecturerService.useLecturer(lecturerId);

  return (
    <Card title={LecturerTerminology.LECTURER_10} loading={isLoading}>
      {data && (
        <Space size={48} align="start" style={{ width: '100%' }}>
          <Space direction="vertical" align="center">
            {login.getId() === data.lecturer.id && (
              <AvatarFormItem
                defaultImageUrl={getAvatarUrl(login.getId())}
                width={250}
                height={250}
              />
            )}
          </Space>
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
      title: 'Chi tiết giảng viên',
      breadcrumbs: [
        {
          text: 'Chi tiết giảng viên'
        }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
