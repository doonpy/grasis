import { Image, Layout, Menu, Space, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

import styles from '../../assets/css/components/sider/sider.module.css';
import logo from '../../assets/img/hcmute-logo.png';
import { IsAdmin, UserType } from '../../libs/user/user.resource';
import { SIDER_ITEMS } from './SiderItems';
const { Sider: AntSider } = Layout;

interface SiderProps {
  isAdmin: IsAdmin;
  userType: UserType;
  selectedMenu?: string;
}

const Sider: React.FC<SiderProps> = ({ isAdmin, userType, selectedMenu }) => {
  return (
    <AntSider className={styles.sidebar} breakpoint="lg" collapsedWidth="0">
      <Layout.Header className={styles.logo}>
        <Link href={'/'}>
          <a>
            <Space>
              <Image src={logo} alt="logo" width={40} />
              <Typography.Text className={styles.logoText}>GRASIS</Typography.Text>
            </Space>
          </a>
        </Link>
      </Layout.Header>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedMenu || '']}>
        {SIDER_ITEMS.map(({ key, icon, text, href, adminPermission, allowUserTypes }) => {
          if (allowUserTypes.indexOf(userType) === -1) {
            return;
          }

          if (adminPermission === IsAdmin.TRUE) {
            if (isAdmin === IsAdmin.TRUE) {
              return (
                <Menu.Item key={key} icon={icon}>
                  <Link href={href}>
                    <a>{text}</a>
                  </Link>
                </Menu.Item>
              );
            } else {
              return;
            }
          }

          return (
            <Menu.Item key={key} icon={icon}>
              <Link href={href}>
                <a>{text}</a>
              </Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </AntSider>
  );
};

export default Sider;
