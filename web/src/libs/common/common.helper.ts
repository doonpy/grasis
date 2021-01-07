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

export function sortByString(a: string | null, b: string | null): number {
  if (!a || !b) {
    return 0;
  }

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export function sortByNumber(a: number | null, b: number | null): number {
  if (a !== null && b !== null) {
    return a - b;
  }

  return 0;
}

export function removeFilenamePrefix(filename: string): string {
  return filename.replace(/^\d*_/, '');
}
