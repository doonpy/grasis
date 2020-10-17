import { AxiosResponse } from 'axios';

import UserService from '../../user/user.service';
import LecturerBase from '../lecturer.base';
import { CreateLecturerResponse, StudentRequestBody } from '../lecturer.interface';
import { LECTURER_API } from '../lecturer.resource';

export default class AdminLecturerService extends LecturerBase {
  private static instance: AdminLecturerService;

  constructor() {
    super();
  }

  public static getInstance(): AdminLecturerService {
    if (!this.instance) {
      this.instance = new AdminLecturerService();
    }

    return this.instance;
  }

  public async createLecturer(
    body: StudentRequestBody
  ): Promise<AxiosResponse<CreateLecturerResponse>> {
    await this.apiService.bindAuthorizationForClient();
    const userService = UserService.getInstance();
    if (body.level && Array.isArray(body.level)) {
      body.level = this.convertLevelToString(body.level);
    }

    return this.apiService.post<CreateLecturerResponse>(
      LECTURER_API.ADMIN,
      userService.convertToRequestBody(body)
    );
  }

  public async deleteLecturer(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(`${LECTURER_API.ADMIN}/${id}`);
  }
}
