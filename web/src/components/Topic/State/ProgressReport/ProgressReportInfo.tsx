import { Empty, Space } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import StateBaseInfo from '../StateBaseInfo';
import ProgressReportButton from './ProgressReportButton';
import ProgressReportEdit from './ProgressReportEdit';
import ProgressReportResult from './ProgressReportResult';

interface ComponentProps {
  topicId: number;
  thesis: ThesisForView;
  canFetch: boolean;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topicId, thesis, canFetch }) => {
  const progressReportService = ProgressReportService.getInstance();
  const { data: progressReportData } = progressReportService.useProgressReport(topicId, canFetch);

  if (!progressReportData) {
    return <Empty description={ProgressReportTerminology.PR_20} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [
    thesis.studentTopicRegister,
    thesis.progressReport
  ];

  return (
    <StateBaseInfo
      module={ReportModule.PROGRESS_REPORT}
      stateInfo={progressReportData.progressReport}
      buttons={
        <Space>
          {progressReportData.progressReport.result === StateResult.NOT_DECIDED && (
            <ProgressReportEdit
              progressReport={progressReportData.progressReport}
              validDateRange={validDateRange}
              thesisCreatorId={thesis.creatorId}
            />
          )}
          {thesis.state === ThesisState.PROGRESS_REPORT && (
            <ProgressReportButton
              progressReport={progressReportData.progressReport}
              thesisCreatorId={thesis.creatorId}
            />
          )}
        </Space>
      }
      extendInfo={[
        {
          label: ProgressReportTerminology.PR_12,
          element: <ProgressReportResult result={progressReportData.progressReport.result} />
        }
      ]}
      canFetch={canFetch}
    />
  );
};

export default ProgressReportInfo;
