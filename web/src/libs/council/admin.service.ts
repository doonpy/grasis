import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import { CouncilApi } from './council.resource';
import {
  CouncilCreateOrUpdateResponse,
  CouncilForView,
  CouncilGetManyByThesisIdForViewResponse,
  CouncilRequestBody,
  UseCouncils
} from './council.type';

export default class CouncilAdminService extends CommonService {
  private static instance: CouncilAdminService;

  constructor() {
    super();
  }

  public static getInstance(): CouncilAdminService {
    if (!this.instance) {
      this.instance = new CouncilAdminService();
    }

    return this.instance;
  }

  public useCouncils(
    thesisId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string,
    canFetch = true
  ): UseCouncils {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<CouncilGetManyByThesisIdForViewResponse>(
      canFetch
        ? this.replaceParams(CouncilApi.ADMIN_GET_MANY_BY_THESIS_ID, [
            offset,
            keyword || '',
            thesisId.toString()
          ])
        : null
    );
    if (data) {
      data.councils = data.councils.map((council) => ({ ...council, key: council.id.toString() }));
    }

    return { data, isLoading: !data };
  }

  public async create(
    body: CouncilRequestBody
  ): Promise<AxiosResponse<CouncilCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<CouncilCreateOrUpdateResponse>(
      CouncilApi.ADMIN_GET_MANY_BY_THESIS_ID,
      body
    );
  }

  public async updateById(id: number, body: CouncilRequestBody): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.patch(CouncilApi.ADMIN_SPECIFY, body, [id]);
  }

  public async deleteById(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(CouncilApi.ADMIN_SPECIFY, [id]);
  }

  public convertToRequestBody({
    name,
    thesisId,
    chairman: { id: chairmanId },
    instructor: { id: instructorId },
    commissioner: { id: commissionerId }
  }: CouncilForView): CouncilRequestBody {
    return {
      thesisId,
      name,
      chairmanId,
      instructorId,
      commissionerId
    };
  }
}
