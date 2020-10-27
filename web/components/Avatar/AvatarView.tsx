import { Image } from 'antd';
import React from 'react';

import { DEFAULT_IMAGE, getAvatarUrl } from '../../libs/avatar/avatar.service';

interface ComponentProps {
  userId: number;
  width?: number | string;
  height?: number | string;
}

const AvatarView: React.FC<ComponentProps> = ({ userId, width, height }) => {
  return (
    <Image width={width} height={height} src={getAvatarUrl(userId)} fallback={DEFAULT_IMAGE} />
  );
};

export default AvatarView;
