import { ReportModule } from '../common/common.resource';
import CommonService from '../common/common.service';
import { DownloadApi } from './download.resource';
import { DownloadPathResponse } from './download.type';

export default class DownloadService extends CommonService {
  private static instance: DownloadService;

  constructor() {
    super();
  }

  public static getInstance(): DownloadService {
    if (!this.instance) {
      this.instance = new DownloadService();
    }

    return this.instance;
  }

  public async downloadReport(
    topicId: number,
    module: ReportModule,
    filename: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    const {
      data: { path }
    } = await this.apiService.post<DownloadPathResponse>(
      DownloadApi.GET_DOWNLOAD_REPORT,
      { module, filename },
      [topicId]
    );
    window.open(
      this.apiService.getFullUrl(this.replaceParams(DownloadApi.DOWNLOAD_REPORT, [path]))
    );
  }
}
