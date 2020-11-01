import Icon from '@ant-design/icons';
import { Descriptions, Divider, Space, Statistic, Table } from 'antd';
import React from 'react';

import BanIcon from '../../assets/svg/regular/ban.svg';
import CheckIcon from '../../assets/svg/regular/check.svg';
import SigmaIcon from '../../assets/svg/regular/sigma.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { TopicStudent } from '../../libs/topic/topic-student/topic-student.interface';
import { TopicStudentStatus } from '../../libs/topic/topic-student/topic-student.resource';
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

  const studentsStatistic = () => {
    const total = students.length;
    const acceptAmount = students.filter(({ status }) => status === TopicStudentStatus.APPROVED)
      .length;
    const rejectAmount = students.filter(({ status }) => status === TopicStudentStatus.REJECTED)
      .length;

    return (
      <Space size="large" split={<Divider type="vertical" />}>
        <Statistic
          title={TopicTerminology.TOPIC_51}
          prefix={<Icon component={SigmaIcon} />}
          value={total}
        />
        <Statistic
          title={TopicTerminology.TOPIC_22}
          prefix={<Icon component={CheckIcon} />}
          valueStyle={{ color: '#3f8600' }}
          value={acceptAmount}
        />
        <Statistic
          title={TopicTerminology.TOPIC_23}
          prefix={<Icon component={BanIcon} />}
          valueStyle={{ color: '#cf1322' }}
          value={rejectAmount}
        />
      </Space>
    );
  };

  return (
    <Descriptions>
      <Descriptions.Item span={3}>
        <Table
          title={studentsStatistic}
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
