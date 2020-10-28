import { AxiosResponse } from 'axios';

import CommonService from '../common/common.service';
import { TopicCreateOrUpdateResponse, TopicRequestBody } from './topic.interface';
import { TOPIC_API_ROOT } from './topic.resource';

export default class TopicService extends CommonService {
  private static instance: TopicService;

  constructor() {
    super();
  }

  public static getInstance(): TopicService {
    if (!this.instance) {
      this.instance = new TopicService();
    }

    return this.instance;
  }

  public async create(
    topic: TopicRequestBody
  ): Promise<AxiosResponse<TopicCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<TopicCreateOrUpdateResponse>(TOPIC_API_ROOT, topic);
  }
}
