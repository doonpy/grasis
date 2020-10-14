import { GetServerSidePropsContext } from 'next';

import CommonServer from '../common/common.server';
import { FindOneLecturerResponse, LecturerRequestBody } from './lecturer.interface';
import { LECTURER_API } from './lecturer.resource';

export default class LecturerServer extends CommonServer {
  constructor(ctx: GetServerSidePropsContext) {
    super(ctx);
  }

  public async getInitialForEdit(id): Promise<LecturerRequestBody> {
    await this.apiService.bindAuthorizationForServer(this.ctx);
    const { data } = await this.apiService.get<FindOneLecturerResponse>(
      `${LECTURER_API.ROOT}/${id}`
    );
    if (data && data.lecturer.level && typeof data.lecturer.level === 'string') {
      const levels = data.lecturer.level.split(';');
      data.lecturer.level = levels.filter(
        (level, index) => levels.lastIndexOf(level) === index && level !== ''
      );
    } else {
      data.lecturer.level = [];
    }

    return data.lecturer;
  }
}
