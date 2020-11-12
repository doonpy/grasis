import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import LoginUser from '../user/instance/LoginUser';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicStudentStatus } from './topic-student/topic-student.resource';
import { TopicStudent } from './topic-student/topic-student.type';
import {
  Topic,
  TopicCreateOrUpdateResponse,
  TopicFindManyResponse,
  TopicGetByIdResponse,
  TopicRequestBody,
  UseTopics
} from './topic.type';
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

    return this.apiService.post<TopicCreateOrUpdateResponse>(
      `${TOPIC_API_ROOT}?thesisId=@0`,
      topic,
      [thesisId]
    );
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
      data.topics = data.topics.map((topic, index) => ({ ...topic, key: index.toString() }));
    }

    return { data, isLoading: !data };
  }

  public useTopic(thesisId = 0, topicId = 0) {
    const { data } = useSWR<TopicGetByIdResponse>(
      this.replaceParams(TopicApi.SPECIFY, [topicId, thesisId])
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
      topicId,
      thesisId
    ]);
  }

  public async getInitialForEdit(thesisId: number, topicId: number): Promise<Topic> {
    await this.apiService.bindAuthorizationForClient();

    const {
      data: { topic }
    } = await this.apiService.get<TopicGetByIdResponse>(TopicApi.SPECIFY, [topicId, thesisId]);

    return topic;
  }

  public async deleteById(thesisId: number, topicId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(TopicApi.SPECIFY, [topicId, thesisId]);
  }

  public async changeStatus(
    thesisId: number,
    topicId: number,
    action: TopicStateAction,
    note?: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.CHANGE_STATUS, { action, note }, [topicId, thesisId]);
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
    await this.apiService.post(TopicApi.CHANGE_REGISTER_STATUS, {}, [topicId, thesisId]);
  }

  public async registerTopic(thesisId: number, topicId: number, studentId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.REGISTER_TOPIC, {}, [topicId, thesisId, studentId]);
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
      topicId,
      thesisId,
      studentId
    ]);
  }

  public hasPermissionWithLoginUser(topic: Topic): boolean {
    const loginUser = LoginUser.getInstance();
    if (topic.thesis.creatorId === loginUser.getId()) {
      return topic.status !== TopicStateAction.NEW && topic.status !== TopicStateAction.WITHDRAW;
    }

    if (loginUser.isLecturer()) {
      return topic.creatorId === loginUser.getId();
    }

    if (loginUser.isStudent()) {
      const studentIds = topic.students
        .filter(({ status }) => status === TopicStudentStatus.APPROVED)
        .map(({ studentId }) => studentId);
      return studentIds.includes(loginUser.getId());
    }

    return false;
  }

  public hasPrivateContentPermission(topic: Topic): boolean {
    const loginUser = LoginUser.getInstance();
    if (loginUser.getId() === topic.thesis.creatorId) {
      return true;
    }

    return loginUser.getId() === topic.creatorId;
  }
}
