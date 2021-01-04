import { Button, Result } from 'antd';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { COMMON_PATH } from '../../libs/common/common.resource';

const Error403: NextPage = () => {
  const router = useRouter();
  const { title, message } = router.query;

  return (
    <div>
      <Head>
        <title>Lỗi truy cập trang - Grasis</title>
      </Head>
      <Result
        status="403"
        title={title || '403'}
        subTitle={message || 'Xin lỗi, bạn không có quyền truy cập vào trang này.'}
        extra={
          <Link href={COMMON_PATH.INDEX}>
            <Button type="primary">{CommonTerminology.COMMON_15}</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Error403;
