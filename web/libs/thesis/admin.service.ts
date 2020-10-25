import { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';

import CommonService from '../common/common.service';
import {
  ThesisCreateOrUpdateResponse,
  ThesisForEdit,
  ThesisGetByIdForEditResponse,
  ThesisRequestBody
} from './thesis.interface';
import { ThesisApi } from './thesis.resource';

export default class ThesisAdminService extends CommonService {
  private static instance: ThesisAdminService;

  constructor() {
    super();
  }

  public static getInstance(): ThesisAdminService {
    if (!this.instance) {
      this.instance = new ThesisAdminService();
    }

    return this.instance;
  }

  public async create(
    body: ThesisRequestBody
  ): Promise<AxiosResponse<ThesisCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<ThesisCreateOrUpdateResponse>(ThesisApi.ADMIN, body);
  }

  public async updateById(
    id: number,
    body: ThesisRequestBody
  ): Promise<AxiosResponse<ThesisCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.patch<ThesisCreateOrUpdateResponse>(
      ThesisApi.ADMIN_SPECIFY.replace('@1', id.toString()),
      body
    );
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

  public async getInitialForEdit(id: number): Promise<ThesisForEdit> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<ThesisGetByIdForEditResponse>(
      ThesisApi.ADMIN_GET_EDIT.replace('@1', id.toString())
    );
    if (data) {
      return data.thesis;
    }
  }

  public convertToFormValue({
    startTime,
    endTime,
    lecturerTopicRegister,
    studentTopicRegister,
    progressReport,
    review,
    defense,
    lecturerAttendees,
    studentAttendees,
    ...remainProps
  }: ThesisForEdit): ThesisRequestBody {
    const result: ThesisRequestBody = { attendees: { lecturers: [], students: [] } };
    result.duration = [moment(startTime), moment(endTime)];
    result.lecturerTopicRegister = moment(lecturerTopicRegister);
    result.studentTopicRegister = moment(studentTopicRegister);
    result.progressReport = moment(progressReport);
    result.review = moment(review);
    result.defense = moment(defense);
    result.attendees.lecturers = lecturerAttendees.map(({ id }) => id.toString());
    result.attendees.students = studentAttendees.map(({ id }) => id.toString());

    return { ...remainProps, ...result };
  }

  public async deleteById(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();

    await this.apiService.delete(ThesisApi.ADMIN_SPECIFY.replace('@1', id.toString()));
  }
}
