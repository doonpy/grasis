import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';

function Error500() {
  return (
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
  );
}

export default Error500;
