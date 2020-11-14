import { Empty } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import { Thesis } from '../../../../libs/thesis/thesis.type';
import StateBaseInfo from '../StateBaseInfo';
import ProgressReportButton from './ProgressReportButton';
import ProgressReportEdit from './ProgressReportEdit';
import ProgressReportResult from './ProgressReportResult';

interface ComponentProps {
  topicId: number;
  thesis: Thesis;
  canFetch: boolean;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topicId, thesis, canFetch }) => {
  const progressReportService = ProgressReportService.getInstance();
  const { data } = progressReportService.useProgressReport(topicId, canFetch);
  const validDateRange: [string | Moment, string | Moment] = [
    thesis.studentTopicRegister,
    thesis.progressReport
  ];

  if (!data) {
    return <Empty description={ProgressReportTerminology.PR_20} />;
  }

  return (
    <StateBaseInfo
      module={ReportModule.PROGRESS_REPORT}
      stateInfo={data.progressReport}
      adminButton={
        <ProgressReportEdit
          progressReport={data.progressReport}
          validDateRange={validDateRange}
          thesisCreatorId={thesis.creatorId}
        />
      }
      extendInfo={[
        {
          label: ProgressReportTerminology.PR_12,
          element: <ProgressReportResult result={data.progressReport.result} />
        }
      ]}
      extra={
        <ProgressReportButton
          progressReport={data.progressReport}
          thesisCreatorId={thesis.creatorId}
        />
      }
    />
  );
};

export default ProgressReportInfo;
