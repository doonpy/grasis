import { Descriptions } from 'antd';
import React from 'react';

import CommonTerminology from '../../assets/terminology/common.terminology';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { Thesis } from '../../libs/thesis/thesis.interface';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerInfo from '../Lecturer/LecturerInfo';
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
    <Descriptions
      title={ThesisTerminology.THESIS_9}
      bordered
      column={4}
      extra={<ThesisInfoButtons thesisId={id} status={status} />}>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_10}</b>} span={2}>
        <TextData text={subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_11}</b>} span={2}>
        <LecturerInfo lecturer={creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_12}</b>} span={2}>
        <DateData date={startTime as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_13}</b>} span={2}>
        <DateData date={endTime as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_14}</b>} span={2}>
        <DateData date={lecturerTopicRegister as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_15}</b>} span={2}>
        <DateData date={studentTopicRegister as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_16}</b>} span={2}>
        <DateData date={progressReport as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_17}</b>} span={2}>
        <DateData date={review as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_18}</b>} span={4}>
        <DateData date={defense as string} dateOnly={true} isRelative={true} />
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