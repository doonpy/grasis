import CommonService from '../common/common.service';
import UserService from '../user/user.service';
import { Student, StudentForm, StudentRequestBody } from './student.interface';
import { IsGraduate } from './student.resource';

export default class StudentBase extends CommonService {
  constructor() {
    super();
  }

  protected convertToRequestBody(student: StudentRequestBody): StudentRequestBody {
    const result = student;
    const { isGraduate } = student;
    if (typeof isGraduate !== 'undefined' && isGraduate !== null) {
      result.isGraduate = isGraduate ? IsGraduate.TRUE : IsGraduate.FALSE;
    }

    return result;
  }

  protected convertToFormValue(student: Student): StudentForm {
    if (student.isGraduate) {
      student.isGraduate = student.isGraduate === IsGraduate.TRUE;
    }

    return { student, user: UserService.getInstance().getInitialForEdit(student.user) };
  }
}
