import useSWR from 'swr';

import CommonService from '../common/common.service';
import { IsPassed, ProgressReportApi } from './progress-report.resource';
import { ProgressReportGetByIdResponse, UseProgressReport } from './progress-report.type';

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

  public useProgressReport(topicId: number): UseProgressReport {
    const { data } = useSWR<ProgressReportGetByIdResponse>(
      this.replaceParams(ProgressReportApi.GET_BY_TOPIC_ID, [topicId])
    );

    return { data, isLoading: !data };
  }

  public async changeResult(id: number, topicId: number, result: IsPassed): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(
      this.replaceParams(ProgressReportApi.ADMIN_CHANGE_RESULT, [id, topicId]),
      { isPassed: result }
    );
  }
}
