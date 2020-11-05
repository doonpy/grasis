import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import favicon from '../assets/img/favicon.png';
import ResolutionNotCompatible from '../components/Common/ResolutionNotCompatible';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#f0f2f5" />
          <link rel="shortcut icon" href={favicon} />
        </Head>
        <body style={{ background: '#f0f2f5' }}>
          <Main />
          <NextScript />
          <div id="__resolutionNotCompatible">
            <ResolutionNotCompatible />
          </div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
