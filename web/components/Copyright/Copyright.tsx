import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const Copyright: React.FunctionComponent = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://github.com/doonpy" target={'_blank'}>
      Poon Nguyen
    </Link>{' '}
    {new Date().getFullYear()}
    {' - HCMUTE'}
  </Typography>
);

export default Copyright;
