import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import UserService from '../user/user.service';
import LecturerBase from './lecturer.base';
import {
  CreateLecturerResponse,
  FindManyLecturerResponse,
  FindOneLecturerResponse,
  LecturerForm,
  UseLecturer,
  UseLecturers
} from './lecturer.interface';
import { LECTURER_API_ADMIN_ROOT, LecturerApi } from './lecturer.resource';

export default class LecturerAdminService extends LecturerBase {
  private static instance: LecturerAdminService;

  constructor() {
    super();
  }

  public static getInstance(): LecturerAdminService {
    if (!this.instance) {
      this.instance = new LecturerAdminService();
    }

    return this.instance;
  }

  public async createLecturer({
    lecturer,
    user
  }: LecturerForm): Promise<AxiosResponse<CreateLecturerResponse>> {
    await this.apiService.bindAuthorizationForClient();
    if (lecturer.level && Array.isArray(lecturer.level)) {
      lecturer.level = this.convertLevelToString(lecturer.level);
    }

    return this.apiService.post<CreateLecturerResponse>(LECTURER_API_ADMIN_ROOT, {
      lecturer,
      user: UserService.getInstance().convertToRequestBody(user)
    });
  }

  public async deleteLecturer(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(LecturerApi.ADMIN_SPECIFY, [id]);
  }

  public async getInitialForEdit(id: number): Promise<LecturerForm> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<FindOneLecturerResponse>(LecturerApi.ADMIN_SPECIFY, [
      id
    ]);
    if (data) {
      return this.convertToFormValue(data.lecturer);
    }
  }

  public async updateById(id: number, { lecturer, user }: LecturerForm): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    if (lecturer.level && Array.isArray(lecturer.level)) {
      lecturer.level = this.convertLevelToString(lecturer.level);
    }

    await this.apiService.patch(
      LecturerApi.ADMIN_SPECIFY,
      {
        lecturer,
        user: UserService.getInstance().convertToRequestBody(user)
      },
      [id]
    );
  }

  public useLecturers(pageNumber = 0, pageSize: number = DEFAULT_PAGE_SIZE): UseLecturers {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<FindManyLecturerResponse>(
      `${LECTURER_API_ADMIN_ROOT}?offset=${offset}`
    );
    if (data) {
      data.lecturers = data.lecturers.map((lecturer, index) => {
        const user = lecturer.user;

        return { ...lecturer, ...user, key: index };
      });
    }

    return { data, isLoading: !data };
  }

  public useLecturer(id: number): UseLecturer {
    const { data } = useSWR<FindOneLecturerResponse>(id && `${LECTURER_API_ADMIN_ROOT}/${id}`);
    if (data && data.lecturer.level && typeof data.lecturer.level === 'string') {
      data.lecturer.level = data.lecturer.level.split(';');
    }

    return { data, isLoading: !data };
  }
}
