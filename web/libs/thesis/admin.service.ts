import { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';

import CommonService from '../common/common.service';
import {
  ThesisCreateOrUpdateResponse,
  ThesisForEdit,
  ThesisGetByIdForEditResponse,
  ThesisRequestBody,
  ThesisSwitchStatusResponse
} from './thesis.interface';
import { THESIS_API_ADMIN_ROOT, ThesisApi } from './thesis.resource';

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

    return this.apiService.post<ThesisCreateOrUpdateResponse>(THESIS_API_ADMIN_ROOT, body);
  }

  public async updateById(
    id: number,
    body: ThesisRequestBody
  ): Promise<AxiosResponse<ThesisCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.patch<ThesisCreateOrUpdateResponse>(ThesisApi.ADMIN_SPECIFY, body, [id]);
  }

  public formatThesisRequestBody(formValues: ThesisRequestBody): ThesisRequestBody {
    const result: ThesisRequestBody = {};
    const [startTime, endTime] = formValues.duration;

    result.startTime = startTime.startOf('days');
    result.endTime = endTime.endOf('days').subtract(1, 'minutes');
    result.lecturerTopicRegister = (formValues.lecturerTopicRegister as Moment)
      .endOf('days')
      .subtract(1, 'minutes');
    result.studentTopicRegister = (formValues.studentTopicRegister as Moment)
      .endOf('days')
      .subtract(1, 'minutes');
    result.progressReport = (formValues.progressReport as Moment)
      .endOf('days')
      .subtract(1, 'minutes');
    result.review = (formValues.review as Moment).endOf('days').subtract(1, 'minutes');
    result.defense = (formValues.defense as Moment).endOf('days').subtract(1, 'minutes');
    delete formValues.duration;

    return { ...formValues, ...result };
  }

  public async getInitialForEdit(id: number): Promise<ThesisForEdit> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<ThesisGetByIdForEditResponse>(
      ThesisApi.ADMIN_GET_EDIT,
      [id]
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
    await this.apiService.delete(ThesisApi.ADMIN_SPECIFY, [id]);
  }

  public async switchStatus(id: number): Promise<AxiosResponse<ThesisSwitchStatusResponse>> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.bindCancelToken();
    return this.apiService.post<ThesisSwitchStatusResponse>(ThesisApi.ADMIN_SWITCH_STATUS, {}, [
      id
    ]);
  }
}
