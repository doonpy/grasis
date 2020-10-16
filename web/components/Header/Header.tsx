import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Layout, Menu, Row, Space } from 'antd';
import React from 'react';

import UserService from '../../libs/user/user.service';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const userClient = UserService.getInstance();
  const handleLogout = async () => {
    await userClient.logout();
  };

  const userMenu = (
    <Menu theme="light">
      <Menu.Item key="profile" icon={<UserOutlined />}>
        {username || 'NULL'}
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu theme="light">
      <Menu.Item key="1">Thông báo 1</Menu.Item>
      <Menu.Item key="2">Thông báo 2</Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="site-layout-background">
      <Row justify="end" align="middle">
        <Space size="middle">
          <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={['click']} arrow>
            <Badge count={2} offset={[-4, 4]} size="small" overflowCount={99}>
              <Button size="large" type="primary" shape="circle" icon={<BellOutlined />} />
            </Badge>
          </Dropdown>
          <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']} arrow>
            <Button size="large" type="primary" shape="circle" icon={<UserOutlined />} />
          </Dropdown>
        </Space>
      </Row>
    </AntHeader>
  );
};

export default Header;
