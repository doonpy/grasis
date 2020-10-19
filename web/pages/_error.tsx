import { Button, Result } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const Error404: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Trang không tồn tại - Grasis</title>
      </Head>
      <Result
        status="404"
        title="404"
        subTitle="Trang không tồn tại."
        extra={
          <Link href={'/'}>
            <Button type="primary">Quay lại trang chủ</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Error404;
