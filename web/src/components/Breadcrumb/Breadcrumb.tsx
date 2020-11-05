import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';

import styles from '../../assets/css/components/breadcrumb/breadcrumb.module.css';
import TextData from '../Common/TextData';

export interface BreadcrumbItemType {
  text: string;
  href?: string;
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItemType[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => {
  return (
    <AntBreadcrumb className={styles.breadcrumb}>
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
            <Link href={href || '#'}>
              <a>{text}</a>
            </Link>
          )}
        </AntBreadcrumb.Item>
      ))}
    </AntBreadcrumb>
  );
};
