import { Image } from 'antd';
import React from 'react';

import { DEFAULT_IMAGE, getAvatarUrl } from '../../module/avatar/avatar.service';

function AvatarView({ userId }) {
  return <Image width={300} height={300} src={getAvatarUrl(userId)} fallback={DEFAULT_IMAGE} />;
}

export default AvatarView;
