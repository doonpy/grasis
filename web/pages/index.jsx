import React from 'react';

import withAuth from '../HOC/withAuth';
import Admin from '../layouts/Admin';

function Index() {
  return <div>Index neè</div>;
}

Index.layout = Admin;

Index.getInitialProps = async () => {
  return {
    title: 'Trang chủ',
    breadCrumb: [{ name: 'Trang chủ', path: '/' }]
  };
};

export default withAuth(Index);
