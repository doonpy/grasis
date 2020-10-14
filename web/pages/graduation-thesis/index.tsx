import { GetStaticProps } from 'next';
import React from 'react';

import MainLayout from '../../components/Layout/MainLayout';
import { CommonPageProps, NextPageWithLayout } from '../../libs/common/common.interface';
import { SIDER_KEYS } from '../../libs/common/common.resource';
import { UserType } from '../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  return <div>Implementing...</div>;
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: 'Danh sách khóa luận',
      selectedMenu: SIDER_KEYS.GRADUATION_THESIS,
      breadcrumbs: [{ text: 'Danh sách khóa luận', href: '/graduation-thesis' }],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
