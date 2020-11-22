import useSWR from 'swr';

import CommonService from '../common/common.service';
import {
  CouncilSearchInThesisByName,
  CouncilSearchInThesisByNameResponse
} from '../defense/defense.type';
import { CouncilApi } from './council.resource';
import { CouncilGetByIdForViewResponse, UseCouncil } from './council.type';

export default class CouncilService extends CommonService {
  private static instance: CouncilService;

  constructor() {
    super();
  }

  public static getInstance(): CouncilService {
    if (!this.instance) {
      this.instance = new CouncilService();
    }

    return this.instance;
  }

  public useCouncil(topicId: number, councilId: number, canFetch = true): UseCouncil {
    const { data } = useSWR<CouncilGetByIdForViewResponse>(
      canFetch ? this.replaceParams(CouncilApi.SPECIFY, [councilId, topicId]) : null
    );

    return { data, isLoading: !data };
  }

  public async searchInThesisByName(
    keyword: string,
    thesisId: number
  ): Promise<CouncilSearchInThesisByName[]> {
    await this.apiService.bindAuthorizationForClient();
    const { result } = (
      await this.apiService.get<CouncilSearchInThesisByNameResponse>(
        CouncilApi.SEARCH_IN_THESIS_BY_NAME,
        [thesisId, keyword]
      )
    ).data;

    return result;
  }
}
