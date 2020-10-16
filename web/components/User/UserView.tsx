import { UserOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React from 'react';

import { UserViewType } from '../../libs/user/user.interface';
import TextData from '../Common/TextData';
import UserGenderRender from './UserGenderRender';
import UserIsAdminRender from './UserIsAdmin';
import UserStatusRender from './UserStatusRender';

interface ComponentProps {
  user?: UserViewType;
}

const UserView: React.FC<ComponentProps> = ({
  user: { username, firstname, lastname, gender, email, address, phone, status, isAdmin }
}) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={4}>
        <UserOutlined />
        &nbsp;&nbsp;Thông tin người dùng
      </Typography.Title>
      <Row style={{ paddingLeft: 30 }}>
        <Space size="large">
          <Col>
            <Space direction="vertical" size="middle">
              <Typography.Text strong type="secondary">
                Tên người dùng
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Họ và tên đệm
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Tên
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Giới tính
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Email
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Địa chỉ
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Số điện thoại
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Trạng thái
              </Typography.Text>
              <Typography.Text strong type="secondary">
                Quản trị viên
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" size="middle">
              <TextData text={username} />
              <TextData text={lastname} />
              <TextData text={firstname} />
              <UserGenderRender gender={gender} />
              <TextData text={email} />
              <TextData text={address} />
              <TextData text={phone} />
              <UserStatusRender status={status} />
              <UserIsAdminRender isAdmin={isAdmin} />
            </Space>
          </Col>
        </Space>
      </Row>
    </Space>
  );
};

export default UserView;