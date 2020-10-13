import 'antd/dist/antd.css';
import 'nprogress/nprogress.css';

import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { SWRConfig } from 'swr';

import CommonClient from '../libs/common/common.client';
import { CommonPageProps, NextPageWithLayout } from '../libs/common/common.interface';

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
  const commonClient = new CommonClient();
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <SWRConfig
      value={{
        refreshInterval: 1000,
        fetcher: commonClient.apiService.hooksFetcher.bind(commonClient.apiService),
        onError: commonClient.requestErrorHandler.bind(commonClient)
      }}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
};

export default MyApp;
