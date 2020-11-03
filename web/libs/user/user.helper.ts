import { User } from './user.interface';

export function sortByUsername(a: User, b: User): number {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

export function sortByLastname(a: User, b: User): number {
  if (a.lastname < b.lastname) {
    return -1;
  }
  if (a.lastname > b.lastname) {
    return 1;
  }
  return 0;
}

export function sortByFirstname(a: User, b: User): number {
  if (a.firstname < b.firstname) {
    return -1;
  }
  if (a.firstname > b.firstname) {
    return 1;
  }
  return 0;
}

export function sortByGender(a: User, b: User): number {
  if (a.gender !== null && b.gender !== null) {
    return a.gender - b.gender;
  }

  return 0;
}

export function sortByStatus(a: User, b: User): number {
  if (
    a.status !== null &&
    typeof a.status !== 'boolean' &&
    b.status !== null &&
    typeof b.status !== 'boolean'
  ) {
    return a.status - b.status;
  }

  return 0;
}
