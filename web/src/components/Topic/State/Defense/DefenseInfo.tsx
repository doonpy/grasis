import { Empty, Space } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { DefenseTerminology } from '../../../../assets/terminology/defense.terminology';
import { NOT_SELECT_ID, ReportModule, ResultModule } from '../../../../libs/common/common.resource';
import CouncilService from '../../../../libs/council/council.service';
import DefenseService from '../../../../libs/defense/defense.service';
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
  const { data: defenseData } = defenseService.useDefense(topicId, canFetch);
  const councilService = CouncilService.getInstance();
  const councilId =
    defenseData && defenseData.defense && defenseData.defense.councilId
      ? defenseData.defense.councilId
      : NaN;
  const { data: councilData } = councilService.useCouncil(
    topicId,
    councilId,
    canFetch && !isNaN(councilId) && councilId !== NOT_SELECT_ID
  );

  if (!defenseData || !defenseData.defense) {
    return <Empty description={DefenseTerminology.DEFENSE_1} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [thesis.progressReport, thesis.review];
  const loginUser = LoginUser.getInstance();
  const canUpload = councilData ? councilData.council.chairman.id === loginUser.getId() : false;

  return (
    <StateBaseInfo
      module={ReportModule.DEFENSE}
      stateInfo={defenseData.defense}
      buttons={
        <Space>
          {thesis.state === ThesisState.DEFENSE && (
            <DefenseEdit
              thesisId={thesis.id}
              defense={defenseData.defense}
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
            <UploadViewResult
              module={ResultModule.DEFENSE}
              topicId={topicId}
              canUpload={canUpload}
              canFetch={canFetch}
            />
          )
        }
      ]}
      canFetch={canFetch}
    />
  );
};

export default DefenseInfo;
