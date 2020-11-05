import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';

function AvatarHeader({ userId }) {
  return <Avatar shape="circle" size="large" src={getAvatarUrl(userId)} icon={<UserOutlined />} />;
}

export default AvatarHeader;
