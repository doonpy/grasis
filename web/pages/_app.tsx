import '../assets/css/styles.css';

import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { SWRConfig } from 'swr';

import { CommonPageProps, NextPageWithLayout } from '../libs/common/common.interface';
import CommonService from '../libs/common/common.service';

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
  pageProps
}: {
  Component: NextPageWithLayout;
  pageProps: CommonPageProps;
}) => {
  const commonClient = new CommonService();
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: commonClient.apiService.hooksFetcher.bind(commonClient.apiService),
        onError: commonClient.requestErrorHandler.bind(commonClient)
      }}>
      <ConfigProvider locale={locale}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </SWRConfig>
  );
};

export default MyApp;
