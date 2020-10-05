import React from 'react';

export const GENDER = {
  MALE: 0,
  FEMALE: 1
};
export const USER_STATUS = {
  IN_ACTIVE: 0,
  ACTIVE: 1
};
export const IS_ADMIN = {
  FALSE: 0,
  TRUE: 1
};

export function sortByUsername(a, b) {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

export function sortByLastname(a, b) {
  if (a.lastname < b.lastname) {
    return -1;
  }
  if (a.lastname > b.lastname) {
    return 1;
  }
  return 0;
}

export function sortByFirstname(a, b) {
  if (a.firstname < b.firstname) {
    return -1;
  }
  if (a.firstname > b.firstname) {
    return 1;
  }
  return 0;
}

export function sortByGender(a, b) {
  return a.gender - b.gender;
}

export function sortByStatus(a, b) {
  return a.status - b.status;
}
