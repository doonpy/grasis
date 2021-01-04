import { Layout, Row, Space } from 'antd';
import React from 'react';

// import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

const { Header: AntHeader } = Layout;

interface ComponentProps {
  screenWidth: number;
}

const Header: React.FC<ComponentProps> = ({ screenWidth }) => {
  return (
    <AntHeader style={{ padding: 0 }}>
      <Row justify="end" align="middle">
        <Space>
          {/*<NotificationMenu />*/}
          <UserMenu screenWidth={screenWidth} />
        </Space>
      </Row>
    </AntHeader>
  );
};

export default Header;
