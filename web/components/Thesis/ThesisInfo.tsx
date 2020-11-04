import { Descriptions } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { Thesis } from '../../libs/thesis/thesis.interface';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerInfo from '../Lecturer/LecturerInfo';
import ThesisDateData from './ThesisDateData';
import ThesisInfoButtons from './ThesisInfoButtons';
import ThesisStateRender from './ThesisStateRender';
import ThesisStatusRender from './ThesisStatusRender';

interface ComponentProps {
  thesis: Thesis;
}

const ThesisInfo: React.FC<ComponentProps> = ({
  thesis: {
    id,
    subject,
    creator,
    startTime,
    endTime,
    lecturerTopicRegister,
    studentTopicRegister,
    progressReport,
    review,
    defense,
    state,
    status,
    createdAt,
    updatedAt
  }
}) => {
  return (
    <Descriptions title={<ThesisInfoButtons thesisId={id} status={status} />} bordered column={4}>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_10}</b>} span={2}>
        <TextData text={subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_11}</b>} span={2}>
        <LecturerInfo lecturer={creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_12}</b>} span={2}>
        <DateData date={startTime} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_13}</b>} span={2}>
        <DateData date={endTime} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_14}</b>} span={2}>
        <ThesisDateData
          date={lecturerTopicRegister}
          withSubInfo={state === ThesisState.LECTURER_TOPIC_REGISTER}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_15}</b>} span={2}>
        <ThesisDateData
          date={studentTopicRegister}
          withSubInfo={state === ThesisState.STUDENT_TOPIC_REGISTER}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_16}</b>} span={2}>
        <ThesisDateData date={progressReport} withSubInfo={state === ThesisState.PROGRESS_REPORT} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_17}</b>} span={2}>
        <ThesisDateData date={review} withSubInfo={state === ThesisState.REVIEW} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_18}</b>} span={4}>
        <ThesisDateData date={defense} withSubInfo={state === ThesisState.DEFENSE} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_19}</b>} span={2}>
        <ThesisStateRender state={state} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_20}</b>} span={2}>
        <ThesisStatusRender status={status} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={2}>
        <DateData date={createdAt as string} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={2}>
        <DateData date={updatedAt as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ThesisInfo;
