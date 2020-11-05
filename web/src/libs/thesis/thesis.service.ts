import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import {
  ThesisGetLecturersResponse,
  UseThesisLecturers
} from './thesis-lecturer/thesis-lecturer.interface';
import {
  ThesisGetStudentsResponse,
  UseThesisStudents
} from './thesis-student/thesis-student.interface';
import {
  ThesisFindManyResponse,
  ThesisGetByIdResponse,
  UseTheses,
  UseThesis
} from './thesis.interface';
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

  public useTheses(
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string
  ): UseTheses {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisFindManyResponse>(
      this.replaceParams(ThesisApi.GET_MANY, [offset, keyword || ''])
    );
    if (data) {
      data.theses = data.theses.map((thesis) => ({ ...thesis, key: thesis.id.toString() }));
    }

    return { data, isLoading: !data };
  }

  public useThesis(id: number): UseThesis {
    const { data } = useSWR<ThesisGetByIdResponse>(this.replaceParams(ThesisApi.SPECIFY, [id]));

    return { data, isLoading: !data };
  }

  public useThesisStudents(
    thesisId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string
  ): UseThesisStudents {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisGetStudentsResponse>(
      this.replaceParams(ThesisApi.GET_THESIS_STUDENTS, [thesisId, offset, keyword || ''])
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
    keyword?: string
  ): UseThesisLecturers {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<ThesisGetLecturersResponse>(
      this.replaceParams(ThesisApi.GET_THESIS_LECTURERS, [thesisId, offset, keyword || ''])
    );
    if (data) {
      data.lecturers = data.lecturers.map((student, index) => ({
        ...student,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }
}
