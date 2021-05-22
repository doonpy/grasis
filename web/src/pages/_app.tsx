import '../assets/css/styles.css';

import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import Router from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
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
  pageProps
}: {
  Component: NextPageWithLayout;
  pageProps: CommonPageProps;
}) => {
  const commonClient = new CommonService();
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  useEffect(() => {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.innerHTML = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="uSGbPD3FCpHigXhiKK8SwUNelJydzAtI";analytics.SNIPPET_VERSION="4.13.2";
  analytics.load("uSGbPD3FCpHigXhiKK8SwUNelJydzAtI");
  analytics.page();
  }}();`;
    document.head.append(s);
  }, []);

  return (
    <SWRConfig
      value={{
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
