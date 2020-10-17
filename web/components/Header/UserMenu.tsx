import { Avatar, Dropdown } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import UserMenuItem from './UserMenuItem';

interface ComponentProps {
  username: string;
  userId: number;
}

const UserMenu: React.FC<ComponentProps> = ({ username, userId }) => {
  return (
    <Dropdown overlay={() => <UserMenuItem />} placement="bottomRight" trigger={['click']} arrow>
      <Avatar size="large" src={getAvatarUrl(userId)}>
        {username[0]}
      </Avatar>
    </Dropdown>
  );
};

export default UserMenu;
