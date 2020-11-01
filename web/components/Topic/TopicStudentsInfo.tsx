import { Descriptions, Table } from 'antd';
import React from 'react';

import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { TopicStudent } from '../../libs/topic/topic-student/topic-student.interface';
import LoginUser from '../../libs/user/instance/LoginUser';
import { TopicStudentTableColumns } from './TopicStudentTableColumns';

interface ComponentProps {
  students: TopicStudent[];
  creatorId: number;
}

const TopicStudentInfo: React.FC<ComponentProps> = ({ students, creatorId }) => {
  const pagination = {
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: students.length,
    showSizeChanger: false
  };
  const loginUser = LoginUser.getInstance();
  let topicStudentTableColumn = [...TopicStudentTableColumns];
  const reformattedStudents = students.map((students, index) => ({
    ...students,
    key: index.toString()
  }));
  if (loginUser.getId() !== creatorId) {
    topicStudentTableColumn = topicStudentTableColumn.filter(({ key }) => key !== 'action');
  }

  return (
    <Descriptions>
      <Descriptions.Item span={3}>
        <Table
          columns={topicStudentTableColumn}
          dataSource={reformattedStudents}
          bordered
          pagination={pagination}
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TopicStudentInfo;
