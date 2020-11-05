import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { LecturerTerminology } from '../../assets/terminology/lecturer.terminology';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerLevelRender from './LecturerLevelRender';

interface ComponentProps {
  lecturer: Lecturer;
}

const LecturerView: React.FC<ComponentProps> = ({
  lecturer: { lecturerId, level, position, createdAt, updatedAt }
}) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={4}>
        <InfoCircleOutlined />
        &nbsp;&nbsp;{LecturerTerminology.LECTURER_15}
      </Typography.Title>
      <Row style={{ paddingLeft: 30 }}>
        <Space size="large">
          <Col>
            <Space direction="vertical" size="middle">
              <Typography.Text strong type="secondary">
                {LecturerTerminology.LECTURER_3}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {LecturerTerminology.LECTURER_4}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {LecturerTerminology.LECTURER_9}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {CommonTerminology.COMMON_1}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {CommonTerminology.COMMON_2}
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" size="middle">
              <TextData text={lecturerId} />
              <LecturerLevelRender level={level as string[]} />
              <TextData text={position} />
              <DateData date={createdAt} />
              <DateData date={updatedAt} isRelative={true} />
            </Space>
          </Col>
        </Space>
      </Row>
    </Space>
  );
};

export default LecturerView;
