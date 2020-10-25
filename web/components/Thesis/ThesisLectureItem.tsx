import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { LECTURER_PATH_ROOT } from '../../libs/lecturer/lecturer.resource';

interface ComponentProps {
  lecturer: Lecturer;
}

const ThesisLecturersListItem: React.FC<ComponentProps> = ({
  lecturer: {
    id,
    lecturerId,
    user: { lastname, firstname }
  }
}) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={getAvatarUrl(id)} icon={<UserOutlined />} />}
        title={
          <Link href={`${LECTURER_PATH_ROOT}/${id}`}>{`${lastname || 'NULL'} ${
            firstname || 'NULL'
          } (${lecturerId || 'NULL'})`}</Link>
        }
      />
    </List.Item>
  );
};

export default ThesisLecturersListItem;
