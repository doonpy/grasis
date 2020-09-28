import '../styles/globals.css';

import { NoSsr } from '@material-ui/core';
import { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <NoSsr>
      {' '}
      <Component {...pageProps} />
    </NoSsr>
  );
}

export default MyApp;
