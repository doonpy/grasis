import { BackTop, Layout } from 'antd';
import Head from 'next/head';
import React from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Copyright from '../components/Copyright/Copyright';
import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';

const { Content, Footer } = Layout;
const styles = {
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

function Main({ children, title, breadcrumbs, selectedMenu, ...props }) {
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Sider selectedMenu={selectedMenu} {...props} />
      <Layout className="site-layout" style={styles.layout}>
        <Header />
        <Content style={styles.content}>
          <Breadcrumb breadcrumbs={breadcrumbs} />
          <div className="site-layout-background">
            {children}
            <BackTop>
              <div style={styles.upButton}>UP</div>
            </BackTop>
          </div>
        </Content>
        <Footer style={styles.footer}>
          <Copyright />
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Main;
