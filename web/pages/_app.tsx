import '../assets/css/styles.css';

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
        // refreshInterval: 1000,
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
