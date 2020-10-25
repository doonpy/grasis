import { UserOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React from 'react';

import UserTerminology from '../../assets/terminology/user.terminology';
import { User } from '../../libs/user/user.interface';
import { IsAdmin, UserStatus, UserType } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';
import UserGenderRender from './UserGenderRender';
import UserIsAdminRender from './UserIsAdmin';
import UserStatusRender from './UserStatusRender';

interface ComponentProps {
  user: User;
  userType: UserType;
}

const UserView: React.FC<ComponentProps> = ({
  user: { username, firstname, lastname, gender, email, address, phone, status, isAdmin },
  userType
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
                {UserTerminology.USER_1}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_5}{' '}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_4}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_6}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_7}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_8}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_9}
              </Typography.Text>
              <Typography.Text strong type="secondary">
                {UserTerminology.USER_10}
              </Typography.Text>
              {userType === UserType.LECTURER && (
                <Typography.Text strong type="secondary">
                  {UserTerminology.USER_11}
                </Typography.Text>
              )}
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
              <UserStatusRender status={status as UserStatus} />
              {userType === UserType.LECTURER && <UserIsAdminRender isAdmin={isAdmin as IsAdmin} />}
            </Space>
          </Col>
        </Space>
      </Row>
    </Space>
  );
};

export default UserView;
