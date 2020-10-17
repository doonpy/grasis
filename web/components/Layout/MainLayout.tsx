import { LoadingOutlined } from '@ant-design/icons';
import { BackTop, Layout, Result } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { CSSProperties } from 'react';

import { CommonPageProps } from '../../libs/common/common.interface';
import { COMMON_PATH } from '../../libs/common/common.resource';
import UserService from '../../libs/user/user.service';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import Copyright from '../Copyright/Copyright';
import Header from '../Header/Header';
import Sider from '../Sider/Sider';

interface MainLayoutProps extends CommonPageProps {
  children: React.FC;
}

const styles: Record<string, CSSProperties> = {
  layout: { marginLeft: 200 },
  content: { margin: '24px 16px 0', overflow: 'initial' },
  footer: { textAlign: 'center' },
  upButton: {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14
  }
};

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const userClient = UserService.getInstance();
  const data = userClient.useAuthorization();

  const { isAdminCheck, allowUserTypes } = props;
  if (data) {
    if (isAdminCheck) {
      if (!userClient.isAdminCheck(data.user.isAdmin)) {
        userClient.redirectService.redirectTo(COMMON_PATH.ERROR.ERR_403);
        return <div />;
      }
    }

    if (allowUserTypes) {
      if (!userClient.isAllowUserType(allowUserTypes, data.user.userType)) {
        userClient.redirectService.redirectTo(COMMON_PATH.ERROR.ERR_403);
        return <div />;
      }
    }
  }

  const router = useRouter();
  if (router.isFallback || !data) {
    return <Result icon={<LoadingOutlined />} title="Đang tải dữ liệu..." />;
  }

  return (
    <Layout>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Sider
        selectedMenu={props.selectedMenu}
        isAdmin={data && data.user.isAdmin}
        userType={data && data.user.userType}
      />
      <Layout style={styles.layout}>
        <Header username={data && data.user.username} />
        <Layout.Content style={styles.content}>
          <Breadcrumb breadcrumbs={props.breadcrumbs} />
          <div>
            {props.children}
            <BackTop>
              <div style={styles.upButton}>UP</div>
            </BackTop>
          </div>
        </Layout.Content>
        <Layout.Footer style={styles.footer}>
          <Copyright />
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
