import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import CommonService from '../common/common.service';
import { StateResult } from '../topic/topic-state/topic-state.resource';
import { ProgressReportApi } from './progress-report.resource';
import {
  ProgressReportChangeResultResponse,
  ProgressReportGetByIdResponse,
  UseProgressReport
} from './progress-report.type';

export default class ProgressReportService extends CommonService {
  private static instance: ProgressReportService;

  constructor() {
    super();
  }

  public static getInstance(): ProgressReportService {
    if (!this.instance) {
      this.instance = new ProgressReportService();
    }

    return this.instance;
  }

  public useProgressReport(topicId: number, canFetch = true): UseProgressReport {
    const { data } = useSWR<ProgressReportGetByIdResponse>(
      canFetch ? this.replaceParams(ProgressReportApi.SPECIFY, [topicId]) : null
    );

    return { data, isLoading: !data };
  }

  public async changeResult(
    id: number,
    result: StateResult
  ): Promise<AxiosResponse<ProgressReportChangeResultResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post(this.replaceParams(ProgressReportApi.ADMIN_CHANGE_RESULT, [id]), {
      result
    });
  }
}
