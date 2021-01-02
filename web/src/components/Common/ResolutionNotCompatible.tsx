import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { COMMON_PATH } from '../../libs/common/common.resource';
import LoginUser from '../../libs/user/instance/LoginUser';

const ResolutionNotCompatible = () => {
  const loginUser = LoginUser.getInstance();

  return (
    <Result
      status="error"
      title={CommonTerminology.COMMON_3}
      subTitle={CommonTerminology.COMMON_4}
      extra={
        loginUser.isLecturer() ? (
          <Link href={COMMON_PATH.MOBILE.RESULT}>
            <Button type="primary">{CommonTerminology.COMMON_13}</Button>
          </Link>
        ) : (
          <></>
        )
      }
    />
  );
};

export default ResolutionNotCompatible;
