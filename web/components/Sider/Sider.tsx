import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { CSSProperties } from 'react';

import logo from '../../assets/img/hcmute-logo.png';
import { IsAdmin, UserType } from '../../libs/user/user.resource';
import { SIDER_ITEMS } from './SiderItems';

const { Sider: AntSider } = Layout;
const styles: Record<string, CSSProperties> = {
  sidebar: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0
  },
  logo: {
    position: 'relative',
    padding: '15px 0px 15px 0px'
  },
  logoLink: {
    textTransform: 'uppercase',
    padding: '5px 0',
    display: 'block',
    fontSize: '35px',
    color: 'white',
    textAlign: 'left',
    fontWeight: 500,
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent'
  },
  logoImage: {
    width: '40px',
    display: 'inline-block',
    maxHeight: '40px',
    marginLeft: '10px',
    marginRight: '15px'
  },
  img: {
    width: '40px',
    top: '10px',
    position: 'absolute',
    verticalAlign: 'middle',
    border: '0'
  }
};

interface SiderProps {
  isAdmin: IsAdmin;
  userType: UserType;
  selectedMenu: string;
}

const Sider: React.FC<SiderProps> = ({ isAdmin, userType, selectedMenu }) => {
  return (
    <AntSider style={styles.sidebar}>
      <div className="logo" />
      <div style={styles.logo}>
        <Link href={'/'}>
          <div style={styles.logoLink}>
            <div style={styles.logoImage}>
              <img src={logo} alt="logo" style={styles.img} />
            </div>
            GRASIS
          </div>
        </Link>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedMenu]}>
        {SIDER_ITEMS.map(({ key, icon, text, href, adminPermission, userTypes }) => {
          if (userTypes.indexOf(userType) === -1) {
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
