export const COUNCIL_TABLE = `council`;

export const CouncilColumn = {
  NAME: 'name',
  THESIS_ID: 'thesis_id',
  CHAIRMAN_ID: 'chairman_id',
  INSTRUCTOR_ID: 'instructor_id',
  COMMISSIONER_ID: 'commissioner_id'
};

export const CouncilError = {
  ERR_1: 'Giảng viên được chọn làm chủ tịch không tham gia khóa luận này.',
  ERR_2: 'Giảng viên được chọn làm giảng viên hướng dẫn không tham gia khóa luận này.',
  ERR_3: 'Giảng viên được chọn làm ủy viên không tham gia khóa luận này.',
  ERR_4: 'Hội đồng không tồn tại.',
  ERR_5: 'Một giảng viên chỉ có tối đa 1 vị trí trong hội đồng.'
};

export const CouncilPath = {
  ROOT: 'councils',
  ADMIN_ROOT: 'admin/councils',
  SPECIFY: ':id',
  SEARCH_IN_THESIS_BY_NAME: 'search/:thesisId'
};

export const CouncilQuery = {
  THESIS_ID: 'thesisId',
  TOPIC_ID: 'topicId'
};
