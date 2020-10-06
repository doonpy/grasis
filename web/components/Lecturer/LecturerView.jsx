import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tag, Typography } from 'antd';
import React from 'react';

const styles = {
  rowContentBox: {
    paddingLeft: 10
  },
  colContentBox: {
    marginLeft: 20
  },
  rowContentItem: {
    margin: 20
  },
  controlButton: {
    marginRight: 20
  }
};

function LecturerView({ lecturer }) {
  return (
    <Col span={8}>
      <Row justify="start">
        <Typography.Title level={4}>
          <InfoCircleOutlined />
          &nbsp;&nbsp;Thông tin giảng viên
        </Typography.Title>
      </Row>
      <Row justify="start" style={styles.rowContentBox}>
        <Col>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Mã giảng viên
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Trình độ
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Chức vụ
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Ngày tạo
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Ngày cập nhật
            </Typography.Text>
          </Row>
        </Col>
        <Col style={styles.colContentBox}>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{lecturer.lecturerId || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>
              {lecturer.level
                ? lecturer.level.split(';').map((item, index) => (
                    <Tag color="blue" key={index}>
                      {item}
                    </Tag>
                  ))
                : 'NULL'}
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem || 'NULL'}>
            <Typography.Text>{lecturer.position || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{lecturer.createdAt || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{lecturer.updatedAt || 'NULL'}</Typography.Text>
          </Row>
        </Col>
      </Row>
    </Col>
  );
}

export default LecturerView;
