import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { MOBILE_RESPONSIVE } from '../../libs/common/common.resource';
import LoginUser from '../../libs/user/instance/LoginUser';
import UserMenuItem from './UserMenuItem';

interface ComponentProps {
  screenWidth: number;
}

const UserMenu: React.FC<ComponentProps> = ({ screenWidth }) => {
  const loginUser = LoginUser.getInstance();

  return (
    <Dropdown
      overlay={() => <UserMenuItem screenWidth={screenWidth} />}
      placement="bottomCenter"
      trigger={['click']}
      arrow>
      <Button type="text" block size="large">
        <Space>
          <Avatar
            src={getAvatarUrl(loginUser.getId())}
            size={screenWidth > MOBILE_RESPONSIVE ? 'large' : 'small'}
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
