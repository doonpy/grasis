import React from 'react';

const styles = {
  copyright: {
    width: '100%',
    textAlign: 'center'
  }
};

const Copyright = () => (
  <div style={styles.copyright}>
    {'Copyright © '}
    {/* eslint-disable-next-line react/jsx-no-target-blank */}
    <a href="https://github.com/doonpy" target={'_blank'}>
      Poon Nguyen
    </a>{' '}
    {new Date().getFullYear()}
    {' - HCMUTE'}
  </div>
);

export default Copyright;
