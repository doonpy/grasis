import useSWR from 'swr';

import { GenerateDownloadLinkResponse } from '../common/common.interface';
import CommonService from '../common/common.service';
import { ProgressReportGetByIdResponse, UseProgressReport } from './progress-report.interface';
import { ProgressReportApi } from './progress-report.resource';

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

  public async generateDownloadUrl(fileUrl: string): Promise<string> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<GenerateDownloadLinkResponse>(fileUrl);
    return data.url;
  }
}
