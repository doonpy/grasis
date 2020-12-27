import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DefenseTerminology } from '../../assets/terminology/defense.terminology';
import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import { ReviewTerminology } from '../../assets/terminology/review.terminology';
import { ReportModule, ResultModule } from '../common/common.resource';
import CommonService from '../common/common.service';
import { UploadApi } from './upload.resource';
import { GetFilesResponse, UploadFilesResponse, UseReports, UseResults } from './upload.type';

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

  public useReports(topicId: number, module: ReportModule, canFetch = true): UseReports {
    const { data } = useSWR<GetFilesResponse>(
      canFetch ? this.replaceParams(UploadApi.GET_REPORTS, [topicId, module]) : null
    );
    if (data) {
      data.files = data.files.map((file, index) => ({ ...file, key: index.toString() }));
    }

    return { data, isLoading: !data };
  }

  public async uploadReport(data: FormData): Promise<AxiosResponse<UploadFilesResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.postFile(UploadApi.REPORT, data);
  }

  public async deleteReport(
    topicId: number,
    module: ReportModule,
    filename: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(UploadApi.DELETE_REPORT, { module, topicId, filename });
  }

  public async uploadResult(data: FormData): Promise<AxiosResponse<UploadFilesResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.postFile(UploadApi.RESULT, data);
  }

  public useResults(topicId: number, module: ResultModule, canFetch = true): UseResults {
    const { data } = useSWR<GetFilesResponse>(
      canFetch ? this.replaceParams(UploadApi.GET_RESULTS, [topicId, module]) : null
    );
    if (data) {
      data.files = data.files.map((file, index) => ({ ...file, key: index.toString() }));
    }

    return { data, isLoading: !data };
  }

  public async deleteResult(
    topicId: number,
    module: ResultModule,
    filename: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(UploadApi.DELETE_RESULT, { module, topicId, filename });
  }

  public getUploadReportMessage(module: ReportModule): string {
    switch (module) {
      case ReportModule.PROGRESS_REPORT:
        return ProgressReportTerminology.PR_22;
      case ReportModule.REVIEW:
        return ReviewTerminology.REVIEW_16;
      case ReportModule.DEFENSE:
        return DefenseTerminology.DEFENSE_7;
    }
  }
}
