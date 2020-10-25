import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { LECTURER_PATH_ROOT } from '../../libs/lecturer/lecturer.resource';
import { ThesisLecturer } from '../../libs/thesis/thesis-lecturer/thesis-lecturer.interface';

interface ComponentProps {
  thesisLecturer: ThesisLecturer;
}

const ThesisLecturersListItem: React.FC<ComponentProps> = ({
  thesisLecturer: {
    lecturer: {
      lecturerId,
      user: { id, lastname, firstname }
    }
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
