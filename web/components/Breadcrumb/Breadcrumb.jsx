import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb, Card } from 'antd';
import Link from 'next/link';
import React from 'react';

const styles = {
  breadcrumb: {
    marginBottom: 30
  }
};

function Breadcrumb({ breadcrumbs }) {
  return (
    <Card style={styles.breadcrumb}>
      <AntBreadcrumb>
        <AntBreadcrumb.Item>
          <Link href="/">
            <a>
              <HomeOutlined />
            </a>
          </Link>
        </AntBreadcrumb.Item>
        {breadcrumbs.map(({ text, href }, key) => (
          <AntBreadcrumb.Item key={key}>
            <Link href={href}>
              <a>{text}</a>
            </Link>
          </AntBreadcrumb.Item>
        ))}
      </AntBreadcrumb>
    </Card>
  );
}

export default Breadcrumb;
