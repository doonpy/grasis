export const DEFENSE_TABLE = 'defense';

export const DefenseColumn = {
  COUNCIL_ID: 'council_id'
};

export const DefenseError = {
  ERR_1: 'Vị trí giảng viên hướng dẫn của hội đồng bảo vệ không phù hợp với đề tài này.',
  ERR_2: 'Bảo vệ không tồn tại.',
  ERR_3: 'Thời gian bảo vệ không hợp lệ.',
  ERR_4: 'Khóa luận đang ngưng hoạt động.',
  ERR_5: 'Hiện tại không phải thời gian bảo vệ.',
  ERR_6: 'Bạn không thuộc hội đồng bảo vệ đề tài này.',
  ERR_7: 'Đề tài này chưa có hội đồng bảo vệ.'
};

export const DefensePath = {
  ROOT: 'defenses',
  ADMIN_ROOT: 'admin/defenses',
  SPECIFY: ':id'
};
