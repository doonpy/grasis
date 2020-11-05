import { Tag } from 'antd';
import React from 'react';

import { Gender } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  gender: Gender | null;
}

const UserGenderRender: React.FC<ComponentProps> = ({ gender }) => {
  if (gender === Gender.MALE) {
    return <Tag color="blue">Nam</Tag>;
  }

  if (gender === Gender.FEMALE) {
    return <Tag color="magenta">Nữ</Tag>;
  }

  return <TextData />;
};

export default UserGenderRender;
