import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { useState } from 'react';

import FallbackImage from '../../assets/img/fallback-img.png';
import { UploadTerminology } from '../../assets/terminology/upload.terminology';
import { beforeUpload, getBase64 } from '../../libs/avatar/avatar.service';
import CommonService from '../../libs/common/common.service';
import { UPLOAD_AVATAR_BODY_PROPERTY, UploadApi } from '../../libs/upload/upload.resource';

interface ComponentProps {
  defaultImageUrl: string;
  width?: number | string;
  height?: number | string;
}

const AvatarFormItem: React.FC<ComponentProps> = ({ defaultImageUrl, width, height }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl);
  const commonService = CommonService.getInstance();

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as Blob, (uploadedUrl: string) => {
        setImageUrl(uploadedUrl);
        message.success(UploadTerminology.UPLOAD_3);
        setLoading(false);
      });
    }
  };

  return (
    <Space direction="vertical" align="center">
      <img
        src={imageUrl}
        width={width}
        height={height}
        onError={() => setImageUrl(FallbackImage)}
        alt="avatar"
      />
      <ImgCrop
        rotate
        grid
        modalTitle="Chỉnh sửa ảnh đại diện"
        modalOk="Hoàn thành"
        modalCancel="Hủy">
        <Upload
          name={UPLOAD_AVATAR_BODY_PROPERTY}
          headers={{
            Authorization: commonService.jwtService.getAccessTokenForAuth()
          }}
          action={`${commonService.apiService.getBaseUrl()}/${UploadApi.AVATAR}`}
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}>
          <Button loading={loading} icon={<UploadOutlined />}>
            {UploadTerminology.UPLOAD_5}
          </Button>
        </Upload>
      </ImgCrop>
    </Space>
  );
};

export default AvatarFormItem;
