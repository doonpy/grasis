import { Empty, Space, Spin } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import { ProgressReportTerminology } from '../../../../assets/terminology/progress-report.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import { ProgressReportForView } from '../../../../libs/progress-report/progress-report.type';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import { TopicForView } from '../../../../libs/topic/topic.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';
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
  const loginUser = LoginUser.getInstance();
  const { data, isLoading } = progressReportService.useProgressReport(topic.id, canFetch);
  const [progressReport, setProgressReport] = useState<ProgressReportForView | undefined>(
    data ? data.progressReport : undefined
  );
  useEffect(() => {
    if (data) {
      setProgressReport(data.progressReport);
    }
  }, [data]);

  if (isLoading) {
    return <Spin />;
  }

  if (!progressReport) {
    return <Empty description={ProgressReportTerminology.PR_20} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [
    thesis.studentTopicRegister,
    thesis.progressReport
  ];
  const canModifyUploadReport =
    loginUser.isStudent() &&
    thesis.state === ThesisState.REVIEW &&
    progressReport.reporters.findIndex(({ id }) => id === loginUser.getId()) !== -1 &&
    progressReport.result === StateResult.NOT_DECIDED;

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
      canUpload={canModifyUploadReport}
      canDelete={canModifyUploadReport}
    />
  );
};

export default ProgressReportInfo;
