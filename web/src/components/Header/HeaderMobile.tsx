import { Image, Layout, Row, Space, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

import styles from '../../assets/css/components/sider/sider.module.css';
import logo from '../../assets/img/hcmute-logo.png';
// import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

const { Header: AntHeader } = Layout;

interface ComponentProps {
  screenWidth: number;
}

const Header: React.FC<ComponentProps> = ({ screenWidth }) => {
  return (
    <AntHeader style={{ padding: 0 }}>
      <Space>
        <Link href={'/'}>
          <a>
            <Space>
              <Image src={logo} alt="logo" width={25} style={{ margin: '0px 0px 0px 5px' }} />
              <Typography.Text className={styles.logoTextMobile}>GRASIS</Typography.Text>
            </Space>
          </a>
        </Link>
        <Row justify="end" align="middle">
          <Space>
            {/*<NotificationMenu />*/}
            <UserMenu screenWidth={screenWidth} />
          </Space>
        </Row>
      </Space>
    </AntHeader>
  );
};

export default Header;
