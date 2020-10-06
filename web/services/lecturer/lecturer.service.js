import { LECTURE_PROPERTIES } from '../../resource/lecturer';
import RequestApi from '../api/request.api';
import { JwtService } from '../auth/jwt.service';
import { redirectTo } from '../auth/redirect.service';

export const DEFAULT_PAGE_SIZE = 20;

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

export function formatLecturerForGetOne({
  lecturerId,
  position,
  level,
  createdAt,
  updatedAt,
  id: { id, firstname, lastname, status, gender, username, email, address, phone, isAdmin }
}) {
  return {
    id,
    username,
    lastname,
    firstname,
    gender,
    lecturerId,
    position,
    status,
    level,
    isAdmin,
    email,
    address,
    phone,
    createdAt: new Date(createdAt).toLocaleString(),
    updatedAt: new Date(updatedAt).toLocaleString()
  };
}

export async function updateLecturer(id, user, lecturer) {
  const request = new RequestApi();

  return await request.patch(`/lecturers/${id}`, { user, lecturer });
}

export function formatLecturerForPost(values) {
  const lecturer = {};
  LECTURE_PROPERTIES.forEach((prop) => {
    if (typeof values[prop] !== 'undefined' && values[prop] !== '' && values[prop] !== null) {
      if (prop === 'level') {
        lecturer[prop] = formatLevelForPost(values[prop]);
        return;
      }

      lecturer[prop] = values[prop];
    }
  });

  return lecturer;
}

export async function getLecturerForView(id, token) {
  const request = new RequestApi(token);

  return await request.get(`/lecturers/${id}`);
}

export async function getInitialLecturer(id, req, res) {
  const auth = JwtService.fromNext(req);
  const data = await getLecturerForView(id, auth.token);
  let lecturer = {};
  let user = {};
  if (data.message) {
    await redirectTo(
      `/error/500?title=${encodeURI('Lỗi!')}&message=${encodeURI(data.message)}`,
      res
    );
    return;
  }

  lecturer = data.lecturer;
  lecturer.level = formatLevelForView(lecturer.level);
  user = lecturer.id;
  delete user.password;

  return { initLecturer: lecturer, initUser: user };
}

export function formatLevelForPost(level) {
  if (level) {
    return level.join(';');
  }
}

export function formatLevelForView(level) {
  if (level) {
    return level.split(';');
  }
}
