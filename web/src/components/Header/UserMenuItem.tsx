import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

import UserService from '../../libs/user/user.service';

const UserMenuItem: React.FC = () => {
  const userClient = UserService.getInstance();
  const handleLogout = async () => {
    await userClient.logout();
  };

  return (
    <Menu selectable={false}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Trang cá nhân
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
};

export default UserMenuItem;
