import { Col, Descriptions, Row } from 'antd';
import React, { useEffect } from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { ThesisLecturer } from '../../libs/thesis/thesis-lecturer/thesis-lecturer.interface';
import { ThesisStudent } from '../../libs/thesis/thesis-student/thesis-student.interface';
import ThesisLecturerList from './ThesisLecturerList';
import ThesisStudentList from './ThesisStudentList';

interface ComponentProps {
  thesisId: number;
  initLecturers: ThesisLecturer[];
  initStudents: ThesisStudent[];
  initIsMoreLecturers: boolean;
  initIsMoreStudents: boolean;
}

const ThesisAttendeesInfo: React.FC<ComponentProps> = ({
  thesisId,
  initLecturers,
  initIsMoreLecturers,
  initStudents,
  initIsMoreStudents
}) => {
  useEffect(() => undefined, [thesisId]);
  useEffect(() => undefined, [initLecturers]);
  useEffect(() => undefined, [initIsMoreLecturers]);
  useEffect(() => undefined, [initStudents]);
  useEffect(() => undefined, [initIsMoreStudents]);

  return (
    <Row>
      <Col span={11} offset={0}>
        <Descriptions column={1} bordered title={ThesisTerminology.THESIS_6}>
          <Descriptions.Item span={1}>
            <ThesisLecturerList
              thesisId={thesisId}
              initLecturers={initLecturers}
              initIsMore={initIsMoreLecturers}
            />
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={12} offset={1}>
        <Descriptions column={1} bordered title={ThesisTerminology.THESIS_7}>
          <Descriptions.Item span={1}>
            <ThesisStudentList
              thesisId={thesisId}
              initStudents={initStudents}
              initIsMore={initIsMoreStudents}
            />
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default ThesisAttendeesInfo;
