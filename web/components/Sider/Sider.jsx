import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React from 'react';

import logo from '../../assets/img/hcmute-logo.png';

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

function Sider({ isAdmin, selectedMenu }) {
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
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link href={'/graduation-thesis'}>
            <a>Khóa luận</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link href={'/topic'}>
            <a>Đề tài</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          <Link href={'/register-topic'}>
            <a>Đăng ký đề tài</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<BarChartOutlined />}>
          <Link href={'/progress-report'}>
            <a>Báo cáo tiến độ</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<CloudOutlined />}>
          <Link href={'/review'}>
            <a>Phản biện</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<AppstoreOutlined />}>
          <Link href={'/defense'}>
            <a>Bảo vệ</a>
          </Link>
        </Menu.Item>
        {isAdmin && (
          <Menu.Item key="7" icon={<AppstoreOutlined />}>
            <Link href={'/admin/lecturer'}>
              <a>Giảng viên</a>
            </Link>
          </Menu.Item>
        )}
        {isAdmin && (
          <Menu.Item key="8" icon={<AppstoreOutlined />}>
            <Link href={'/admin/student'}>
              <a>Sinh viên</a>
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </AntSider>
  );
}

export default Sider;
