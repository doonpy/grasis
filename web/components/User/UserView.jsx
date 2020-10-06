import { UserOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import React from 'react';

import {
  formatGenderForView,
  formatIsAdminForView,
  formatStatusForView
} from '../../services/user/user.service';

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

function UserView({ user }) {
  return (
    <Col span={8}>
      <Row justify="start">
        <Typography.Title level={4}>
          <UserOutlined />
          &nbsp;&nbsp;Thông tin người dùng
        </Typography.Title>
      </Row>
      <Row justify="start" style={styles.rowContentBox}>
        <Col>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Tên người dùng
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Họ và tên đệm
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Tên
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Giới tính
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Email
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Địa chỉ
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Số điện thoại
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Trạng thái
            </Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text strong type="secondary">
              Quản trị viên
            </Typography.Text>
          </Row>
        </Col>
        <Col style={styles.colContentBox}>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{user.username || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{user.lastname || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{user.firstname || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{formatGenderForView(user.gender)}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{user.email || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{user.address || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{user.phone || 'NULL'}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{formatStatusForView(user.status)}</Typography.Text>
          </Row>
          <Row style={styles.rowContentItem}>
            <Typography.Text>{formatIsAdminForView(user.isAdmin)}</Typography.Text>
          </Row>
        </Col>
      </Row>
    </Col>
  );
}

export default UserView;
