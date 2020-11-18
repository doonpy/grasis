import { Descriptions, Empty } from 'antd';
import React from 'react';

import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
import LecturerFastView from '../Lecturer/LecturerFastView';
import ThesisDateData from './ThesisDateData';
import ThesisInfoButtons from './ThesisInfoButtons';
import ThesisStateRender from './ThesisStateRender';
import ThesisStatusRender from './ThesisStatusRender';

interface ComponentProps {
  thesisId: number;
  canFetch: boolean;
}

const ThesisInfo: React.FC<ComponentProps> = ({ thesisId, canFetch }) => {
  const thesisService = ThesisService.getInstance();
  const { data } = thesisService.useThesis(thesisId, canFetch);
  if (!data) {
    return <Empty description={ThesisTerminology.THESIS_48} />;
  }

  return (
    <Descriptions
      title={<ThesisInfoButtons thesisId={data.thesis.id} status={data.thesis.status} />}
      bordered
      column={4}>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_10}</b>} span={2}>
        <TextData text={data.thesis.subject} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_11}</b>} span={2}>
        <LecturerFastView lecturer={data.thesis.creator} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_12}</b>} span={2}>
        <DateData date={data.thesis.startTime} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_13}</b>} span={2}>
        <DateData date={data.thesis.endTime} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_14}</b>} span={2}>
        <ThesisDateData
          date={data.thesis.lecturerTopicRegister}
          withSubInfo={data.thesis.state === ThesisState.LECTURER_TOPIC_REGISTER}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_15}</b>} span={2}>
        <ThesisDateData
          date={data.thesis.studentTopicRegister}
          withSubInfo={data.thesis.state === ThesisState.STUDENT_TOPIC_REGISTER}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_16}</b>} span={2}>
        <ThesisDateData
          date={data.thesis.progressReport}
          withSubInfo={data.thesis.state === ThesisState.PROGRESS_REPORT}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_17}</b>} span={2}>
        <ThesisDateData
          date={data.thesis.review}
          withSubInfo={data.thesis.state === ThesisState.REVIEW}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_18}</b>} span={4}>
        <ThesisDateData
          date={data.thesis.defense}
          withSubInfo={data.thesis.state === ThesisState.DEFENSE}
        />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_19}</b>} span={2}>
        <ThesisStateRender state={data.thesis.state} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{ThesisTerminology.THESIS_20}</b>} span={2}>
        <ThesisStatusRender status={data.thesis.status} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={2}>
        <DateData date={data.thesis.createdAt as string} dateOnly={true} />
      </Descriptions.Item>
      <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={2}>
        <DateData date={data.thesis.updatedAt as string} dateOnly={true} isRelative={true} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ThesisInfo;
