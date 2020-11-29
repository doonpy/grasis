import { Layout, Row, Space } from 'antd';
import React from 'react';

import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="site-layout-background">
      <Row justify="end" align="middle">
        <Space>
          <NotificationMenu />
          <UserMenu />
        </Space>
      </Row>
    </AntHeader>
  );
};

export default Header;
