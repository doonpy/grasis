import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';

function Error403() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
      extra={
        <Link href={'/'}>
          <Button type="primary">Quay lại trang chủ</Button>
        </Link>
      }
    />
  );
}

export default Error403;
