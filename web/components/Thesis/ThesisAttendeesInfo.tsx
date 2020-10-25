import { Col, Descriptions, Row } from 'antd';
import React from 'react';

import ThesisTerminology from '../../assets/terminology/thesis.terminology';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { ThesisStudent } from '../../libs/thesis/thesis-student/thesis-student.interface';
import ThesisLecturerList from './ThesisLecturerList';
import ThesisStudentList from './ThesisStudentList';

interface ComponentProps {
  thesisId: number;
  initLecturers: Lecturer[];
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
  return (
    <Row>
      <Col span={11} offset={1}>
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
      <Col span={11} offset={1}>
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
