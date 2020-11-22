import useSWR from 'swr';

import CommonService from '../common/common.service';
import { DefenseApi } from './defense.resource';
import { DefenseGetByIdResponse, UseDefense } from './defense.type';

export default class DefenseService extends CommonService {
  private static instance: DefenseService;

  constructor() {
    super();
  }

  public static getInstance(): DefenseService {
    if (!this.instance) {
      this.instance = new DefenseService();
    }

    return this.instance;
  }

  public useDefense(topicId: number, canFetch = true): UseDefense {
    const { data } = useSWR<DefenseGetByIdResponse>(
      canFetch ? this.replaceParams(DefenseApi.SPECIFY, [topicId]) : null
    );

    return { data: data, isLoading: !data };
  }

  // public async changeResult(
  //   id: number,
  //   result: StateResult,
  //   reviewerComment: string
  // ): Promise<void> {
  //   await this.apiService.bindAuthorizationForClient();
  //   await this.apiService.post(this.replaceParams(DefenseApi.CHANGE_RESULT, [id]), {
  //     result,
  //     reviewerComment
  //   });
  // }
}
