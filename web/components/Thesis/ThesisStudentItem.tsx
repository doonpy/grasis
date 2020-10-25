import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import Link from 'next/link';
import React from 'react';

import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import { STUDENT_PATH_ROOT } from '../../libs/student/student.resource';
import { ThesisStudent } from '../../libs/thesis/thesis-student/thesis-student.interface';

interface ComponentProps {
  thesisStudent: ThesisStudent;
}

const ThesisStudentItem: React.FC<ComponentProps> = ({
  thesisStudent: {
    student: {
      id,
      studentId,
      user: { lastname, firstname }
    }
  }
}) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={getAvatarUrl(id)} icon={<UserOutlined />} />}
        title={
          <Link href={`${STUDENT_PATH_ROOT}/${id}`}>{`${lastname || 'NULL'} ${
            firstname || 'NULL'
          } (${studentId || 'NULL'})`}</Link>
        }
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      />
    </List.Item>
  );
};

export default ThesisStudentItem;
