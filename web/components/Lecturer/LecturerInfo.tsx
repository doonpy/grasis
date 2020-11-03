import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';

interface ComponentProps {
  lecturer: Lecturer;
}

const LecturerInfo: React.FC<ComponentProps> = ({
  lecturer: {
    id,
    lecturerId,
    user: { firstname, lastname }
  }
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

export default LecturerInfo;
