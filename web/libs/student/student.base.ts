import CommonService from '../common/common.service';
import UserService from '../user/user.service';
import { StudentRequestBody } from './student.interface';
import { IsGraduate } from './student.resource';

export default class StudentBase extends CommonService {
  constructor() {
    super();
  }

  protected convertToRequestBody(student: StudentRequestBody): StudentRequestBody {
    const userService = UserService.getInstance();
    const result = student;
    const { isGraduate } = student;
    if (typeof isGraduate !== 'undefined' && isGraduate !== null) {
      result.isGraduate = isGraduate ? IsGraduate.TRUE : IsGraduate.FALSE;
    }

    return { ...userService.convertToRequestBody(student), ...result };
  }
}
