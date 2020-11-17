import { Empty } from 'antd';
import React from 'react';

import { ResultModule } from '../../libs/common/common.resource';
import DownloadService from '../../libs/download/download.service';
import UploadService from '../../libs/upload/upload.service';
import UploadResult from './UploadResult';
import UploadViewBase from './UploadViewBase';

interface ComponentProps {
  topicId: number;
  module: ResultModule;
  canUpload: boolean;
  canFetch: boolean;
}

const UploadViewResult: React.FC<ComponentProps> = ({ topicId, module, canUpload, canFetch }) => {
  const uploadService = UploadService.getInstance();
  const { data } = uploadService.useResults(topicId, module, canFetch);
  if (!data) {
    return <Empty />;
  }

  const downloadService = DownloadService.getInstance();

  return (
    <UploadViewBase
      files={data.files}
      canUpload={canUpload}
      downloadAction={downloadService.downloadResult.bind(downloadService, topicId, module)}
      deleteAction={uploadService.deleteResult.bind(uploadService, topicId, module)}
      uploadElement={
        <UploadResult module={module} topicId={topicId} currentAmount={data.files.length} />
      }
    />
  );
};

export default UploadViewResult;
