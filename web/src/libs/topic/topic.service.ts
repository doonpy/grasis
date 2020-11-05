import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import LoginUser from '../user/instance/LoginUser';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicStudent } from './topic-student/topic-student.interface';
import { TopicStudentStatus } from './topic-student/topic-student.resource';
import {
  Topic,
  TopicCreateOrUpdateResponse,
  TopicFindManyResponse,
  TopicGetByIdResponse,
  TopicRequestBody,
  UseTopics
} from './topic.interface';
import { TOPIC_API_ROOT, TopicApi } from './topic.resource';

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
    thesisId: number,
    topic: TopicRequestBody
  ): Promise<AxiosResponse<TopicCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<TopicCreateOrUpdateResponse>(TOPIC_API_ROOT, topic, [thesisId]);
  }

  public useTopics(
    thesisId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string
  ): UseTopics {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<TopicFindManyResponse>(
      this.replaceParams(TopicApi.GET_MANY, [thesisId, offset, keyword || ''])
    );
    if (data) {
      data.topics = data.topics.map((topics) => ({ ...topics, key: topics.id.toString() }));
    }

    return { data, isLoading: !data };
  }

  public useTopic(thesisId = 0, topicId = 0) {
    const { data } = useSWR<TopicGetByIdResponse>(
      this.replaceParams(TopicApi.SPECIFY, [thesisId, topicId])
    );

    return { data, isLoading: !data };
  }

  public async updateById(
    thesisId: number,
    topicId: number,
    topic: TopicRequestBody
  ): Promise<AxiosResponse<TopicCreateOrUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.patch<TopicCreateOrUpdateResponse>(TopicApi.SPECIFY, topic, [
      thesisId,
      topicId
    ]);
  }

  public async getInitialForEdit(thesisId: number, topicId: number): Promise<Topic> {
    await this.apiService.bindAuthorizationForClient();

    const {
      data: { topic }
    } = await this.apiService.get<TopicGetByIdResponse>(TopicApi.SPECIFY, [thesisId, topicId]);

    return topic;
  }

  public async deleteById(thesisId: number, topicId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(TopicApi.SPECIFY, [thesisId, topicId]);
  }

  public async changeStatus(
    thesisId: number,
    topicId: number,
    action: TopicStateAction,
    note?: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.CHANGE_STATUS, { action, note }, [thesisId, topicId]);
  }

  public canEdit({ creatorId, status }: Topic): boolean {
    const loginUser = LoginUser.getInstance();

    return (
      loginUser.getId() === creatorId &&
      (status === TopicStateAction.NEW || status === TopicStateAction.WITHDRAW)
    );
  }

  public async changeRegisterStatus(thesisId: number, topicId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.CHANGE_REGISTER_STATUS, {}, [thesisId, topicId]);
  }

  public async registerTopic(thesisId: number, topicId: number, studentId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.REGISTER_TOPIC, {}, [thesisId, topicId, studentId]);
  }

  public hasStudentParticipated(students: TopicStudent[]): boolean {
    const loginUserId = LoginUser.getInstance().getId();

    return (
      students.findIndex(
        ({ studentId, status }) =>
          loginUserId === studentId &&
          (status === TopicStudentStatus.APPROVED || status === TopicStudentStatus.PENDING)
      ) !== -1
    );
  }

  public async changeStudentRegisterStatus(
    thesisId: number,
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.CHANGE_STUDENT_REGISTER_STATUS, { status }, [
      thesisId,
      topicId,
      studentId
    ]);
  }
}
