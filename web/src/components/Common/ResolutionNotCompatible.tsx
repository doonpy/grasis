import { Button, Result } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { COMMON_PATH, MOBILE_RESPONSIVE } from '../../libs/common/common.resource';
import LoginUser from '../../libs/user/instance/LoginUser';

interface ComponentProps {
  screenWidth: number;
}

const ResolutionNotCompatible: React.FC<ComponentProps> = ({ screenWidth, children }) => {
  const loginUser = LoginUser.getInstance();
  const router = useRouter();

  if (screenWidth <= MOBILE_RESPONSIVE && !router.asPath.includes('mobile')) {
    return (
      <Result
        status="error"
        title={CommonTerminology.COMMON_3}
        subTitle={CommonTerminology.COMMON_4}
        extra={
          loginUser.isLecturer() ? (
            <Link href={COMMON_PATH.MOBILE.RESULT}>
              <Button type="link">{CommonTerminology.COMMON_13}</Button>
            </Link>
          ) : (
            <></>
          )
        }
      />
    );
  }

  if (screenWidth > MOBILE_RESPONSIVE && router.asPath.includes('mobile')) {
    return (
      <Result
        status="error"
        title={CommonTerminology.COMMON_3}
        subTitle={CommonTerminology.COMMON_14}
        extra={
          loginUser.isLecturer() ? (
            <Link href={COMMON_PATH.INDEX}>
              <Button type="primary">{CommonTerminology.COMMON_15}</Button>
            </Link>
          ) : (
            <></>
          )
        }
      />
    );
  }

  return <>{children}</>;
};

export default ResolutionNotCompatible;
