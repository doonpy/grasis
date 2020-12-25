import { Empty, Space } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import { ProgressReportForView } from '../../../../libs/progress-report/progress-report.type';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import { TopicForView } from '../../../../libs/topic/topic.type';
import StateBaseInfo from '../StateBaseInfo';
import ProgressReportButton from './ProgressReportButton';
import ProgressReportEdit from './ProgressReportEdit';
import ProgressReportResult from './ProgressReportResult';

interface ComponentProps {
  topic: TopicForView;
  thesis: ThesisForView;
  canFetch: boolean;
}

const ProgressReportInfo: React.FC<ComponentProps> = ({ topic, thesis, canFetch }) => {
  const progressReportService = ProgressReportService.getInstance();
  const { data: progressReportData } = progressReportService.useProgressReport(topic.id, canFetch);
  const [progressReport, setProgressReport] = useState<ProgressReportForView | undefined>(
    progressReportData ? progressReportData.progressReport : undefined
  );
  useEffect(() => {
    if (progressReportData) {
      setProgressReport(progressReportData.progressReport);
    }
  }, [progressReportData]);

  if (!progressReport) {
    return <Empty description={ProgressReportTerminology.PR_20} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [
    thesis.studentTopicRegister,
    thesis.progressReport
  ];

  return (
    <StateBaseInfo
      module={ReportModule.PROGRESS_REPORT}
      stateInfo={progressReport}
      buttons={
        <Space>
          {progressReport.result === StateResult.NOT_DECIDED && (
            <ProgressReportEdit
              progressReport={progressReport}
              setProgressReport={setProgressReport}
              validDateRange={validDateRange}
              thesisCreatorId={thesis.creatorId}
            />
          )}
          {thesis.state === ThesisState.PROGRESS_REPORT && (
            <ProgressReportButton
              progressReport={progressReport}
              setProgressReport={setProgressReport}
              thesisCreatorId={thesis.creatorId}
            />
          )}
        </Space>
      }
      extendInfo={[
        {
          label: ProgressReportTerminology.PR_12,
          element: <ProgressReportResult result={progressReport.result} />
        }
      ]}
      canFetch={canFetch}
    />
  );
};

export default ProgressReportInfo;
