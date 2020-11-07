import { PROGRESS_REPORT_UPLOAD_FOLDER } from '../progress-report/progress-report.resource';

export const UPLOAD_ROOT_FOLDER = './files';

export const DOWNLOAD_ROOT_FOLDER = './download';

export const UploadPath = {
  ROOT: 'upload',
  AVATAR: '/avatar',
  PROGRESS_REPORT: '/progress-report'
};

export const UPLOAD_BODY_PROPERTY = 'file';

export const UploadDestination = {
  AVATAR: `${UPLOAD_ROOT_FOLDER}/avatar`,
  PROGRESS_REPORT: `${UPLOAD_ROOT_FOLDER}/${PROGRESS_REPORT_UPLOAD_FOLDER}`
};

export const UploadFileSize = {
  AVATAR: 2097152,
  REPORT: NaN
};

export const UploadError = {
  ERR_1: 'Định dạng tệp tin không hợp lệ.',
  ERR_2: 'Đề tài không tồn tại.',
  ERR_3: 'Tệp tin không tồn tại.'
};

export const UPLOAD_TEMP_PREFIX = 'tmp_';
