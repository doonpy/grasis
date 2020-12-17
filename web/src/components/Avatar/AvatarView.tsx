import { Image } from 'antd';
import React from 'react';

import FallbackImage from '../../assets/img/fallback-img.png';
import { getAvatarUrl } from '../../libs/avatar/avatar.service';

interface ComponentProps {
  userId: number;
  width?: number | string;
  height?: number | string;
}

const AvatarView: React.FC<ComponentProps> = ({ userId, width, height }) => {
  return (
    <Image
      alt="avatar"
      width={width}
      height={height}
      src={getAvatarUrl(userId)}
      fallback={FallbackImage}
    />
  );
};

export default AvatarView;
