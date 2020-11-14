import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Space } from 'antd';
import React, { useState } from 'react';

import FileAltIcon from '../../assets/svg/regular/file-alt.svg';
import FilePdfIcon from '../../assets/svg/regular/file-pdf.svg';
import FilePowerPointIcon from '../../assets/svg/regular/file-powerpoint.svg';
import FileWordIcon from '../../assets/svg/regular/file-word.svg';
import { DownloadTerminology } from '../../assets/terminology/download.terminology';
import { UploadTerminology } from '../../assets/terminology/upload.terminology';
import { removeFilenamePrefix } from '../../libs/common/common.helper';
import { ReportModule } from '../../libs/common/common.resource';
import { FileInfo } from '../../libs/common/common.type';
import DownloadService from '../../libs/download/download.service';
import { UPLOAD_REPORT_LIMIT_FILES, UploadReportMimeType } from '../../libs/upload/upload.resource';
import UploadService from '../../libs/upload/upload.service';
import DateData from '../Common/DateData';
import ReportFileUpload from './ReportFileUpload';

const { confirm } = Modal;

interface ComponentProps {
  topicId: number;
  module: ReportModule;
  canAction: boolean;
}

const ReportFileView: React.FC<ComponentProps> = ({ topicId, module, canAction }) => {
  const downloadService = DownloadService.getInstance();
  const uploadService = UploadService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const { data, isLoading } = uploadService.useReports(topicId, module);

  const downloadReport = async (filename: string) => {
    try {
      setLoading(true);
      await downloadService.downloadReport(topicId, module, filename);
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
          await uploadService.deleteReport(module, topicId, filename);
          message.success(UploadTerminology.UPLOAD_10);
        } catch (error) {
          await uploadService.requestErrorHandler(error);
        }
      }
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case UploadReportMimeType.MS_WORD:
      case UploadReportMimeType.WORD:
        return FileWordIcon;
      case UploadReportMimeType.PDF:
        return FilePdfIcon;
      case UploadReportMimeType.MS_POWERPOINT:
      case UploadReportMimeType.POWERPOINT:
        return FilePowerPointIcon;
      default:
        return FileAltIcon;
    }
  };

  return (
    <>
      <List
        loading={isLoading}
        itemLayout="horizontal"
        size="small"
        dataSource={data?.reports || []}
        footer={
          (data?.reports || []).length < UPLOAD_REPORT_LIMIT_FILES &&
          canAction && (
            <ReportFileUpload
              topicId={topicId}
              module={module}
              currentAmount={(data?.reports || []).length}
            />
          )
        }
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

                  {canAction && (
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

export default ReportFileView;
