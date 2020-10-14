import React, { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  copyright: {
    width: '100%',
    textAlign: 'center'
  }
};

const Copyright: React.FC = () => (
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
