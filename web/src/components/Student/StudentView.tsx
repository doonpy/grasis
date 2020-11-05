import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React from 'react';

import { Student } from '../../libs/student/student.interface';
import { IsGraduate } from '../../libs/student/student.resource';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import StudentIsGraduate from './StudentIsGraduate';

interface ComponentProps {
  student: Student;
}

const StudentView: React.FC<ComponentProps> = ({
  student: { studentId, schoolYear, studentClass, isGraduate, createdAt, updatedAt }
}) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={4}>
        <InfoCircleOutlined />
        &nbsp;&nbsp;Thông tin sinh viên
      </Typography.Title>
      <Row style={{ paddingLeft: 30 }}>
        <Space size="large">
          <Col>
            <Space direction="vertical" size="middle">
              <Typography.Text strong type="secondary">
                Mã sinh viên
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Niên khóa
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Lớp
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Tình trạng tốt nghiệp
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
              <TextData text={studentId} />
              <TextData text={schoolYear} />
              <TextData text={studentClass} />
              <StudentIsGraduate isGraduate={isGraduate as IsGraduate} />
              <DateData date={createdAt} />
              <DateData date={updatedAt} isRelative={true} />
            </Space>
          </Col>
        </Space>
      </Row>
    </Space>
  );
};

export default StudentView;
