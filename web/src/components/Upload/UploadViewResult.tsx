import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';

import { ResultModule } from '../../libs/common/common.resource';
import { FileInfo } from '../../libs/common/common.type';
import DownloadService from '../../libs/download/download.service';
import UploadService from '../../libs/upload/upload.service';
import UploadResult from './UploadResult';
import UploadViewBase from './UploadViewBase';

interface ComponentProps {
  topicId: number;
  module: ResultModule;
  canUpload: boolean;
  canDelete: boolean;
  canFetch: boolean;
}

const UploadViewResult: React.FC<ComponentProps> = ({
  topicId,
  module,
  canUpload,
  canDelete,
  canFetch
}) => {
  const uploadService = UploadService.getInstance();
  const { data } = uploadService.useResults(topicId, module, canFetch);
  const [files, setFiles] = useState<FileInfo[]>(data ? data.files : []);
  useEffect(() => {
    if (data) {
      setFiles(data.files);
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
      canDelete={canDelete}
      downloadAction={downloadService.downloadResult.bind(downloadService, topicId, module)}
      deleteAction={uploadService.deleteResult.bind(uploadService, topicId, module)}
      uploadElement={
        <UploadResult
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

export default UploadViewResult;
