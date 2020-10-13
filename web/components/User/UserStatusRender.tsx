import { Tag } from 'antd';
import React from 'react';

import { UserStatus } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  status?: UserStatus;
}

const UserStatusRender: React.FC<ComponentProps> = ({ status }) => {
  if (status === UserStatus.ACTIVE) {
    return <Tag color="green">Đang hoạt động</Tag>;
  }

  if (status === UserStatus.INACTIVE) {
    return <Tag color="red">Ngưng hoạt động</Tag>;
  }

  return <TextData />;
};

export default UserStatusRender;
