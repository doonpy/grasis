import { Descriptions } from 'antd';
import React from 'react';

import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import { CouncilForView } from '../../libs/council/council.type';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';

interface ComponentProps {
  council: CouncilForView;
}

const CouncilInfo: React.FC<ComponentProps> = ({ council }) => {
  const { name, chairman, instructor, commissioner } = council;

  return (
    <Descriptions size="small" bordered={true}>
      <Descriptions.Item span={3} label={<b>{CouncilTerminology.COUNCIL_2}</b>}>
        <TextData text={name} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>{CouncilTerminology.COUNCIL_3}</b>}>
        <LecturerFastView lecturer={chairman} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>{CouncilTerminology.COUNCIL_4}</b>}>
        <LecturerFastView lecturer={instructor} />
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<b>{CouncilTerminology.COUNCIL_5}</b>}>
        <LecturerFastView lecturer={commissioner} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default CouncilInfo;
