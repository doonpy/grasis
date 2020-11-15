import { Empty } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import ThesisService from '../../../../libs/thesis/thesis.service';
import StateBaseInfo from '../StateBaseInfo';
import ProgressReportButton from './ProgressReportButton';
import ProgressReportEdit from './ProgressReportEdit';
import ProgressReportResult from './ProgressReportResult';

interface ComponentProps {
  topicId: number;
  thesisId: number;
  canFetch: boolean;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topicId, thesisId, canFetch }) => {
  const progressReportService = ProgressReportService.getInstance();
  const thesisService = ThesisService.getInstance();
  const { data: thesisData } = thesisService.useThesis(thesisId, canFetch);
  const { data: progressReportData } = progressReportService.useProgressReport(topicId, canFetch);

  if (!progressReportData || !thesisData) {
    return <Empty description={ProgressReportTerminology.PR_20} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [
    thesisData.thesis.studentTopicRegister,
    thesisData.thesis.progressReport
  ];

  return (
    <StateBaseInfo
      module={ReportModule.PROGRESS_REPORT}
      stateInfo={progressReportData.progressReport}
      adminButton={
        <ProgressReportEdit
          progressReport={progressReportData.progressReport}
          validDateRange={validDateRange}
          thesisCreatorId={thesisData.thesis.creatorId}
        />
      }
      extendInfo={[
        {
          label: ProgressReportTerminology.PR_12,
          element: <ProgressReportResult result={progressReportData.progressReport.result} />
        }
      ]}
      extra={
        <ProgressReportButton
          progressReport={progressReportData.progressReport}
          thesisCreatorId={thesisData.thesis.creatorId}
        />
      }
    />
  );
};

export default ProgressReportInfo;
