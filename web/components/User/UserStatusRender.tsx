import { Tag } from 'antd';
import React from 'react';

import UserTerminology from '../../assets/terminology/user.terminology';
import { UserStatus } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  status?: UserStatus;
}

const UserStatusRender: React.FC<ComponentProps> = ({ status }) => {
  if (status === UserStatus.ACTIVE) {
    return <Tag color="green">{UserTerminology.USER_17}</Tag>;
  }

  if (status === UserStatus.INACTIVE) {
    return <Tag color="red">{UserTerminology.USER_18}</Tag>;
  }

  return <TextData />;
};

export default UserStatusRender;
