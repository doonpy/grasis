import React from 'react';

import { ResultModule } from '../../libs/common/common.resource';
import {
  UPLOAD_RESULT_LIMIT_FILES,
  UploadBody,
  UploadReportMimeTypes
} from '../../libs/upload/upload.resource';
import UploadService from '../../libs/upload/upload.service';
import { ExtraRequestBody } from '../../libs/upload/upload.type';
import UploadBase from './UploadBase';

interface ComponentProps {
  module: ResultModule;
  topicId: number;
  currentAmount: number;
}

const UploadResult: React.FC<ComponentProps> = ({ module, topicId, currentAmount }) => {
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
      fileLimit={UPLOAD_RESULT_LIMIT_FILES}
      multiple={false}
      validMimeTypes={UploadReportMimeTypes}
      extraRequestBody={extraRequestBodyBody}
      currentAmount={currentAmount}
      action={uploadService.uploadResult.bind(uploadService)}
    />
  );
};

export default UploadResult;
