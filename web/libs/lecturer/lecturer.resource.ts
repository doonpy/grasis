import { INITIAL_USER } from '../user/user.resource';
import { LecturerViewType } from './lecturer.interface';

export const LECTURER_ADMIN_PATH_ROOT = '/admin/lecturer';
export const LECTURER_PATH = {
  CREATE: `${LECTURER_ADMIN_PATH_ROOT}/create`
};

export const LECTURER_API = {
  ROOT: '/lecturers',
  ADMIN: '/admin/lecturers'
};

export const INITIAL_LECTURER: LecturerViewType = {
  ...INITIAL_USER,
  lecturerId: null,
  level: [],
  position: null,
  createdAt: null,
  updatedAt: null
};

export const LECTURER_LEVELS = ['Tiến sĩ', 'Thạc sĩ', 'Phó giáo sư', 'Giáo sư'];
