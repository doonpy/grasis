import useSWR from 'swr';

import { ReportModule } from '../common/common.resource';
import CommonService from '../common/common.service';
import { GetReportsResponse, UseReports } from './upload.interface';
import { UploadApi } from './upload.resource';

export default class UploadService extends CommonService {
  private static instance: UploadService;

  constructor() {
    super();
  }

  public static getInstance(): UploadService {
    if (!this.instance) {
      this.instance = new UploadService();
    }

    return this.instance;
  }

  public useReports(topicId: number, module: ReportModule): UseReports {
    const { data } = useSWR<GetReportsResponse>(
      this.replaceParams(UploadApi.GET_REPORTS, [topicId, module])
    );
    if (data) {
      data.reports = data.reports.map((report, index) => ({ ...report, key: index.toString() }));
    }

    return { data, isLoading: !data };
  }

  public async uploadReport(data: FormData): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.postFile(UploadApi.UPLOAD_REPORT, data);
  }

  public async deleteReport(
    module: ReportModule,
    topicId: number,
    filename: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(UploadApi.DELETE_REPORT, { module, topicId, filename });
  }
}
