import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, List, message, Modal, Space } from 'antd';
import React, { useState } from 'react';

import FileAltIcon from '../../assets/svg/regular/file-alt.svg';
import FilePdfIcon from '../../assets/svg/regular/file-pdf.svg';
import FileWordIcon from '../../assets/svg/regular/file-word.svg';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { FileInfo } from '../../libs/common/common.interface';
import {
  CommonApi,
  DOWNLOAD_TIME_TO_LIVE,
  UploadReportMimeType,
  UploadReportModule
} from '../../libs/common/common.resource';
import CommonService from '../../libs/common/common.service';
import { ProgressReportApi } from '../../libs/progress-report/progress-report.resource';
import ProgressReportService from '../../libs/progress-report/progress-report.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import DateData from '../Common/DateData';
const { confirm } = Modal;

interface ComponentProps {
  files: FileInfo[];
  topicId: number;
}

const ProgressReportFiles: React.FC<ComponentProps> = ({ files, topicId }) => {
  const progressReportService = ProgressReportService.getInstance();
  const commonService = CommonService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const generateDownloadLink = async (filePath: string, index: number) => {
    try {
      setLoading(true);
      const downloadPath = await progressReportService.generateDownloadUrl(filePath);
      downloadLinks[
        index
      ] = `${progressReportService.apiService.getBaseUrl()}${progressReportService.replaceParams(
        CommonApi.DOWNLOAD,
        [downloadPath]
      )}`;
      setDownloadLinks(downloadLinks);
      setLoading(false);
      message.success(CommonTerminology.COMMON_7);
      setTimeout(() => {
        downloadLinks[index] = '';
        setDownloadLinks(downloadLinks);
      }, DOWNLOAD_TIME_TO_LIVE);
    } catch (error) {
      setLoading(false);
      await progressReportService.requestErrorHandler(error);
    }
  };

  const deleteFile = async (filename: string) => {
    confirm({
      title: CommonTerminology.COMMON_14,
      icon: <ExclamationCircleOutlined />,
      content: CommonTerminology.COMMON_15,
      okText: CommonTerminology.COMMON_16,
      cancelText: CommonTerminology.COMMON_17,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await commonService.deleteReport(UploadReportModule.PROGRESS_REPORT, topicId, filename);
          message.success(CommonTerminology.COMMON_18);
        } catch (error) {
          await commonService.requestErrorHandler(error);
        }
      }
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case UploadReportMimeType.WORD:
        return FileWordIcon;
      case UploadReportMimeType.PDF:
        return FilePdfIcon;
      default:
        return FileAltIcon;
    }
  };

  return (
    <>
      <List
        bordered
        itemLayout="horizontal"
        size="small"
        dataSource={files}
        renderItem={({ name, type, ctime }: FileInfo, index) => {
          const filePath = `${progressReportService.apiService.getBaseUrl()}${progressReportService.replaceParams(
            ProgressReportApi.GET_DOCUMENT,
            [topicId, name]
          )}`;

          return (
            <List.Item>
              <List.Item.Meta
                avatar={<Icon component={getFileIcon(type)} />}
                title={
                  <Space size="small">
                    <b>{name}</b>
                    {!downloadLinks[index] && (
                      <Button
                        loading={loading}
                        type="link"
                        size="small"
                        onClick={() => generateDownloadLink(filePath, index)}>
                        {CommonTerminology.COMMON_5}
                      </Button>
                    )}
                    {downloadLinks[index] && (
                      <a href={downloadLinks[index]} target="_blank" rel="noreferrer">
                        {CommonTerminology.COMMON_6}
                      </a>
                    )}
                    {loginUser.isStudent() && (
                      <Button type="link" size="small" danger onClick={() => deleteFile(name)}>
                        {CommonTerminology.COMMON_13}
                      </Button>
                    )}
                  </Space>
                }
                description={
                  <Descriptions size="small">
                    <Descriptions.Item label={<i>{CommonTerminology.COMMON_1}</i>} span={3}>
                      <i>
                        <DateData date={ctime} />
                      </i>
                    </Descriptions.Item>
                  </Descriptions>
                }
              />
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default ProgressReportFiles;
