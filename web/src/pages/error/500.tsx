import { Button, Result } from 'antd';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { COMMON_PATH } from '../../libs/common/common.resource';

const Error500: NextPage = () => {
  const router = useRouter();
  const { title, message } = router.query;

  return (
    <div>
      <Head>
        <title>Lỗi - Grasis</title>
      </Head>
      <Result
        status="500"
        title={title}
        subTitle={message}
        extra={
          <Link href={COMMON_PATH.INDEX}>
            <Button type="primary">{CommonTerminology.COMMON_15}</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Error500;
