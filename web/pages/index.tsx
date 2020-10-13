import React from 'react';

import CommonRedirect, { RenderSide } from '../libs/common/common.redirect';

class Index extends React.Component {
  async componentDidMount() {
    const commonRedirect = new CommonRedirect(RenderSide.CLIENT);
    await commonRedirect.redirectTo('/graduation-thesis');
  }

  render() {
    return <div />;
  }
}

export default Index;
