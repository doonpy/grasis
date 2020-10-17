import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import {
  CreateLecturerResponse,
  FindAllLecturerResponse,
  FindOneLecturerResponse,
  LecturerViewType,
  StudentRequestBody,
  UseLecturer,
  UseLecturers
} from './lecturer.interface';
import { LECTURER_API } from './lecturer.resource';

export default class LecturerService extends CommonService {
  private static instance: LecturerService;

  constructor() {
    super();
  }

  public static getInstance(): LecturerService {
    if (!this.instance) {
      this.instance = new LecturerService();
    }

    return this.instance;
  }

  public async updateById(id: number, body: StudentRequestBody): Promise<void> {
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
    body: StudentRequestBody
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

  public async getInitialForEdit(id): Promise<LecturerViewType> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<FindOneLecturerResponse>(
      `${LECTURER_API.ROOT}/${id}`
    );
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
}
