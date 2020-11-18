import { Empty } from 'antd';
import React from 'react';

import { ReportModule } from '../../libs/common/common.resource';
import DownloadService from '../../libs/download/download.service';
import UploadService from '../../libs/upload/upload.service';
import UploadReport from './UploadReport';
import UploadViewBase from './UploadViewBase';

interface ComponentProps {
  topicId: number;
  module: ReportModule;
  canUpload: boolean;
  canFetch: boolean;
}

const UploadViewReport: React.FC<ComponentProps> = ({ topicId, module, canUpload, canFetch }) => {
  const uploadService = UploadService.getInstance();
  const { data } = uploadService.useReports(topicId, module, canFetch);
  if (!data) {
    return <Empty />;
  }

  const downloadService = DownloadService.getInstance();

  return (
    <UploadViewBase
      files={data.files}
      canUpload={canUpload}
      downloadAction={downloadService.downloadReport.bind(downloadService, topicId, module)}
      deleteAction={uploadService.deleteReport.bind(uploadService, topicId, module)}
      uploadElement={
        <UploadReport module={module} topicId={topicId} currentAmount={data.files.length} />
      }
    />
  );
};

export default UploadViewReport;
