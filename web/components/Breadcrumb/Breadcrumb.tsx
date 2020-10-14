import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb, Card } from 'antd';
import Link from 'next/link';
import React, { CSSProperties } from 'react';

import TextData from '../Common/TextData';

const styles: Record<string, CSSProperties> = {
  breadcrumb: {
    marginBottom: 30
  }
};

export interface BreadcrumbItemType {
  text: string;
  href?: string;
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItemType[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => {
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
            {key === breadcrumbs.length - 1 ? (
              <TextData text={text} />
            ) : (
              <Link href={href}>
                <a>{text}</a>
              </Link>
            )}
          </AntBreadcrumb.Item>
        ))}
      </AntBreadcrumb>
    </Card>
  );
};
