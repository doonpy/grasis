import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { Student } from '../../libs/student/student.interface';

interface ComponentProps {
  student: Student;
}

const StudentInfo: React.FC<ComponentProps> = ({
  student: {
    id,
    studentId,
    user: { firstname, lastname }
  }
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

export default StudentInfo;
