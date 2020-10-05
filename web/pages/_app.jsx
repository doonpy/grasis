import 'antd/dist/antd.css';
import 'nprogress/nprogress.css';

import { NoSsr } from '@material-ui/core';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { SWRConfig } from 'swr';

import RequestApi from '../services/api/request.api';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const MyApp = ({ Component, router, ...props }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const request = new RequestApi();

  return (
    <NoSsr>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{props.pageProps.title || ''}</title>
      </Head>
      <SWRConfig
        value={{
          fetcher: request.get.bind(request),
          refreshInterval: 5000
        }}>
        <Layout {...props.pageProps}>
          <Component {...props.pageProps} />
        </Layout>
      </SWRConfig>
    </NoSsr>
  );
};

export default MyApp;
