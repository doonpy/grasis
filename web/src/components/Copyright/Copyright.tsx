import { Typography } from 'antd';
import React from 'react';

import styles from '../../assets/css/components/copyright/copyright.module.css';

const Copyright: React.FC = () => (
  <Typography.Text className={styles.copyright}>
    {'Copyright © '}
    {/* eslint-disable-next-line react/jsx-no-target-blank */}
    <a href="https://github.com/doonpy" target={'_blank'}>
      Poon Nguyen
    </a>{' '}
    {new Date().getFullYear()}
    {' - HCMUTE'}
  </Typography.Text>
);

export default Copyright;
