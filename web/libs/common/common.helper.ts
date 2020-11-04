import { Moment } from 'moment';

export function sortByDate(a: Moment, b: Moment): number {
  if (a.isBefore(b)) {
    return -1;
  }

  if (b.isBefore(a)) {
    return 1;
  }

  return 0;
}

export function sortByString(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export function sortByNumber(a: number, b: number): number {
  if (a !== null && b !== null) {
    return a - b;
  }

  return 0;
}
