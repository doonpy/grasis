import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { LecturerForFastView } from '../../libs/lecturer/lecturer.type';

interface ComponentProps {
  lecturer: LecturerForFastView;
}

const LecturerFastView: React.FC<ComponentProps> = ({
  lecturer: { id, lecturerId, firstname, lastname }
}) => {
  const fullName = `${lastname || ''} ${firstname || ''}`;
  const lecturerIdStr = lecturerId ? `(${lecturerId})` : '';

  return (
    <Space>
      <Avatar src={getAvatarUrl(id)} icon={<UserOutlined />}>
        {fullName[0]}
      </Avatar>
      {`${fullName} ${lecturerIdStr}`}
    </Space>
  );
};

export default LecturerFastView;
