import useSWR from 'swr';

import { DEFAULT_PAGE_SIZE, ReportModule } from '../common/common.resource';
import CommonService from '../common/common.service';
import { COMMENT_API_ROOT, CommentApi, CommentMode } from './comment.resource';
import { CommentGetManyResponse, UseComment } from './comment.type';

export default class CommentService extends CommonService {
  private static instance: CommentService;

  constructor() {
    super();
  }

  public static getInstance(): CommentService {
    if (!this.instance) {
      this.instance = new CommentService();
    }

    return this.instance;
  }

  public useComments(
    topicId: number,
    module: ReportModule,
    pageNumber = 0,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): UseComment {
    const offset = (pageNumber - 1) * pageSize;
    const { data } = useSWR<CommentGetManyResponse>(
      this.replaceParams(CommentApi.GET_MANY, [topicId, module, offset])
    );
    if (data) {
      data.comments = data.comments.map((comment, index) => ({
        ...comment,
        key: index.toString()
      }));
    }

    return { data, isLoading: !data };
  }

  public async addComment(
    topicId: number,
    mode: CommentMode,
    module: ReportModule,
    content: string
  ): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.post(COMMENT_API_ROOT, { topicId, mode, module, content });
  }

  public async deleteById(id: number): Promise<void> {
    await this.apiService.bindAuthorizationForClient();
    await this.apiService.delete(CommentApi.SPECIFY, [id]);
  }
}
