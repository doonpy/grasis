import { Descriptions, Space } from 'antd';
import React from 'react';

import { CommentTerminology } from '../../assets/terminology/comment.terminology';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import { ReportModule } from '../../libs/common/common.resource';
import ProgressReportService from '../../libs/progress-report/progress-report.service';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import { Thesis } from '../../libs/thesis/thesis.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import CommentAdd from '../Comment/CommentAdd';
import CommentList from '../Comment/CommentList';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import ReportFileView from '../ReportFile/ReportFileView';
import StudentFastView from '../Student/StudentFastView';
import ProgressReportAdminButton from './ProgressReportAdminButton';
import ProgressReportIsPassed from './ProgressReportIsPassed';

interface ComponentProps {
  topicId: number;
  thesis: Thesis;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topicId, thesis }) => {
  const progressReportService = ProgressReportService.getInstance();
  const thesisService = ThesisService.getInstance();
  const loginUser = LoginUser.getInstance();
  const { data } = progressReportService.useProgressReport(topicId);

  if (data) {
    return (
      <>
        <Descriptions
          layout="vertical"
          column={4}
          title={
            loginUser.isAdmin() &&
            loginUser.getId() === thesis.creatorId && (
              <ProgressReportAdminButton progressReport={data.progressReport} />
            )
          }>
          <Descriptions.Item label={<b>{ProgressReportTerminology.PR_5}</b>} span={2}>
            <Space direction="vertical">
              {data.progressReport.reporters.map((reporter, index) => (
                <StudentFastView key={index} student={reporter} />
              ))}
            </Space>
          </Descriptions.Item>
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
          <Descriptions.Item label={<b>{ProgressReportTerminology.PR_4}</b>} span={4}>
            <TextData text={data.progressReport.note} isParagraph={true} />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{ProgressReportTerminology.PR_12}</b>} span={2}>
            <ProgressReportIsPassed isPassed={data.progressReport.isPassed} />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{ProgressReportTerminology.PR_10}</b>} span={2}>
            <ReportFileView
              topicId={topicId}
              module={ReportModule.PROGRESS_REPORT}
              canAction={loginUser.isStudent() && thesisService.isProgressReportState(thesis)}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{CommentTerminology.COMMENT_1}</b>} span={4}>
            <CommentAdd topicId={topicId} state={ThesisState.PROGRESS_REPORT} />
            <CommentList topicId={topicId} state={ThesisState.PROGRESS_REPORT} />
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  } else {
    return <div />;
  }
};

export default ProgressReportInfo;
