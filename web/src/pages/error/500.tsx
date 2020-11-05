import { Button, Result } from 'antd';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

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
          <Link href={'/'}>
            <Button type="primary">Quay lại trang chủ</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Error500;
