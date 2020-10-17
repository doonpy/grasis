import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Menu } from 'antd';
import React from 'react';

const NotificationMenuItem = () => {
  return (
    <Menu theme="light">
      <Menu.Item key="1">Thông báo 1</Menu.Item>
      <Menu.Item key="2">Thông báo 2</Menu.Item>
    </Menu>
  );
};

const NotificationMenu = () => {
  return (
    <Dropdown
      overlay={() => <NotificationMenuItem />}
      placement="bottomRight"
      trigger={['click']}
      arrow>
      <Badge count={2} offset={[-4, 4]} size="small" overflowCount={99}>
        <Button size="large" type="primary" shape="circle" icon={<BellOutlined />} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationMenu;
