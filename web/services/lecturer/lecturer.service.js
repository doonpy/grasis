import React from 'react';

import RequestApi from '../api/request.api';

export const LECTURER_LIMIT = 20;

export function getInitialLecturerState() {
  return {
    createdAt: '',
    id: NaN,
    lecturerId: '',
    level: '',
    position: { title: '' },
    updatedAt: '',
    userDetail: {
      address: '',
      email: '',
      firstname: '',
      gender: '',
      id: NaN,
      isAdmin: NaN,
      lastname: NaN,
      phone: '',
      status: NaN,
      userType: NaN,
      username: ''
    }
  };
}

export function formatLecturerForGetMany(lecturers) {
  return lecturers.map(
    ({ lecturerId, position, id: { id, firstname, lastname, status, gender, username } }, key) => ({
      key: (key + 1).toString(),
      id,
      username,
      lastname,
      firstname,
      gender,
      lecturerId,
      position,
      status
    })
  );
}

export function deleteLecturer(id) {
  const request = new RequestApi();

  return request.delete(`/lecturers/${id}`);
}

export function sortByLecturerId(a, b) {
  if (a.lecturerId < b.lecturerId) {
    return -1;
  }
  if (a.lecturerId > b.lecturerId) {
    return 1;
  }
  return 0;
}

export function sortByPosition(a, b) {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
}

export async function createLecturer(user, lecturer) {
  const request = new RequestApi();
  return await request.post('/lecturers', { user, lecturer });
}
