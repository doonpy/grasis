import useSWR from 'swr';

import CommonService from '../../common/common.service';
import { TopicApi } from '../topic.resource';
import { TopicGetStatesResponse, UseTopicStates } from './topic-state.type';

export default class TopicStateService extends CommonService {
  private static instance: TopicStateService;

  constructor() {
    super();
  }

  public static getInstance(): TopicStateService {
    if (!this.instance) {
      this.instance = new TopicStateService();
    }

    return this.instance;
  }

  public useTopicStates(topicId: number, canFetch = true): UseTopicStates {
    const { data } = useSWR<TopicGetStatesResponse>(
      canFetch ? this.replaceParams(TopicApi.GET_STATES, [topicId]) : null
    );
    if (data) {
      data.states = data.states.map((state, index) => ({
        ...state,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }
}
