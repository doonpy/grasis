import { Result } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';

const ResolutionNotCompatible = () => {
  return (
    <Result
      status="error"
      title={CommonTerminology.COMMON_3}
      subTitle={CommonTerminology.COMMON_4}
    />
  );
};

export default ResolutionNotCompatible;
