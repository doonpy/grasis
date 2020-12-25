import { AxiosResponse } from 'axios';

import CommonService from '../common/common.service';
import { ProgressReportApi } from './progress-report.resource';
import { ProgressReportRequestBody, ProgressReportUpdateResponse } from './progress-report.type';

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
  ): Promise<AxiosResponse<ProgressReportUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.patch<ProgressReportUpdateResponse>(
      ProgressReportApi.ADMIN_SPECIFY,
      body,
      [topicId]
    );
  }
}
