import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { StudentForFastView } from '../../libs/student/student.interface';

interface ComponentProps {
  student: StudentForFastView;
}

const StudentFastView: React.FC<ComponentProps> = ({
  student: { id, studentId, firstname, lastname }
}) => {
  const fullName = `${lastname || ''} ${firstname || ''}`;
  const studentIdStr = studentId ? `(${studentId})` : '';

  return (
    <Space>
      <Avatar src={getAvatarUrl(id)} icon={<UserOutlined />}>
        {fullName[0]}
      </Avatar>
      {`${fullName} ${studentIdStr}`}
    </Space>
  );
};

export default StudentFastView;
