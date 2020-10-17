import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import UserService from '../user/user.service';
import {
  FindAllLecturerResponse,
  FindOneLecturerResponse,
  LecturerViewType,
  StudentRequestBody,
  UseLecturer,
  UseLecturers
} from './lecturer.interface';
import { LECTURER_API } from './lecturer.resource';

export default class LecturerBase extends CommonService {
  constructor() {
    super();
  }

  public useLecturers(
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    isAdmin?: boolean
  ): UseLecturers {
    const endPoint = isAdmin ? LECTURER_API.ADMIN : LECTURER_API.ROOT;
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<FindAllLecturerResponse>(`${endPoint}?offset=${offset}`);
    if (data) {
      data.lecturers = data.lecturers.map((item, index) => ({ ...item, key: index }));
    }

    return { data, isLoading: !data };
  }

  public useLecturer(id: number, isAdmin?: boolean): UseLecturer {
    const endPoint = isAdmin ? LECTURER_API.ADMIN : LECTURER_API.ROOT;
    const { data } = useSWR<FindOneLecturerResponse>(id && `${endPoint}/${id}`);
    if (data && data.lecturer.level && typeof data.lecturer.level === 'string') {
      data.lecturer.level = data.lecturer.level.split(';');
    }

    return { data, isLoading: !data };
  }

  protected convertLevelToString(levels?: string[]): string | null {
    if (!levels) {
      return null;
    }

    return levels.filter((level, index) => levels.lastIndexOf(level) === index).join(';');
  }

  public async getInitialForEdit(id: number, isAdmin: boolean): Promise<LecturerViewType> {
    await this.apiService.bindAuthorizationForClient();
    const endPoint = isAdmin ? LECTURER_API.ADMIN : LECTURER_API.ROOT;
    const { data } = await this.apiService.get<FindOneLecturerResponse>(`${endPoint}/${id}`);
    if (data && data.lecturer.level && typeof data.lecturer.level === 'string') {
      const levels = data.lecturer.level.split(';');
      data.lecturer.level = levels.filter(
        (level, index) => levels.lastIndexOf(level) === index && level !== ''
      );
    } else {
      data.lecturer.level = [];
    }

    return data.lecturer;
  }

  public async updateById(id: number, body: StudentRequestBody, isAdmin?: boolean): Promise<void> {
    const endPoint = isAdmin ? LECTURER_API.ADMIN : LECTURER_API.ROOT;
    await this.apiService.bindAuthorizationForClient();
    const userService = UserService.getInstance();
    if (body.level && Array.isArray(body.level)) {
      body.level = this.convertLevelToString(body.level);
    }
    await this.apiService.patch(`${endPoint}/${id}`, userService.convertToRequestBody(body));
  }
}
