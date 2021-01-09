import { Alert, Empty, Space, Spin } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import { DefenseTerminology } from '../../../../assets/terminology/defense.terminology';
import { NOT_SELECT_ID, ReportModule, ResultModule } from '../../../../libs/common/common.resource';
import CouncilService from '../../../../libs/council/council.service';
import DefenseService from '../../../../libs/defense/defense.service';
import { DefenseForView } from '../../../../libs/defense/defense.type';
import ReviewService from '../../../../libs/review/review.service';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import TextData from '../../../Common/TextData';
import CouncilInfo from '../../../Council/CouncilInfo';
import UploadViewResult from '../../../Upload/UploadViewResult';
import StateBaseInfo from '../StateBaseInfo';
import DefenseEdit from './DefenseEdit';

interface ComponentProps {
  topicId: number;
  thesis: ThesisForView;
  canFetch: boolean;
}

const DefenseInfo: React.FC<ComponentProps> = ({ topicId, thesis, canFetch }) => {
  const defenseService = DefenseService.getInstance();
  const councilService = CouncilService.getInstance();
  const reviewService = ReviewService.getInstance();

  const { data: reviewResult, isLoading: reviewResultLoading } = reviewService.useReviewResult(
    topicId,
    canFetch
  );
  const { data: defenseData, isLoading: defenseLoading } = defenseService.useDefense(
    topicId,
    canFetch && reviewResult && reviewResult.result === StateResult.TRUE
  );
  const [defense, setDefense] = useState<DefenseForView | undefined>(
    defenseData ? defenseData.defense : undefined
  );
  useEffect(() => {
    if (defenseData) {
      setDefense(defenseData.defense);
    }
  }, [defenseData]);

  const councilId = defense && defense.councilId ? defense.councilId : NaN;
  const { data: councilData } = councilService.useCouncil(
    topicId,
    councilId,
    canFetch && !isNaN(councilId) && councilId !== NOT_SELECT_ID
  );

  if (defenseLoading && reviewResultLoading) {
    return <Spin />;
  }

  if (reviewResult && reviewResult.result !== StateResult.TRUE) {
    return <Empty description={DefenseTerminology.DEFENSE_9} />;
  }

  if (!defense) {
    return <Empty description={DefenseTerminology.DEFENSE_1} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [thesis.review, thesis.defense];
  const loginUser = LoginUser.getInstance();
  const canModifyUploadResult = councilData
    ? councilData.council.chairman.id === loginUser.getId()
    : false;
  const canModifyUploadReport =
    loginUser.isStudent() &&
    thesis.state === ThesisState.DEFENSE &&
    defense.reporters.findIndex(({ id }) => id === loginUser.getId()) !== -1;
  const extendInfo = [
    {
      label: DefenseTerminology.DEFENSE_2,
      element: councilData ? <CouncilInfo council={councilData.council} /> : <TextData />
    }
  ];
  if (!loginUser.isStudent()) {
    extendInfo.push({
      label: DefenseTerminology.DEFENSE_3,
      element: (
        <>
          <Alert message={DefenseTerminology.DEFENSE_8} type="info" showIcon />
          <UploadViewResult
            module={ResultModule.DEFENSE}
            topicId={topicId}
            canUpload={canModifyUploadResult}
            canDelete={canModifyUploadResult}
            canFetch={canFetch}
          />
        </>
      )
    });
  }

  return (
    <StateBaseInfo
      module={ReportModule.DEFENSE}
      stateInfo={defense}
      buttons={
        <Space>
          {thesis.state === ThesisState.DEFENSE && (
            <DefenseEdit
              thesisId={thesis.id}
              defense={defense}
              setDefense={setDefense}
              validDateRange={validDateRange}
              thesisCreatorId={thesis.creatorId}
              defaultCouncil={councilData ? councilData.council : null}
            />
          )}
        </Space>
      }
      extendInfo={extendInfo}
      canFetch={canFetch}
      canUpload={canModifyUploadReport}
      canDelete={canModifyUploadReport}
    />
  );
};

export default DefenseInfo;
