import { Button, Result } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

function Error500() {
  const router = useRouter();
  const { title, message } = router.query;

  return (
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
  );
}

export default Error500;
