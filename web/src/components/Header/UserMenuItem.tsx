import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

import CommonService from '../../libs/common/common.service';
import { LecturerPath } from '../../libs/lecturer/lecturer.resource';
import { StudentPath } from '../../libs/student/student.resource';
import LoginUser from '../../libs/user/instance/LoginUser';
import UserService from '../../libs/user/user.service';

const UserMenuItem: React.FC = () => {
  const userClient = UserService.getInstance();
  const commonService = CommonService.getInstance();
  const loginUser = LoginUser.getInstance();
  const handleLogout = async () => {
    await userClient.logout();
  };

  const handleProfile = async () => {
    const profilePath = commonService.replaceParams(
      loginUser.isLecturer() ? LecturerPath.SPECIFY : StudentPath.SPECIFY,
      [loginUser.getId()]
    );
    await commonService.redirectService.redirectTo(profilePath);
  };

  return (
    <Menu selectable={false}>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleProfile}>
        Trang cá nhân
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
};

export default UserMenuItem;
