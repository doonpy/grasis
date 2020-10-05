import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Layout, Menu, Row } from 'antd';
import React from 'react';

import { logout } from '../../services/auth/auth.service';

const { Header: AntHeader } = Layout;
const styles = {
  header: { position: 'fixed', zIndex: 1, width: '100%' },
  button: {
    marginLeft: '20px'
  }
};

function Header() {
  const handleLogout = async () => {
    await logout();
  };
  const userMenu = (
    <Menu theme="light" mode="inline">
      <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  const notificationMenu = (
    <Menu theme="light" mode="inline">
      <Menu.Item key="1">Thông báo 1</Menu.Item>
      <Menu.Item key="2">Thông báo 2</Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="site-layout-background">
      <Row justify="end" align="middle">
        <Col style={{ position: 'relative' }}>
          <Dropdown overlay={notificationMenu} placement="bottomCenter" trigger={['click']}>
            <Button type="primary" shape="circle" icon={<BellOutlined />} style={styles.button} />
          </Dropdown>
          <Dropdown overlay={userMenu} placement="bottomCenter" trigger={['click']}>
            <Button type="primary" shape="circle" icon={<UserOutlined />} style={styles.button} />
          </Dropdown>
        </Col>
      </Row>
    </AntHeader>
  );
}

export default Header;
