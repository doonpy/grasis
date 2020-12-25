import React from 'react';

import { ReportModule } from '../../libs/common/common.resource';
import { FileInfo } from '../../libs/common/common.type';
import {
  UPLOAD_REPORT_LIMIT_FILES,
  UploadBody,
  UploadReportMimeTypes
} from '../../libs/upload/upload.resource';
import UploadService from '../../libs/upload/upload.service';
import { ExtraRequestBody } from '../../libs/upload/upload.type';
import UploadBase from './UploadBase';

interface ComponentProps {
  module: ReportModule;
  topicId: number;
  currentAmount: number;
  files: FileInfo[];
  setFiles: React.Dispatch<FileInfo[]>;
}

const UploadReport: React.FC<ComponentProps> = ({
  module,
  topicId,
  currentAmount,
  files,
  setFiles
}) => {
  const uploadService = UploadService.getInstance();
  const extraRequestBodyBody: ExtraRequestBody[] = [
    {
      name: UploadBody.TOPIC_ID,
      value: topicId.toString()
    },
    {
      name: UploadBody.MODULE,
      value: module.toString()
    }
  ];

  return (
    <UploadBase
      fileLimit={UPLOAD_REPORT_LIMIT_FILES}
      multiple={true}
      validMimeTypes={UploadReportMimeTypes}
      extraRequestBody={extraRequestBodyBody}
      currentAmount={currentAmount}
      action={uploadService.uploadReport.bind(uploadService)}
      files={files}
      setFiles={setFiles}
    />
  );
};

export default UploadReport;
