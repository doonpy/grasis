import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { CreatorInfo } from '../../libs/thesis/thesis.type';

interface ComponentProps {
  creatorInfo: CreatorInfo;
  creatorId: number;
}

const ThesisCreatorRender: React.FC<ComponentProps> = ({
  creatorInfo: { lastname, firstname, lecturerId },
  creatorId
}): JSX.Element => {
  const fullName = `${lastname || ''} ${firstname || ''}`;
  const lecturerIdStr = lecturerId ? `(${lecturerId})` : '';

  return (
    <Space>
      <Avatar src={getAvatarUrl(creatorId)} icon={<UserOutlined />}>
        {fullName[0]}
      </Avatar>
      {`${fullName} ${lecturerIdStr}`}
    </Space>
  );
};

export default ThesisCreatorRender;
