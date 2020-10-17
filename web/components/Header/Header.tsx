import { Layout, Row, Space } from 'antd';
import React from 'react';

import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

const { Header: AntHeader } = Layout;

interface ComponentProps {
  username: string;
  userId: number;
}

const Header: React.FC<ComponentProps> = ({ username, userId }) => {
  return (
    <AntHeader className="site-layout-background">
      <Row justify="end" align="middle">
        <Space size="middle">
          <NotificationMenu />
          <UserMenu username={username} userId={userId} />
        </Space>
      </Row>
    </AntHeader>
  );
};

export default Header;
