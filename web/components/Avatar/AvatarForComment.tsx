import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';

interface ComponentProps {
  id: number;
  firstname: string;
  lastname: string;
}

const AvatarForComment: React.FC<ComponentProps> = ({ lastname, firstname, id }) => {
  const fullName = `${lastname || ''} ${firstname || ''}`;

  return (
    <Avatar src={getAvatarUrl(id)} icon={<UserOutlined />}>
      {fullName[0]}
    </Avatar>
  );
};

export default AvatarForComment;
