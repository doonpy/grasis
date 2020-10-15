import { SmileOutlined } from '@ant-design/icons';
import { BackTop, Layout, Result, Spin } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { CSSProperties } from 'react';

import { CommonPageProps } from '../../libs/common/common.interface';
import UserClient from '../../libs/user/user.client';
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
  const userClient = UserClient.getInstance();
  const data = userClient.useAuthorization({
    allowUserTypes: props.allowUserTypes,
    isAdminCheck: props.isAdminCheck
  });
  const router = useRouter();
  if (router.isFallback) {
    return <Result icon={<SmileOutlined />} title="Đang tải dữ liệu..." />;
  }

  return (
    <Spin spinning={!data} tip="Đang tải dữ liệu..." size="large">
      <Layout>
        <Head>
          <title>{props.title}</title>
        </Head>
        <Sider
          selectedMenu={props.selectedMenu}
          isAdmin={data && data.user.isAdmin}
          userType={data && data.user.userType}
        />
        <Layout className="site-layout" style={styles.layout}>
          <Header username={data && data.user.username} />
          <Layout.Content style={styles.content}>
            <Breadcrumb breadcrumbs={props.breadcrumbs} />
            <div className="site-layout-background">
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
    </Spin>
  );
};

export default MainLayout;
