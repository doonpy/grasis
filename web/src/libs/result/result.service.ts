import { AxiosResponse } from 'axios';
import useSWR from 'swr';

import CommonService from '../common/common.service';
import { ResultApi, ResultType } from './result.resource';
import {
  ResultChangeResponse,
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

  public async updateById(
    id: number,
    body: ResultRequestBody
  ): Promise<AxiosResponse<ResultChangeResponse>> {
    await this.apiService.bindAuthorizationForClient();

    return this.apiService.patch(ResultApi.SPECIFY, body, [id]);
  }

  public updateResultList(
    studentId: number,
    results: ResultOfStudentForView[],
    result: ResultForView,
    type: ResultType
  ): ResultOfStudentForView[] {
    const studentResult = results.find(({ student }) => student.id === studentId);
    if (!studentResult) {
      return results;
    }

    switch (type) {
      case ResultType.INSTRUCTOR:
        studentResult.instructor = result;
        break;
      case ResultType.REVIEW:
        studentResult.review = result;
        break;
      case ResultType.DEFENSE:
        studentResult.defense.map((item) => {
          if (item.id === result.id) {
            return result;
          }

          return item;
        });
        break;
    }

    return results;
  }
}
