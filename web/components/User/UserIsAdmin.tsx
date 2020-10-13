import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import React from 'react';

import { IsAdmin } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  isAdmin?: IsAdmin;
}

const UserIsAdminRender: React.FC<ComponentProps> = ({ isAdmin }) => {
  if (isAdmin === IsAdmin.TRUE) {
    return <CheckCircleTwoTone twoToneColor="#52c41a" />;
  }

  if (isAdmin === IsAdmin.FALSE) {
    return <CloseCircleTwoTone twoToneColor="#f5222d" />;
  }

  return <TextData />;
};

export default UserIsAdminRender;
