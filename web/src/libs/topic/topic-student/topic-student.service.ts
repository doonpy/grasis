import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE } from '../../common/common.resource';
import CommonService from '../../common/common.service';
import { TopicApi } from '../topic.resource';
import { TopicGetStudentsResponse, UseTopicStudents } from './topic-student.type';

export default class TopicStudentService extends CommonService {
  private static instance: TopicStudentService;

  constructor() {
    super();
  }

  public static getInstance(): TopicStudentService {
    if (!this.instance) {
      this.instance = new TopicStudentService();
    }

    return this.instance;
  }

  public useTopicStudents(
    topicId: number,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE,
    canFetch = true
  ): UseTopicStudents {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<TopicGetStudentsResponse>(
      canFetch ? this.replaceParams(TopicApi.GET_STUDENTS, [topicId, offset]) : null
    );
    if (data) {
      data.students = data.students.map((student, index) => ({
        ...student,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }
}
