import { NextComponentType, NextPageContext } from 'next';
import React, { Component } from 'react';

import { JwtService } from '../services/auth/jwt.service';
import { redirectToLogin } from '../services/redirect.service';

export type AuthProps = {
  token: string;
};

export default function PrivateRoute(WrappedComponent: NextComponentType<{ auth: JwtService }>) {
  return class HOC extends Component<AuthProps> {
    state = {
      auth: new JwtService(this.props.token)
    };

    static async getInitialProps(ctx: NextPageContext) {
      const auth = JwtService.fromNext(ctx);
      const initialProps = { auth };

      if (auth.isExpired()) {
        await redirectToLogin(ctx.res);
      }

      if (WrappedComponent.getInitialProps) {
        const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
        return { ...wrappedProps, auth };
      }

      return initialProps;
    }

    componentDidMount(): void {
      this.setState({ auth: new JwtService(this.props.token) });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
