import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Space } from 'antd';
import React, { ReactElement, useState } from 'react';

import FileAltIcon from '../../assets/svg/regular/file-alt.svg';
import FilePdfIcon from '../../assets/svg/regular/file-pdf.svg';
import FilePowerPointIcon from '../../assets/svg/regular/file-powerpoint.svg';
import FileWordIcon from '../../assets/svg/regular/file-word.svg';
import { DownloadTerminology } from '../../assets/terminology/download.terminology';
import { UploadTerminology } from '../../assets/terminology/upload.terminology';
import { removeFilenamePrefix } from '../../libs/common/common.helper';
import { FileInfo } from '../../libs/common/common.type';
import DownloadService from '../../libs/download/download.service';
import { UploadMimeType } from '../../libs/upload/upload.resource';
import DateData from '../Common/DateData';

const { confirm } = Modal;

interface ComponentProps {
  files: FileInfo[];
  setFiles: React.Dispatch<FileInfo[]>;
  canUpload: boolean;
  canDelete: boolean;
  downloadAction: (...args: any[]) => Promise<void>;
  deleteAction: (...args: any[]) => Promise<void>;
  uploadElement: ReactElement;
}

const UploadViewBase: React.FC<ComponentProps> = ({
  files,
  setFiles,
  canUpload,
  canDelete,
  downloadAction,
  deleteAction,
  uploadElement
}) => {
  const downloadService = DownloadService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const downloadReport = async (filename: string) => {
    try {
      setLoading(true);
      await downloadAction(filename);
      setLoading(false);
      message.success(DownloadTerminology.DOWNLOAD_1);
    } catch (error) {
      setLoading(false);
      await downloadService.requestErrorHandler(error);
    }
  };

  const deleteFile = async (filename: string) => {
    confirm({
      title: UploadTerminology.UPLOAD_6,
      icon: <ExclamationCircleOutlined />,
      content: UploadTerminology.UPLOAD_7,
      okText: UploadTerminology.UPLOAD_8,
      cancelText: UploadTerminology.UPLOAD_9,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await deleteAction(filename);
          setFiles(files.filter(({ name }) => name !== filename));
          message.success(UploadTerminology.UPLOAD_10);
        } catch (error) {
          await downloadService.requestErrorHandler(error);
        }
      }
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case UploadMimeType.MS_WORD:
      case UploadMimeType.WORD:
        return FileWordIcon;
      case UploadMimeType.PDF:
        return FilePdfIcon;
      case UploadMimeType.MS_POWERPOINT:
      case UploadMimeType.POWERPOINT:
        return FilePowerPointIcon;
      default:
        return FileAltIcon;
    }
  };

  return (
    <>
      <List
        itemLayout="horizontal"
        size="small"
        dataSource={files}
        footer={canUpload && uploadElement}
        renderItem={({ name, type, ctime }: FileInfo) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Icon component={getFileIcon(type)} />}
              title={
                <Space size="small">
                  <b>{removeFilenamePrefix(name)}</b>
                  <Button
                    loading={loading}
                    type="link"
                    size="small"
                    onClick={() => downloadReport(name)}>
                    {DownloadTerminology.DOWNLOAD_2}
                  </Button>

                  {canDelete && (
                    <Button type="link" size="small" danger onClick={() => deleteFile(name)}>
                      {UploadTerminology.UPLOAD_11}
                    </Button>
                  )}
                </Space>
              }
              description={
                <i>
                  <DateData date={ctime} />
                </i>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default UploadViewBase;
