import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Space, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { DraggerProps } from 'antd/lib/upload/Dragger';
import React, { useState } from 'react';

import { UploadTerminology } from '../../assets/terminology/upload.terminology';
import { FILENAME_PATTERN, ReportModule } from '../../libs/common/common.resource';
import {
  UPLOAD_REPORT_LIMIT_FILES,
  UploadBody,
  UploadReportMimeTypes
} from '../../libs/upload/upload.resource';
import UploadService from '../../libs/upload/upload.service';

interface ComponentProps {
  topicId: number;
  module: ReportModule;
  currentAmount: number;
}

const ReportFileUpload: React.FC<ComponentProps> = ({ topicId, module, currentAmount }) => {
  const uploadService = UploadService.getInstance();
  const [uploadFiles, setUploadFiles] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const props: DraggerProps = {
    multiple: true,
    fileList: uploadFiles,
    onChange: ({ file, fileList }) => {
      if (!UploadReportMimeTypes.includes(file.type)) {
        message.error(`"${file.name}" - ${UploadTerminology.UPLOAD_1}`);
      }

      if (!FILENAME_PATTERN.test(file.name)) {
        message.error(`"${file.name}" - ${UploadTerminology.UPLOAD_2}`);
      }

      if (fileList.length + currentAmount > UPLOAD_REPORT_LIMIT_FILES) {
        message.error(UploadTerminology.UPLOAD_12);
      }
    },
    beforeUpload: (file, fileList) => {
      if (FILENAME_PATTERN.test(file.name) && UploadReportMimeTypes.includes(file.type)) {
        const newFileList = fileList.filter(
          ({ name }) => uploadFiles.findIndex((uploadFile) => uploadFile.name === name) === -1
        );
        setUploadFiles(
          [...uploadFiles, ...newFileList].slice(0 - UPLOAD_REPORT_LIMIT_FILES + currentAmount)
        );
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

      await uploadService.uploadReport(formData);
      setUploadFiles([]);
      setUploading(false);
      message.success(UploadTerminology.UPLOAD_3);
    } catch (error) {
      setUploading(false);
      await uploadService.requestErrorHandler(error);
    }
  };

  return (
    <Space align="start">
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={uploadFiles.length === 0}
        loading={uploading}>
        {UploadTerminology.UPLOAD_5}
      </Button>
      <Upload {...props}>
        <Button type="primary" icon={<UploadOutlined />}>
          {UploadTerminology.UPLOAD_4}
        </Button>
      </Upload>
    </Space>
  );
};

export default ReportFileUpload;
