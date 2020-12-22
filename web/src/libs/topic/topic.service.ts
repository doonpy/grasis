import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../common/common.resource';
import CommonService from '../common/common.service';
import { ThesisForView } from '../thesis/thesis.type';
import LoginUser from '../user/instance/LoginUser';
import { TopicStateAction } from './topic-state/topic-state.resource';
import { TopicChangeStateResponse } from './topic-state/topic-state.type';
import { TopicStudentStatus } from './topic-student/topic-student.resource';
import { TopicStudent } from './topic-student/topic-student.type';
import { TOPIC_API_ROOT, TopicApi } from './topic.resource';
import {
  Topic,
  TopicCreateResponse,
  TopicFindManyResponse,
  TopicForView,
  TopicGetByIdResponse,
  TopicGetResultsForViewResponse,
  TopicRequestBody,
  TopicUpdateResponse,
  UseTopic,
  UseTopicResult,
  UseTopics
} from './topic.type';

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
  ): Promise<AxiosResponse<TopicCreateResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.post<TopicCreateResponse>(`${TOPIC_API_ROOT}?thesisId=@0`, topic, [
      thesisId
    ]);
  }

  public useTopics(
    thesisId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    keyword?: string,
    canFetch = true
  ): UseTopics {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<TopicFindManyResponse>(
      canFetch ? this.replaceParams(TopicApi.GET_MANY, [thesisId, offset, keyword || '']) : null
    );
    if (data) {
      data.topics = data.topics.map((topic, index) => ({ ...topic, key: index.toString() }));
    }

    return { data, isLoading: !data };
  }

  public useTopic(topicId: number, canFetch = true): UseTopic {
    const { data } = useSWR<TopicGetByIdResponse>(
      canFetch ? this.replaceParams(TopicApi.SPECIFY, [topicId]) : null
    );

    return { data, isLoading: !data };
  }

  public async updateById(
    topicId: number,
    topic: TopicRequestBody
  ): Promise<AxiosResponse<TopicUpdateResponse>> {
    await this.apiService.bindAuthorizationForClient();
    return this.apiService.patch<TopicUpdateResponse>(TopicApi.SPECIFY, topic, [topicId]);
  }

  public async getInitialForEdit(thesisId: number, topicId: number): Promise<TopicForView> {
    await this.apiService.bindAuthorizationForClient();

    const {
      data: { topic }
    } = await this.apiService.get<TopicGetByIdResponse>(TopicApi.SPECIFY, [topicId, thesisId]);

    return topic;
  }

  public async deleteById(topicId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(TopicApi.SPECIFY, [topicId]);
  }

  public async changeStatus(
    topicId: number,
    action: TopicStateAction,
    note?: string
  ): Promise<AxiosResponse<TopicChangeStateResponse>> {
    await this.apiService.bindAuthorizationForClient();
    return this.apiService.post(TopicApi.CHANGE_STATUS, { action, note }, [topicId]);
  }

  public canEdit({ creator: { id }, status }: Topic | TopicForView): boolean {
    const loginUser = LoginUser.getInstance();
    const allowEditStates = [
      TopicStateAction.NEW,
      TopicStateAction.WITHDRAW,
      TopicStateAction.SEND_BACK
    ];

    return loginUser.getId() === id && allowEditStates.includes(status);
  }

  public async changeRegisterStatus(topicId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.CHANGE_REGISTER_STATUS, {}, [topicId]);
  }

  public async registerTopic(topicId: number, studentId: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.REGISTER_TOPIC, {}, [topicId, studentId]);
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
    topicId: number,
    studentId: number,
    status: TopicStudentStatus
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(TopicApi.CHANGE_STUDENT_REGISTER_STATUS, { status }, [
      topicId,
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

  public hasPrivateContentPermission(thesis: ThesisForView, topic: TopicForView): boolean {
    const loginUser = LoginUser.getInstance();
    if (loginUser.getId() === thesis.creatorId) {
      return true;
    }

    return loginUser.getId() === topic.creator.id;
  }

  public useTopicResult(topicId: number, canFetch = true): UseTopicResult {
    const { data } = useSWR<TopicGetResultsForViewResponse>(
      canFetch ? this.replaceParams(TopicApi.GET_RESULTS, [topicId]) : null
    );

    return { data, isLoading: !data };
  }
}
