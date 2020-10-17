import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import favicon from '../assets/img/favicon.png';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href={favicon} />
        </Head>
        <body style={{ background: '#f0f2f5' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
