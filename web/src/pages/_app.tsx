import '../assets/css/styles.css';

import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import Router from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect, useState } from 'react';
import { SWRConfig } from 'swr';

import CommonService from '../libs/common/common.service';
import { CommonPageProps, NextPageWithLayout } from '../libs/common/common.type';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});

const MyApp = ({
  Component,
  pageProps: initPageProps
}: {
  Component: NextPageWithLayout;
  pageProps: CommonPageProps;
}) => {
  const commonClient = new CommonService();
  const Layout = Component.Layout ? Component.Layout : React.Fragment;
  const [componentProps, setComponentProps] = useState(initPageProps);
  const [pageProps, setPageProps] = useState(initPageProps);
  const resizeHandler = () => {
    setComponentProps({ ...componentProps, screenWidth: window.screen.width });
    if (Component.Layout) {
      setPageProps({ ...pageProps, screenWidth: window.screen.width });
    }
  };

  useEffect(() => {
    setComponentProps({ ...componentProps, screenWidth: window.screen.width });
    if (Component.Layout) {
      setPageProps({ ...pageProps, screenWidth: window.screen.width });
    }

    window.removeEventListener('resize', resizeHandler);
    window.addEventListener('resize', resizeHandler);
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: commonClient.apiService.hooksFetcher.bind(commonClient.apiService),
        onError: commonClient.requestErrorHandler.bind(commonClient)
      }}>
      <ConfigProvider locale={locale}>
        <Layout {...pageProps}>
          <Component {...componentProps} />
        </Layout>
      </ConfigProvider>
    </SWRConfig>
  );
};

export default MyApp;
