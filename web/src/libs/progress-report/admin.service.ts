import { AxiosResponse } from 'axios';

import CommonService from '../common/common.service';
import { ProgressReportApi } from './progress-report.resource';
import {
  ProgressReportCreateOrUpdateResponse,
  ProgressReportRequestBody
} from './progress-report.type';

export default class ProgressReportAdminService extends CommonService {
  private static instance: ProgressReportAdminService;

  constructor() {
    super();
  }

  public static getInstance(): ProgressReportAdminService {
    if (!this.instance) {
      this.instance = new ProgressReportAdminService();
    }

    return this.instance;
  }

  public async updateById(
    topicId: number,
    body: ProgressReportRequestBody
  ): Promise<AxiosResponse<ProgressReportCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();
    return this.apiService.patch<ProgressReportCreateOrUpdateResponse>(
      ProgressReportApi.ADMIN_SPECIFY,
      body,
      [topicId]
    );
  }
}
