import { ResultPoint } from './result.type';

export const RESULT_TABLE = 'result';

export const ResultColumn = {
  TOPIC_ID: 'topic_id',
  STUDENT_ID: 'student_id',
  CREATOR_ID: 'creator_id',
  NOTE: 'note',
  TYPE: 'type',
  POINT: 'point',
  STATUS: 'status'
};

export const ResultError = {
  ERR_1: 'Loại kết quả không hợp lệ.',
  ERR_2: 'Thông tin này đang bị khóa, vui lòng liên hệ quản trị viên để được trợ giúp.',
  ERR_3: 'Kết quả không tồn tại.',
  ERR_4: 'Bạn không có quyền thực hiện thao tác này.',
  ERR_5: 'Hiện tại không phải giai đoạn đánh giá và công bố kết quả.'
};

export const ResultPath = {
  ROOT: 'results',
  ADMIN_ROOT: 'admin/results',
  SPECIFY: ':id',
  CHANGE_RESULT: ':id/change-result'
};

export enum ResultType {
  INSTRUCTOR = 1,
  REVIEW,
  DEFENSE
}

export enum ResultStatus {
  UNLOCK = 1,
  LOCK
}

export const RESULT_REVIEW_AND_DEFENSE_INITIAL_DATA: ResultPoint[] = [
  {
    title: 'Tính thực tiễn của đề tài, sự hiểu biết về vấn đề nghiên cứu',
    rate: 10,
    value: null
  },
  {
    title:
      'Tính đúng đắn và hợp lý của phương pháp nghiên cứu, của thiết kế, của giải pháp được nêu ra trong luận văn. Mức độ hoàn thiện của sản phẩm, mức độ hoàn thành công việc của sinh viên',
    rate: 40,
    value: null
  },
  {
    title: 'Chất lượng của bài thuyết trình',
    rate: 10,
    value: null
  },
  {
    title: 'Khả năng đọc sách ngoại ngữ tham khảo',
    rate: 5,
    value: null
  },
  {
    title: 'Khả năng tổng hợp kiến thức, viết luận văn',
    rate: 10,
    value: null
  },
  {
    title: 'Chất lượng về hình thức của luận văn (Cấu trúc, định dạng, chính tả, ...)',
    rate: 5,
    value: null
  },
  {
    title: 'Chất lượng trả lời các câu hỏi của hội đồng',
    rate: 20,
    value: null
  }
];

export const RESULT_INSTRUCTOR_INITIAL_DATA: ResultPoint[] = RESULT_REVIEW_AND_DEFENSE_INITIAL_DATA;
