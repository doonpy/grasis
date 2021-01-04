import { Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';
import ThesisDateData from './ThesisDateData';
import ThesisInfoButtons from './ThesisInfoButtons';
import ThesisStateRender from './ThesisStateRender';
import ThesisStatusRender from './ThesisStatusRender';

interface ComponentProps {
  thesis: ThesisForView;
}

const ThesisInfo: React.FC<ComponentProps> = ({ thesis: initThesis }) => {
  const [thesis, setThesis] = useState<ThesisForView>(initThesis);
  useEffect(() => {
    setThesis(initThesis);
  }, [initThesis]);

  return (
    <Descriptions
      title={<ThesisInfoButtons thesis={thesis} setThesis={setThesis} />}
      bordered
      column={4}>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_10}</b>} span={2}>
        <TextData text={thesis.subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_11}</b>} span={2}>
        <LecturerFastView lecturer={thesis.creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_12}</b>} span={2}>
        <DateData date={thesis.startTime} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_13}</b>} span={2}>
        <DateData date={thesis.endTime} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_14}</b>} span={2}>
        <ThesisDateData
          date={thesis.lecturerTopicRegister}
          withSubInfo={thesis.state === ThesisState.LECTURER_TOPIC_REGISTER}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_15}</b>} span={2}>
        <ThesisDateData
          date={thesis.studentTopicRegister}
          withSubInfo={thesis.state === ThesisState.STUDENT_TOPIC_REGISTER}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_16}</b>} span={2}>
        <ThesisDateData
          date={thesis.progressReport}
          withSubInfo={thesis.state === ThesisState.PROGRESS_REPORT}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_17}</b>} span={2}>
        <ThesisDateData date={thesis.review} withSubInfo={thesis.state === ThesisState.REVIEW} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_18}</b>} span={4}>
        <ThesisDateData date={thesis.defense} withSubInfo={thesis.state === ThesisState.DEFENSE} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_19}</b>} span={2}>
        <ThesisStateRender state={thesis.state} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_20}</b>} span={2}>
        <ThesisStatusRender status={thesis.status} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={2}>
        <DateData date={thesis.createdAt as string} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={2}>
        <DateData date={thesis.updatedAt as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ThesisInfo;
