import React, { useEffect } from 'react';

import { COMMON_PATH } from '../libs/common/common.resource';
import CommonService from '../libs/common/common.service';

const Index: React.FC = () => {
  const commonService = new CommonService();
  useEffect(() => {
    (async () => {
      if (!Number.isNaN(commonService.jwtService.accessTokenPayload.userId)) {
        await commonService.redirectService.redirectTo('/graduation-thesis');
      } else {
        await commonService.redirectService.redirectTo(COMMON_PATH.LOGIN);
      }
    })();
  });
  return <div />;
};

export default Index;
