import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React from 'react';

import logo from '../../assets/img/hcmute-logo.png';
import { SidebarItem } from '../../resource/sidebar';
import { IS_ADMIN } from '../../resource/user';

const { Sider: AntSider } = Layout;
const styles = {
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
    fontWeight: '500',
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

function Sider({ isAdmin, userType, selectedMenu }) {
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
        {SidebarItem.map(({ key, icon, text, href, adminPermission, userTypes }) => {
          if (userTypes.indexOf(userType) === -1) {
            return;
          }

          if (adminPermission === IS_ADMIN.TRUE) {
            if (isAdmin === IS_ADMIN.TRUE) {
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
}

export default Sider;
