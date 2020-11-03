import moment from 'moment';

import { CommonColumns } from './common.interface';

export function sortByCreatedAt(a: CommonColumns, b: CommonColumns): number {
  if (moment(a.createdAt).isBefore(b.createdAt)) {
    return -1;
  }

  if (moment(b.createdAt).isBefore(a.createdAt)) {
    return 1;
  }

  return 0;
}

export function sortByUpdatedAt(a: CommonColumns, b: CommonColumns): number {
  if (moment(a.updatedAt).isBefore(b.updatedAt)) {
    return -1;
  }

  if (moment(b.updatedAt).isBefore(a.updatedAt)) {
    return 1;
  }

  return 0;
}