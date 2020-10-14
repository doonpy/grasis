import { Image } from 'antd';
import React from 'react';

import { DEFAULT_IMAGE, getAvatarUrl } from '../../libs/avatar/avatar.service';

interface ComponentProps {
  userId: number;
}

const AvatarView: React.FC<ComponentProps> = ({ userId }) => {
  return <Image width={250} height={250} src={getAvatarUrl(userId)} fallback={DEFAULT_IMAGE} />;
};

export default AvatarView;
