import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import {
  ThesisFindManyResponse,
  ThesisGetByIdResponse,
  ThesisLoadMoreLecturersResponse,
  ThesisLoadMoreStudentsResponse,
  UseTheses,
  UseThesis
} from './thesis.interface';
import { LoadMoreTarget, ThesisApi } from './thesis.resource';

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

  public useTheses(pageNumber = 0, pageSize: number = DEFAULT_PAGE_SIZE): UseTheses {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisFindManyResponse>(`${ThesisApi.ROOT}?offset=${offset}`);
    if (data) {
      data.theses = data.theses.map((thesis) => ({ ...thesis, key: thesis.id.toString() }));
    }

    return { data, isLoading: !data };
  }

  public useThesis(id: number): UseThesis {
    const { data } = useSWR<ThesisGetByIdResponse>(id && `${ThesisApi.ROOT}/${id}`);

    return { data, isLoading: !data };
  }

  public async loadMoreAttendees(
    target: LoadMoreTarget,
    thesisId: number,
    offset = 0
  ): Promise<AxiosResponse<ThesisLoadMoreLecturersResponse | ThesisLoadMoreStudentsResponse>> {
    await this.apiService.bindAuthorizationForClient();
    if (target === LoadMoreTarget.LECTURER) {
      return this.apiService.get<ThesisLoadMoreLecturersResponse>(
        `${ThesisApi.ROOT}/${thesisId}/${ThesisApi.LOAD_MORE_LECTURERS}?offset=${offset}`
      );
    }

    return this.apiService.get<ThesisLoadMoreStudentsResponse>(
      `${ThesisApi.ROOT}/${thesisId}/${ThesisApi.LOAD_MORE_STUDENTS}?offset=${offset}`
    );
  }
}
