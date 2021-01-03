import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import { LecturerForFastView } from '../lecturer/lecturer.type';
import { ThesisApi, ThesisState } from './thesis.resource';
import {
  Thesis,
  ThesisFindManyResponse,
  ThesisGetByIdResponse,
  ThesisSearchLecturerInThesis,
  UseTheses,
  UseThesis
} from './thesis.type';
import {
  ThesisGetLecturersResponse,
  UseThesisLecturers
} from './thesis-lecturer/thesis-lecturer.type';
import { ThesisGetStudentsResponse, UseThesisStudents } from './thesis-student/thesis-student.type';

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

  public useTheses(
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string,
    canFetch = true
  ): UseTheses {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisFindManyResponse>(
      canFetch ? this.replaceParams(ThesisApi.GET_MANY, [offset, keyword || '']) : null
    );
    if (data) {
      data.theses = data.theses.map((thesis) => ({ ...thesis, key: thesis.id.toString() }));
    }

    return { data, isLoading: !data };
  }

  public useThesis(id: number, canFetch = true): UseThesis {
    const { data } = useSWR<ThesisGetByIdResponse>(
      canFetch ? this.replaceParams(ThesisApi.SPECIFY, [id]) : null
    );

    return { data, isLoading: !data };
  }

  public useThesisStudents(
    thesisId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string,
    canFetch = true
  ): UseThesisStudents {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisGetStudentsResponse>(
      canFetch
        ? this.replaceParams(ThesisApi.GET_THESIS_STUDENTS, [thesisId, offset, keyword || ''])
        : null
    );
    if (data) {
      data.students = data.students.map((student, index) => ({
        ...student,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }

  public useThesisLecturers(
    thesisId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string,
    canFetch = true
  ): UseThesisLecturers {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisGetLecturersResponse>(
      canFetch
        ? this.replaceParams(ThesisApi.GET_THESIS_LECTURERS, [thesisId, offset, keyword || ''])
        : null
    );
    if (data) {
      data.lecturers = data.lecturers.map((student, index) => ({
        ...student,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }

  public isProgressReportState({ state }: Thesis): boolean {
    return state === ThesisState.PROGRESS_REPORT;
  }

  public async searchLecturerInThesis(
    keyword: string,
    thesisId: number
  ): Promise<LecturerForFastView[]> {
    await this.apiService.bindAuthorizationForClient();
    const { result } = (
      await this.apiService.get<ThesisSearchLecturerInThesis>(ThesisApi.SEARCH_THESIS_LECTURERS, [
        thesisId,
        keyword
      ])
    ).data;

    return result;
  }
}
