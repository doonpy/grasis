import 'antd/dist/antd.css';
import 'nprogress/nprogress.css';

import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { SWRConfig } from 'swr';

import ApiRequest from '../module/api/api.request';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const MyApp = ({ Component, ...props }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const request = new ApiRequest();

  return (
    <SWRConfig
      value={{
        fetcher: request.get.bind(request),
        refreshInterval: 5000
      }}>
      <Layout {...props.pageProps}>
        <Component {...props.pageProps} />
      </Layout>
    </SWRConfig>
  );
};

export default MyApp;
