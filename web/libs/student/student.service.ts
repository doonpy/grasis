import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import StudentBase from './student.base';
import {
  FindAllStudentResponse,
  FindOneStudentResponse,
  StudentRequestBody,
  StudentViewType,
  UseStudent,
  UseStudents
} from './student.interface';
import { STUDENT_API } from './student.resource';

export default class StudentService extends StudentBase {
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

  public useStudent(id: number): UseStudent {
    const { data } = useSWR<FindOneStudentResponse>(id && `${STUDENT_API.ROOT}/${id}`);

    return { data, isLoading: !data };
  }

  public async updateById(id: number, body: StudentRequestBody): Promise<void> {
    await this.apiService.bindAuthorizationForClient();

    await this.apiService.patch(`${STUDENT_API.ROOT}/${id}`, this.convertToRequestBody(body));
  }

  public async getInitialForEdit(id): Promise<StudentViewType> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<FindOneStudentResponse>(`${STUDENT_API.ROOT}/${id}`);

    return data.student;
  }
}
