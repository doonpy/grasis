import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';

import { ReportModule } from '../../libs/common/common.resource';
import { FileInfo } from '../../libs/common/common.type';
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
  const [files, setFiles] = useState<FileInfo[]>(data ? data.files : []);
  useEffect(() => {
    if (data) {
      setFiles(files);
    }
  }, [data]);

  if (!files) {
    return <Empty />;
  }

  const downloadService = DownloadService.getInstance();

  return (
    <UploadViewBase
      files={files}
      setFiles={setFiles}
      canUpload={canUpload}
      downloadAction={downloadService.downloadReport.bind(downloadService, topicId, module)}
      deleteAction={uploadService.deleteReport.bind(uploadService, topicId, module)}
      uploadElement={
        <UploadReport
          module={module}
          topicId={topicId}
          currentAmount={files.length}
          files={files}
          setFiles={setFiles}
        />
      }
    />
  );
};

export default UploadViewReport;
