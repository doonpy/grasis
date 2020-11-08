import { Descriptions, Space } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import { UPLOAD_REPORT_LIMIT_FILES, UploadReportModule } from '../../libs/common/common.resource';
import ProgressReportService from '../../libs/progress-report/progress-report.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import DateData from '../Common/DateData';
import ReportUpload from '../Common/ReportUpload';
import TextData from '../Common/TextData';
import StudentFastView from '../Student/StudentFastView';
import ProgressReportAdminButton from './ProgressReportAdminButton';
import ProgressReportFiles from './ProgressReportFiles';

interface ComponentProps {
  topicId: number;
  thesisCreatorId: number;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topicId, thesisCreatorId }) => {
  const progressReportService = ProgressReportService.getInstance();
  const loginUser = LoginUser.getInstance();
  const { data } = progressReportService.useProgressReport(topicId);

  if (data) {
    return (
      <Descriptions
        column={4}
        title={
          loginUser.isAdmin() &&
          loginUser.getId() === thesisCreatorId && (
            <ProgressReportAdminButton progressReport={data.progressReport} />
          )
        }>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_2}</b>} span={2}>
          <DateData date={data.progressReport.time} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_3}</b>} span={2}>
          <TextData text={data.progressReport.place} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={2}>
          <DateData date={data.progressReport.createdAt} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={2}>
          <DateData date={data.progressReport.updatedAt} isRelative={true} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_5}</b>} span={2}>
          <Space direction="vertical">
            {data.progressReport.reporters.map((reporter, index) => (
              <StudentFastView key={index} student={reporter} />
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_4}</b>} span={4}>
          <TextData text={data.progressReport.note} isParagraph={true} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_10}</b>} span={2}>
          <ProgressReportFiles files={data.progressReport.files} topicId={topicId} />
        </Descriptions.Item>
        {data.progressReport.files.length < UPLOAD_REPORT_LIMIT_FILES && loginUser.isStudent() && (
          <Descriptions.Item label={<b>{ProgressReportTerminology.PR_11}</b>} span={2}>
            <ReportUpload topicId={topicId} module={UploadReportModule.PROGRESS_REPORT} />
          </Descriptions.Item>
        )}
      </Descriptions>
    );
  } else {
    return <div />;
  }
};

export default ProgressReportInfo;
