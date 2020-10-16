import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import {
  CreateStudentResponse,
  FindAllStudentResponse,
  FindOneStudentResponse,
  StudentRequestBody,
  UseStudent,
  UseStudents
} from './student.interface';
import { STUDENT_API } from './student.resource';

export default class StudentService extends CommonService {
  private static instance: StudentService;

  constructor() {
    super();
  }

  public static getInstance(): StudentService {
    if (!this.instance) {
      this.instance = new StudentService();
    }

    return this.instance;
  }

  public useStudents(pageNumber = 0, pageSize: number = DEFAULT_PAGE_SIZE): UseStudents {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<FindAllStudentResponse>(`${STUDENT_API.ROOT}?offset=${offset}`);
    if (data) {
      data.students = data.students.map((item, index) => ({ ...item, key: index }));
    }

    return { data, isLoading: !data };
  }

  public async createStudent(
    body: StudentRequestBody
  ): Promise<AxiosResponse<CreateStudentResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<CreateStudentResponse>(STUDENT_API.ADMIN, body);
  }

  public useStudent(id: number): UseStudent {
    const { data } = useSWR<FindOneStudentResponse>(id && `${STUDENT_API.ROOT}/${id}`);

    return { data, isLoading: !data };
  }

  public async deleteStudent(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(`${STUDENT_API.ADMIN}/${id}`);
  }
}
