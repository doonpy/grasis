import Icon from '@ant-design/icons';
import { Button, Descriptions, List, message, Space } from 'antd';
import React, { useState } from 'react';

import FileAltIcon from '../../assets/svg/regular/file-alt.svg';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { FileInfo } from '../../libs/common/common.interface';
import { CommonApi } from '../../libs/common/common.resource';
import { ProgressReportApi } from '../../libs/progress-report/progress-report.resource';
import ProgressReportService from '../../libs/progress-report/progress-report.service';
import DateData from '../Common/DateData';

interface ComponentProps {
  files: FileInfo[];
  topicId: number;
}

const ProgressReportFiles: React.FC<ComponentProps> = ({ files, topicId }) => {
  const progressReportService = ProgressReportService.getInstance();
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
    } catch (error) {
      setLoading(false);
      await progressReportService.requestErrorHandler(error);
    }
  };

  return (
    <List
      itemLayout="horizontal"
      size="small"
      dataSource={files}
      renderItem={(file, index) => {
        const filePath = `${progressReportService.apiService.getBaseUrl()}${progressReportService.replaceParams(
          ProgressReportApi.GET_DOCUMENT,
          [topicId, file.name]
        )}`;

        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Icon type="primary" component={FileAltIcon} />}
              title={
                <Space>
                  <b>{file.name}</b>
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
                    <a href={downloadLinks[index]}>{CommonTerminology.COMMON_6}</a>
                  )}
                </Space>
              }
              description={
                <Descriptions size="small">
                  <Descriptions.Item label={<i>{CommonTerminology.COMMON_1}</i>} span={3}>
                    <i>
                      <DateData date={file.ctime} />
                    </i>
                  </Descriptions.Item>
                  <Descriptions.Item label={<i>{CommonTerminology.COMMON_2}</i>} span={3}>
                    <i>
                      <DateData date={file.mtime} isRelative={true} />
                    </i>
                  </Descriptions.Item>
                </Descriptions>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ProgressReportFiles;
