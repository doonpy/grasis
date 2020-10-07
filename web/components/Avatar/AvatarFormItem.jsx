import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';

import { JwtService } from '../../module/auth/jwt.service';
import { beforeUpload, getBase64 } from '../../module/avatar/avatar.service';

function AvatarFormItem() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(true);
        setImageUrl(imageUrl);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <ImgCrop rotate grid modalTitle="Chỉnh sửa ảnh đại diện" modalOk="Hoàn thành" modalCancel="Hủy">
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        headers={{
          Authorization: JwtService.getAuthTokenFromCookie()
        }}
        action={`${process.env.NEXT_PUBLIC_API_SERVER}/upload/avatar`}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}>
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100px', height: '100px' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
}

export default AvatarFormItem;
