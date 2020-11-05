import CommonService from '../common/common.service';
import UserService from '../user/user.service';
import { Lecturer, LecturerForm } from './lecturer.interface';

export default class LecturerBase extends CommonService {
  constructor() {
    super();
  }

  protected convertLevelToString(levels?: string[]): string | null {
    if (!levels) {
      return null;
    }

    return levels.filter((level, index) => levels.lastIndexOf(level) === index).join(';');
  }

  protected convertToFormValue(lecturer: Lecturer): LecturerForm {
    if (lecturer.level && typeof lecturer.level === 'string') {
      const levels = lecturer.level.split(';');
      lecturer.level = levels.filter(
        (level, index) => levels.lastIndexOf(level) === index && level !== ''
      );
    } else {
      lecturer.level = [];
    }

    return { lecturer, user: UserService.getInstance().getInitialForEdit(lecturer.user) };
  }
}
