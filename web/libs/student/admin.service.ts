import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import UserService from '../user/user.service';
import StudentBase from './student.base';
import {
  CreateStudentResponse,
  FindManyStudentResponse,
  FindOneStudentResponse,
  StudentForm,
  UseStudent,
  UseStudents
} from './student.interface';
import { STUDENT_API_ADMIN_ROOT, StudentApi } from './student.resource';

export default class StudentAdminService extends StudentBase {
  private static instance: StudentAdminService;

  constructor() {
    super();
  }

  public static getInstance(): StudentAdminService {
    if (!this.instance) {
      this.instance = new StudentAdminService();
    }

    return this.instance;
  }

  public useStudents(pageNumber = 0, pageSize: number = DEFAULT_PAGE_SIZE): UseStudents {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<FindManyStudentResponse>(`${STUDENT_API_ADMIN_ROOT}?offset=${offset}`);
    if (data) {
      data.students = data.students.map((student, index) => {
        const user = student.user;

        return { ...student, ...user, key: index };
      });
    }

    return { data, isLoading: !data };
  }

  public useStudent(id: number): UseStudent {
    const { data } = useSWR<FindOneStudentResponse>(id && `${STUDENT_API_ADMIN_ROOT}/${id}`);

    return { data, isLoading: !data };
  }

  public async deleteStudent(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(StudentApi.ADMIN_SPECIFY, [id]);
  }

  public async updateById(id: number, { user, student }: StudentForm): Promise<void> {
    await this.apiService.bindAuthorizationForClient();

    await this.apiService.patch(
      StudentApi.ADMIN_SPECIFY,
      {
        student: this.convertToRequestBody(student),
        user: UserService.getInstance().convertToRequestBody(user)
      },
      [id]
    );
  }

  public async createStudent({
    user,
    student
  }: StudentForm): Promise<AxiosResponse<CreateStudentResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<CreateStudentResponse>(STUDENT_API_ADMIN_ROOT, {
      student: this.convertToRequestBody(student),
      user: UserService.getInstance().convertToRequestBody(user)
    });
  }

  public async getInitialForEdit(id: number): Promise<StudentForm> {
    await this.apiService.bindAuthorizationForClient();
    const { data } = await this.apiService.get<FindOneStudentResponse>(StudentApi.ADMIN_SPECIFY, [
      id
    ]);
    if (data) {
      return this.convertToFormValue(data.student);
    }
  }
}
