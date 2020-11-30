import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import UserMenuItem from './UserMenuItem';

const UserMenu: React.FC = () => {
  const loginUser = LoginUser.getInstance();

  return (
    <Dropdown overlay={() => <UserMenuItem />} placement="bottomCenter" trigger={['click']} arrow>
      <Button type="text" block size="large">
        <Space>
          <Avatar
            src={getAvatarUrl(loginUser.getId())}
            size="large"
            style={{ backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          />
          <span style={{ color: 'white' }}>{loginUser.getFullName()}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default UserMenu;
