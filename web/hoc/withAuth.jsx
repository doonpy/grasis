import React from 'react';

import { JwtService } from '../module/auth/jwt.service';
import { redirectToLogin } from '../module/auth/redirect.service';

function withAuth(WrappedComponent) {
  const Wrapper = (props) => {
    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const auth = JwtService.fromNext(ctx);
    let authProps = {};
    if (ctx.pathname.indexOf('/login') === -1) {
      if (auth.isExpired() || !auth.isActive()) {
        await redirectToLogin(ctx.res);
        return {};
      } else {
        authProps = {
          isAdmin: auth.decodedToken.user.isAdmin,
          userType: auth.decodedToken.user.userType
        };
      }
    }

    const pageProps = WrappedComponent.getInitialProps
      ? await WrappedComponent.getInitialProps({ ...ctx, ...authProps })
      : {};

    return { ...authProps, ...pageProps };
  };

  Wrapper.layout = WrappedComponent.layout;

  return Wrapper;
}

export default withAuth;
