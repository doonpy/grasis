import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import CommonClient from '../common/common.client';
import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import {
  CreateLecturerResponse,
  FindAllLecturerResponse,
  FindOneLecturerResponse,
  LecturerRequestBody,
  UseLecturer,
  UseLecturers
} from './lecturer.interface';
import { LECTURER_API } from './lecturer.resource';

export default class LecturerClient extends CommonClient {
  private static instance: LecturerClient;

  constructor() {
    super();
  }

  public static getInstance(): LecturerClient {
    if (!this.instance) {
      this.instance = new LecturerClient();
    }

    return this.instance;
  }

  public async updateById(id: number, body: LecturerRequestBody): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    if (body.level && Array.isArray(body.level)) {
      body.level = this.convertLevelToString(body.level);
    }
    await this.apiService.patch(`${LECTURER_API.ROOT}/${id}`, body);
  }

  public async deleteLecturer(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(`${LECTURER_API.ROOT}/${id}`);
  }

  public useLecturer(id: number): UseLecturer {
    const { data } = useSWR<FindOneLecturerResponse>(id && `${LECTURER_API.ROOT}/${id}`);
    if (data && data.lecturer.level && typeof data.lecturer.level === 'string') {
      data.lecturer.level = data.lecturer.level.split(';');
    }

    return { data, isLoading: !data };
  }

  public useLecturers(pageNumber = 0, pageSize: number = DEFAULT_PAGE_SIZE): UseLecturers {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<FindAllLecturerResponse>(`${LECTURER_API.ROOT}?offset=${offset}`);
    if (data) {
      data.lecturers = data.lecturers.map((item, index) => ({ ...item, key: index }));
    }

    return { data, isLoading: !data };
  }

  public async createLecturer(
    body: LecturerRequestBody
  ): Promise<AxiosResponse<CreateLecturerResponse>> {
    await this.apiService.bindAuthorizationForClient();
    if (body.level && Array.isArray(body.level)) {
      body.level = this.convertLevelToString(body.level);
    }

    return this.apiService.post<CreateLecturerResponse>(LECTURER_API.ROOT, body);
  }

  private convertLevelToString(levels?: string[]): string | null {
    if (!levels) {
      return null;
    }

    return levels.filter((level, index) => levels.lastIndexOf(level) === index).join(';');
  }
}
