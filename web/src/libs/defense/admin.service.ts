import { AxiosResponse } from 'axios';

import { NOT_SELECT_ID } from '../common/common.resource';
import CommonService from '../common/common.service';
import { DefenseApi } from './defense.resource';
import { DefenseCreateOrUpdateResponse, DefenseRequestBody } from './defense.type';

export default class DefenseAdminService extends CommonService {
  private static instance: DefenseAdminService;

  constructor() {
    super();
  }

  public static getInstance(): DefenseAdminService {
    if (!this.instance) {
      this.instance = new DefenseAdminService();
    }

    return this.instance;
  }

  public async updateById(
    id: number,
    body: DefenseRequestBody
  ): Promise<AxiosResponse<DefenseCreateOrUpdateResponse>> {
    if (body.councilId === NOT_SELECT_ID) {
      delete body.councilId;
    }

    await this.apiService.bindAuthorizationForClient();
    return this.apiService.patch<DefenseCreateOrUpdateResponse>(DefenseApi.ADMIN_SPECIFY, body, [
      id
    ]);
  }
}
