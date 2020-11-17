import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Space, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadProps } from 'antd/lib/upload/interface';
import React, { useState } from 'react';

import { UploadTerminology } from '../../assets/terminology/upload.terminology';
import { FILENAME_PATTERN } from '../../libs/common/common.resource';
import { UploadBody } from '../../libs/upload/upload.resource';
import UploadService from '../../libs/upload/upload.service';
import { ExtraRequestBody } from '../../libs/upload/upload.type';

interface ComponentProps {
  fileLimit: number;
  multiple: boolean;
  validMimeTypes: string[];
  extraRequestBody: ExtraRequestBody[];
  action: (formData: FormData) => Promise<void>;
  currentAmount?: number;
}

const UploadBase: React.FC<ComponentProps> = ({
  currentAmount = 0,
  fileLimit,
  multiple,
  validMimeTypes,
  extraRequestBody,
  action
}) => {
  const uploadService = UploadService.getInstance();
  const [uploadFiles, setUploadFiles] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const props: UploadProps = {
    multiple,
    fileList: uploadFiles,
    onChange: ({ file }) => {
      if (!validMimeTypes.includes(file.type)) {
        message.error(`"${file.name}" - ${UploadTerminology.UPLOAD_1}`);
      }

      if (!FILENAME_PATTERN.test(file.name)) {
        message.error(`"${file.name}" - ${UploadTerminology.UPLOAD_2}`);
      }
    },
    beforeUpload: (file, fileList) => {
      if (FILENAME_PATTERN.test(file.name) && validMimeTypes.includes(file.type)) {
        const newFileList = fileList.filter(
          ({ name }) => uploadFiles.findIndex((uploadFile) => uploadFile.name === name) === -1
        );
        setUploadFiles([...uploadFiles, ...newFileList].slice(0 - fileLimit + currentAmount));
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
      extraRequestBody.forEach(({ name, value }) => {
        formData.append(name, value);
      });
      if (multiple) {
        uploadFiles.forEach((file) => {
          formData.append(UploadBody.FILES, file);
        });
      } else {
        const file = uploadFiles.shift();
        formData.append(UploadBody.FILE, file || '');
      }

      await action(formData);
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

export default UploadBase;
