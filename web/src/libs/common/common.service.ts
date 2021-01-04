import { message } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import axios, { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import Router from 'next/router';

import ApiService from '../api/api.service';
import JwtClient from '../jwt/jwt.client';
import { LecturerApi } from '../lecturer/lecturer.resource';
import { LecturerSearchAttendeesResponse } from '../lecturer/lecturer.type';
import { StudentApi } from '../student/student.resource';
import { StudentSearchAttendeesResponse } from '../student/student.type';
import { ThesisAttendeeTarget } from '../thesis/thesis.resource';
import CommonRedirect, { RenderSide } from './common.redirect';
import { COMMON_PATH } from './common.resource';

let instance: CommonService;

export default class CommonService {
  public readonly apiService: ApiService;
  public readonly jwtService: JwtClient;
  public readonly redirectService: CommonRedirect;

  constructor() {
    this.apiService = new ApiService();
    this.jwtService = JwtClient.getInstance();
    this.redirectService = new CommonRedirect(RenderSide.CLIENT);
  }

  public static getInstance(): CommonService {
    if (!instance) {
      instance = new CommonService();
    }

    return instance;
  }

  public async requestErrorHandler(error: any): Promise<void> {
    if (axios.isCancel(error)) {
      return;
    }

    if (error.response) {
      const { data } = error.response;
      if (data.statusCode === StatusCodes.UNAUTHORIZED && Router.pathname !== COMMON_PATH.LOGIN) {
        this.jwtService.deleteAllToken();
        message.error(`[${data.statusCode}] ${data.message}`, 2.5).then(
          async () => await this.redirectService.redirectTo(COMMON_PATH.LOGIN),
          () => undefined
        );
      } else {
        message.error(`[${data.statusCode}] ${data.message}`);
      }
    } else {
      await this.redirectService.redirectTo(
        `${COMMON_PATH.ERROR.ERR_500}?title=${error.name}&message=${error.message}`
      );
    }
  }

  public async searchThesisAttendees(
    keyword: string,
    searchTypes: CheckboxValueType[],
    attendeeTarget: ThesisAttendeeTarget
  ): Promise<AxiosResponse<LecturerSearchAttendeesResponse | StudentSearchAttendeesResponse>> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.bindCancelToken();
    const endpoint =
      attendeeTarget === ThesisAttendeeTarget.LECTURER
        ? LecturerApi.SEARCH_ATTENDEES
        : StudentApi.SEARCH_ATTENDEES;
    const formattedSearchTypes = searchTypes.map(
      (searchType) => `searchTypes=${encodeURI(searchType as string)}`
    );
    const queryString = `?keyword=${encodeURI(keyword)}&${formattedSearchTypes.join('&')}`;

    return this.apiService.get<LecturerSearchAttendeesResponse | StudentSearchAttendeesResponse>(
      endpoint + queryString
    );
  }

  public replaceParams(url: string, params: (string | number)[]): string {
    let result = url;
    params.forEach((param, index) => {
      result = result.replace(`@${index}`, encodeURI(param.toString()));
    });

    return result;
  }
}
