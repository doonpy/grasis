import '../assets/css/nextjs-material-dashboard.css?v=1.0.0';

import { NoSsr } from '@material-ui/core';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';

import PageChange from '../components/PageChange/PageChange.js';
import Request from '../services/api/Request';

Router.events.on('routeChangeStart', (url) => {
  document.body.classList.add('body-page-transition');
  ReactDOM.render(<PageChange path={url} />, document.getElementById('page-transition'));
});
Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => <>{children}</>);
    const request = new Request();

    return (
      <React.Fragment>
        <NoSsr>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>{pageProps.title || 'Grasis'}</title>
          </Head>
          <SWRConfig
            value={{
              fetcher: request.get.bind(request),
              refreshInterval: 5000,
              suspense: true
            }}>
            <Layout {...pageProps}>
              <Suspense fallback={'Đang tải dữ liệu...!'}>
                <Component {...pageProps} />
              </Suspense>
            </Layout>
          </SWRConfig>
        </NoSsr>
      </React.Fragment>
    );
  }
}
