import { Descriptions, Space } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import ProgressReportService from '../../libs/progress-report/progress-report.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import StudentFastView from '../Student/StudentFastView';
import ProgressReportAdminButton from './ProgressReportAdminButton';

interface ComponentProps {
  topicId: number;
  thesisCreatorId: number;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topicId, thesisCreatorId }) => {
  const progressReportService = ProgressReportService.getInstance();
  const loginUser = LoginUser.getInstance();
  const { data: progressReportData } = progressReportService.useProgressReport(topicId);

  if (progressReportData) {
    return (
      <Descriptions
        column={4}
        title={
          loginUser.isAdmin() &&
          loginUser.getId() === thesisCreatorId && (
            <ProgressReportAdminButton progressReport={progressReportData.progressReport} />
          )
        }>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_2}</b>} span={2}>
          <DateData date={progressReportData.progressReport.time} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_3}</b>} span={2}>
          <TextData text={progressReportData.progressReport.place} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={2}>
          <DateData date={progressReportData.progressReport.createdAt} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={2}>
          <DateData date={progressReportData.progressReport.updatedAt} isRelative={true} />
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_5}</b>} span={2}>
          <Space direction="vertical">
            {progressReportData.progressReport.reporters.map((reporter, index) => (
              <StudentFastView key={index} student={reporter} />
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={<b>{ProgressReportTerminology.PR_4}</b>} span={2}>
          <TextData text={progressReportData.progressReport.note} isParagraph={true} />
        </Descriptions.Item>
      </Descriptions>
    );
  } else {
    return <div />;
  }
};

export default ProgressReportInfo;
