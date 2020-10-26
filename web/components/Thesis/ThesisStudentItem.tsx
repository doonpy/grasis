import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { STUDENT_PATH_ROOT } from '../../libs/student/student.resource';
import { ThesisStudent } from '../../libs/thesis/thesis-student/thesis-student.interface';
import { UserStatus } from '../../libs/user/user.resource';
import UserStatusRender from '../User/UserStatusRender';

interface ComponentProps {
  thesisStudent: ThesisStudent;
}

const ThesisStudentItem: React.FC<ComponentProps> = ({
  thesisStudent: {
    student: {
      id,
      studentId,
      user: { lastname, firstname, status }
    }
  }
}) => {
  const Title = () => (
    <Link href={`${STUDENT_PATH_ROOT}/${id}`}>
      <a>
        <Space>
          {`${lastname || 'NULL'} ${firstname || 'NULL'}`}
          {status === UserStatus.INACTIVE && <UserStatusRender status={status} />}
        </Space>
      </a>
    </Link>
  );

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={getAvatarUrl(id)} icon={<UserOutlined />} />}
        title={<Title />}
        description={studentId}
      />
    </List.Item>
  );
};

export default ThesisStudentItem;
