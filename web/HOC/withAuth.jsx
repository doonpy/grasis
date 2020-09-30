import React from 'react';

import { JwtService } from '../services/jwt.service';
import { redirectToIndex, redirectToLogin } from '../services/redirect.service';

function withAuth(WrappedComponent) {
  const Wrapper = (props) => {
    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const auth = JwtService.fromNext(ctx);
    const initialProps = { auth };

    if (ctx.req && ctx.req.path === '/login') {
      await redirectToIndex(ctx.res);
    }

    if (auth.isExpired()) {
      await redirectToLogin(ctx.req.path, ctx.res);
    }

    if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
      return { ...wrappedProps, auth };
    }

    return { initialProps };
  };

  Wrapper.layout = WrappedComponent.layout;

  return Wrapper;
}

export default withAuth;
