import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { LECTURER_PATH_ROOT } from '../../libs/lecturer/lecturer.resource';
import { ThesisLecturer } from '../../libs/thesis/thesis-lecturer/thesis-lecturer.interface';
import { UserStatus } from '../../libs/user/user.resource';
import UserStatusRender from '../User/UserStatusRender';

interface ComponentProps {
  thesisLecturer: ThesisLecturer;
}

const ThesisLecturersListItem: React.FC<ComponentProps> = ({
  thesisLecturer: {
    lecturer: {
      lecturerId,
      user: { id, lastname, firstname, status }
    }
  }
}) => {
  const Title = () => (
    <Link href={`${LECTURER_PATH_ROOT}/${id}`}>
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
        description={lecturerId}
      />
    </List.Item>
  );
};

export default ThesisLecturersListItem;
