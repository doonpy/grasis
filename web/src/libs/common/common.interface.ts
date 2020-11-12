import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { BreadcrumbItemType } from '../../components/Breadcrumb/Breadcrumb';
import { IsAdmin, UserType } from '../user/user.resource';

export interface CommonPageProps {
  title?: string;
  selectedMenu?: string;
  breadcrumbs?: BreadcrumbItemType[];
  isAdmin?: IsAdmin;
  isAdminCheck?: boolean;
  allowUserTypes?: UserType[];
}

export interface CommonResponse {
  statusCode: number;
}

export interface CommonColumns {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Layout<P> {
  Layout?: React.FC<P>;
}

export type NextPageWithLayout<
  P extends CommonPageProps = CommonPageProps,
  LP extends CommonPageProps = CommonPageProps,
  Q extends ParsedUrlQuery = Record<string, any>
> = NextPage<P, Q> & Layout<LP>;

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  ctime: Date;
  mtime: Date;
}
