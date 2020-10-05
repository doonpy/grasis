import { Layout } from 'antd';
import React from 'react';

import Header from '../components/Header/Header';
import Sider from '../components/Sider/Sider';

const { Content, Footer } = Layout;
const styles = {
  layout: { marginLeft: 200 },
  content: { margin: '24px 16px 0', overflow: 'initial' },
  footer: { textAlign: 'center' }
};

function Main({ children, ...props }) {
  return (
    <Layout>
      <Sider {...props} />
      <Layout className="site-layout" style={styles.layout}>
        <Header />
        <Content style={styles.content}>
          <div className="site-layout-background">{children}</div>
        </Content>
        <Footer style={styles.footer}>
          {'Copyright © '}
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a href="https://github.com/doonpy" target={'_blank'}>
            Poon Nguyen
          </a>{' '}
          {new Date().getFullYear()}
          {' - HCMUTE'}
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Main;
