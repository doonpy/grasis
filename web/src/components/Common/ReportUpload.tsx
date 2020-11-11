import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Space, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { DraggerProps } from 'antd/lib/upload/Dragger';
import React, { useState } from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import {
  FILENAME_PATTERN,
  UploadBody,
  UploadReportMimeType,
  UploadReportModule
} from '../../libs/common/common.resource';
import CommonService from '../../libs/common/common.service';

interface ComponentProps {
  topicId: number;
  module: UploadReportModule;
}

const ReportUpload: React.FC<ComponentProps> = ({ topicId, module }) => {
  const commonService = CommonService.getInstance();
  const [uploadFiles, setUploadFiles] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const props: DraggerProps = {
    multiple: true,
    fileList: uploadFiles,
    onChange: ({ file }) => {
      if (file.type !== UploadReportMimeType.WORD && file.type !== UploadReportMimeType.PDF) {
        message.error(`"${file.name}" - ${CommonTerminology.COMMON_9}`);
      }

      if (!FILENAME_PATTERN.test(file.name)) {
        message.error(`"${file.name}" - ${CommonTerminology.COMMON_19}`);
      }
    },
    beforeUpload: (file, fileList) => {
      console.log(file);
      if (
        FILENAME_PATTERN.test(file.name) &&
        (file.type === UploadReportMimeType.WORD || file.type === UploadReportMimeType.PDF)
      ) {
        const newFileList = fileList.filter(
          ({ name }) => uploadFiles.findIndex((uploadFile) => uploadFile.name === name) === -1
        );
        setUploadFiles([...uploadFiles, ...newFileList]);
      }

      return false;
    },
    onRemove: (file) => {
      setUploadFiles(uploadFiles.filter(({ uid }) => uid !== file.uid));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(UploadBody.TOPIC_ID, topicId.toString());
      formData.append(UploadBody.MODULE, module.toString());
      uploadFiles.forEach((file) => {
        formData.append(UploadBody.FILES, file);
      });

      await commonService.uploadReport(formData);
      setUploadFiles([]);
      setUploading(false);
      message.success(CommonTerminology.COMMON_10);
    } catch (error) {
      setUploading(false);
      await commonService.requestErrorHandler(error);
    }
  };

  return (
    <Space align="start" direction="vertical">
      <Upload {...props}>
        <Button size="small" type="primary" icon={<UploadOutlined />}>
          {CommonTerminology.COMMON_12}
        </Button>
      </Upload>
      <Button
        size="small"
        type="primary"
        onClick={handleUpload}
        disabled={uploadFiles.length === 0}
        loading={uploading}>
        {CommonTerminology.COMMON_11}
      </Button>
    </Space>
  );
};

export default ReportUpload;
