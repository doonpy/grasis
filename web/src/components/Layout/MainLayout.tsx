import { LoadingOutlined } from '@ant-design/icons';
import { Layout, Result } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from '../../assets/css/components/layout/main-layout.module.css';
import { COMMON_PATH, MOBILE_RESPONSIVE } from '../../libs/common/common.resource';
import { CommonPageProps } from '../../libs/common/common.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import { IsAdmin } from '../../libs/user/user.resource';
import UserService from '../../libs/user/user.service';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import ResolutionNotCompatible from '../Common/ResolutionNotCompatible';
import Copyright from '../Copyright/Copyright';
import Header from '../Header/Header';
import Sider from '../Sider/Sider';

const MainLayout: React.FC<CommonPageProps> = (props) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const resizeHandler = () => {
    setScreenWidth(window.screen.width);
  };

  useEffect(() => {
    setScreenWidth(window.screen.width);
    window.removeEventListener('resize', resizeHandler);
    window.addEventListener('resize', resizeHandler);
  }, []);

  const userClient = UserService.getInstance();
  const data = userClient.useAuthorization();
  const router = useRouter();
  if (router.isFallback || !data) {
    return <Result icon={<LoadingOutlined />} title="Đang tải dữ liệu..." />;
  }

  const { isAdminCheck, allowUserTypes } = props;
  if (data) {
    LoginUser.getInstance().setUser(data.user);
    if (isAdminCheck) {
      if (!userClient.isAdminCheck(data.user.isAdmin as IsAdmin)) {
        userClient.redirectService.redirectTo(COMMON_PATH.ERROR.ERR_403);
        return <div />;
      }
    }

    if (allowUserTypes) {
      if (!userClient.isAllowUserType(allowUserTypes, data.user.userType)) {
        userClient.redirectService.redirectTo(COMMON_PATH.ERROR.ERR_403);
        return <div />;
      }
    }
  }

  return (
    <Layout>
      <Head>
        <title>{props.title} - Grasis</title>
      </Head>
      {screenWidth <= MOBILE_RESPONSIVE && !router.route.includes('mobile') ? (
        <ResolutionNotCompatible />
      ) : (
        <>
          <Sider
            selectedMenu={props.selectedMenu}
            isAdmin={data && (data.user.isAdmin as IsAdmin)}
            userType={data && data.user.userType}
          />
          <Layout className={styles.layout}>
            <Header screenWidth={screenWidth} />
            <Layout.Content className={styles.content}>
              {screenWidth > MOBILE_RESPONSIVE && (
                <Breadcrumb breadcrumbs={props.breadcrumbs || []} />
              )}
              <div>{props.children}</div>
            </Layout.Content>
            <Layout.Footer className={styles.footer}>
              <Copyright />
            </Layout.Footer>
          </Layout>
        </>
      )}
    </Layout>
  );
};

export default MainLayout;
