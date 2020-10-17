import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../../common/common.resource';
import StudentBase from '../student.base';
import {
  CreateStudentResponse,
  FindAllStudentResponse,
  FindOneStudentResponse,
  StudentRequestBody,
  StudentViewType,
  UseStudent,
  UseStudents
} from '../student.interface';
import { STUDENT_API } from '../student.resource';

export default class AdminStudentService extends StudentBase {
  private static instance: AdminStudentService;

  constructor() {
    super();
  }

  public static getInstance(): AdminStudentService {
    if (!this.instance) {
      this.instance = new AdminStudentService();
    }

    return this.instance;
  }

  public useStudents(pageNumber = 0, pageSize: number = DEFAULT_PAGE_SIZE): UseStudents {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<FindAllStudentResponse>(`${STUDENT_API.ADMIN}?offset=${offset}`);
    if (data) {
      data.students = data.students.map((item, index) => ({ ...item, key: index }));
    }

    return { data, isLoading: !data };
  }

  public useStudent(id: number): UseStudent {
    const { data } = useSWR<FindOneStudentResponse>(id && `${STUDENT_API.ADMIN}/${id}`);

    return { data, isLoading: !data };
  }

  public async deleteStudent(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(`${STUDENT_API.ADMIN}/${id}`);
  }

  public async updateById(id: number, body: StudentRequestBody): Promise<void> {
    await this.apiService.bindAuthorizationForClient();

    await this.apiService.patch(`${STUDENT_API.ADMIN}/${id}`, this.convertToRequestBody(body));
  }

  public async createStudent(
    body: StudentRequestBody
  ): Promise<AxiosResponse<CreateStudentResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<CreateStudentResponse>(
      STUDENT_API.ADMIN,
      this.convertToRequestBody(body)
    );
  }

  public async getInitialForEdit(id): Promise<StudentViewType> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<FindOneStudentResponse>(`${STUDENT_API.ROOT}/${id}`);

    return data.student;
  }
}
