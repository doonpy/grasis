import { Tag } from 'antd';
import React from 'react';

import { ThesisStatus } from '../../libs/thesis/thesis.resource';
import TextData from '../Common/TextData';

interface ComponentProps {
  status?: ThesisStatus;
}

const ThesisStatusRender: React.FC<ComponentProps> = ({ status }) => {
  if (status === ThesisStatus.ACTIVE) {
    return <Tag color="green">Đang hoạt động</Tag>;
  }

  if (status === ThesisStatus.INACTIVE) {
    return <Tag color="red">Ngưng hoạt động</Tag>;
  }

  return <TextData />;
};

export default ThesisStatusRender;
