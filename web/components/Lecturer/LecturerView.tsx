import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React from 'react';

import { LecturerViewType } from '../../libs/lecturer/lecturer.interface';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerLevelRender from './LecturerLevelRender';

interface ComponentProps {
  lecturer?: LecturerViewType;
}

const LecturerView: React.FC<ComponentProps> = ({
  lecturer: { lecturerId, level, position, createdAt, updatedAt }
}) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={4}>
        <InfoCircleOutlined />
        &nbsp;&nbsp;Thông tin giảng viên
      </Typography.Title>
      <Row style={{ paddingLeft: 30 }}>
        <Space size="large">
          <Col>
            <Space direction="vertical" size="middle">
              <Typography.Text strong type="secondary">
                Mã giảng viên
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Trình độ
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Chức vụ
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Ngày tạo
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Ngày cập nhật
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" size="middle">
              <TextData text={lecturerId} />
              <LecturerLevelRender level={level as string[]} />
              <TextData text={position} />
              <DateData date={createdAt} />
              <DateData date={updatedAt} />
            </Space>
          </Col>
        </Space>
      </Row>
    </Space>
  );
};

export default LecturerView;
