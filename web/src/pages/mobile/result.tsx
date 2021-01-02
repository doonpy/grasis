import { Card } from 'antd';
import { GetStaticProps } from 'next';
import React from 'react';

import { ResultTerminology } from '../../assets/terminology/result.terminology';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import MainLayout from '../../components/Layout/MainLayout';
import { SIDER_KEYS } from '../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../libs/common/common.type';
import { THESIS_PATH_ROOT } from '../../libs/thesis/thesis.resource';
import { UserType } from '../../libs/user/user.resource';

const Index: NextPageWithLayout = () => {
  return <Card title={ResultTerminology.RESULT_1}>asdasd</Card>;
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: ThesisTerminology.THESIS_3,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [{ text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT }],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
