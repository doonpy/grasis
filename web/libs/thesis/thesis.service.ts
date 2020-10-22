import { AxiosResponse } from 'axios';
import { Moment } from 'moment';

import CommonService from '../common/common.service';
import { CreateThesisResponse, ThesisRequestBody } from './thesis.interface';
import { ThesisApi } from './thesis.resource';

export default class ThesisService extends CommonService {
  private static instance: ThesisService;

  constructor() {
    super();
  }

  public static getInstance(): ThesisService {
    if (!this.instance) {
      this.instance = new ThesisService();
    }

    return this.instance;
  }

  public async createThesis(body: ThesisRequestBody): Promise<AxiosResponse<CreateThesisResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<CreateThesisResponse>(ThesisApi.ADMIN, body);
  }

  public formatThesisRequestBody(formValues: ThesisRequestBody): ThesisRequestBody {
    const result: ThesisRequestBody = {};
    const [startTime, endTime] = formValues.duration;

    result.startTime = startTime.startOf('days');
    result.endTime = endTime.endOf('days');
    result.lecturerTopicRegister = (formValues.lecturerTopicRegister as Moment).endOf('days');
    result.studentTopicRegister = (formValues.studentTopicRegister as Moment).endOf('days');
    result.progressReport = (formValues.progressReport as Moment).endOf('days');
    result.review = (formValues.review as Moment).endOf('days');
    result.defense = (formValues.defense as Moment).endOf('days');
    delete formValues.duration;

    return { ...formValues, ...result };
  }
}
