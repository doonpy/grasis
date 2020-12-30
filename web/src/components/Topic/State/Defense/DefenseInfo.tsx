import { Alert, Empty, Space, Spin } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import { DefenseTerminology } from '../../../../assets/terminology/defense.terminology';
import { NOT_SELECT_ID, ReportModule, ResultModule } from '../../../../libs/common/common.resource';
import CouncilService from '../../../../libs/council/council.service';
import DefenseService from '../../../../libs/defense/defense.service';
import { DefenseForView } from '../../../../libs/defense/defense.type';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
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

  const { data, isLoading } = defenseService.useDefense(topicId, canFetch);
  const [defense, setDefense] = useState<DefenseForView | undefined>(
    data ? data.defense : undefined
  );
  useEffect(() => {
    if (data) {
      setDefense(data.defense);
    }
  }, [data]);

  const councilId = defense && defense.councilId ? defense.councilId : NaN;
  const { data: councilData } = councilService.useCouncil(
    topicId,
    councilId,
    canFetch && !isNaN(councilId) && councilId !== NOT_SELECT_ID
  );

  if (isLoading) {
    return <Spin />;
  }

  if (!defense) {
    return <Empty description={DefenseTerminology.DEFENSE_1} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [thesis.progressReport, thesis.review];
  const loginUser = LoginUser.getInstance();
  const canModifyUploadResult = councilData
    ? councilData.council.chairman.id === loginUser.getId()
    : false;
  const canModifyUploadReport =
    loginUser.isStudent() &&
    thesis.state === ThesisState.DEFENSE &&
    defense.reporters.findIndex(({ id }) => id === loginUser.getId()) !== -1;

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
      extendInfo={[
        {
          label: DefenseTerminology.DEFENSE_2,
          element: councilData ? <CouncilInfo council={councilData.council} /> : <TextData />
        },
        {
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
        }
      ]}
      canFetch={canFetch}
      canUpload={canModifyUploadReport}
      canDelete={canModifyUploadReport}
    />
  );
};

export default DefenseInfo;
