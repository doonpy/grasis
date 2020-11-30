import useSWR from 'swr';

import CommonService from '../common/common.service';
import { ResultApi } from './result.resource';
import {
  ResultForView,
  ResultGetByTopicIdForViewResponse,
  ResultOfStudentForView,
  ResultRequestBody,
  UseResult
} from './result.type';

export default class ResultService extends CommonService {
  private static instance: ResultService;

  constructor() {
    super();
  }

  public static getInstance(): ResultService {
    if (!this.instance) {
      this.instance = new ResultService();
    }

    return this.instance;
  }

  public useResult(topicId: number, canFetch = true): UseResult {
    const { data } = useSWR<ResultGetByTopicIdForViewResponse>(
      canFetch ? this.replaceParams(ResultApi.SPECIFY, [topicId]) : null
    );

    return { data, isLoading: !data };
  }

  public calculateDefenseAverage(results: ResultForView[]): number {
    let defenseSummary = 0;
    results.forEach(({ average }) => {
      defenseSummary += average;
    });

    return Math.round((defenseSummary / 3) * 100) / 100;
  }

  public calculateResultOfStudent(result: ResultOfStudentForView): number {
    const instructorResult = result.instructor ? result.instructor.average : 0;
    const reviewResult = result.review ? result.review.average : 0;
    const defenseResult = this.calculateDefenseAverage(result.defense);

    return Math.round(((instructorResult + reviewResult + defenseResult) / 3) * 100) / 100;
  }

  public async updateById(id: number, body: ResultRequestBody): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.patch(ResultApi.SPECIFY, body, [id]);
  }
}
