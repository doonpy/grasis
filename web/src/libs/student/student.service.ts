import { TransferItem } from 'antd/lib/transfer';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import StudentBase from './student.base';
import { STUDENT_API_ROOT, StudentApi } from './student.resource';
import {
  FindManyStudentResponse,
  StudentRequestBody,
  StudentSearchAttendee,
  UseStudents
} from './student.type';

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
    const { data } = useSWR<FindManyStudentResponse>(`${STUDENT_API_ROOT}?offset=${offset}`);
    if (data) {
      data.students = data.students.map((item, index) => ({
        ...item,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }

  public async updateById(id: number, body: StudentRequestBody): Promise<void> {
    await this.apiService.bindAuthorizationForClient();

    await this.apiService.patch(StudentApi.SPECIFY, this.convertToRequestBody(body), [id]);
  }

  public convertToTransferItem(attendees: StudentSearchAttendee[]): TransferItem[] {
    return attendees.map(({ id, fullName, attendeeId, studentClass, schoolYear }) => ({
      key: id.toString(),
      fullName: fullName,
      attendeeId: attendeeId,
      studentClass,
      schoolYear
    }));
  }
}
