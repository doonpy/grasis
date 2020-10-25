import { Button, List, Row } from 'antd';
import React, { useState } from 'react';

import ThesisTerminology from '../../assets/terminology/thesis.terminology';
import { ThesisStudent } from '../../libs/thesis/thesis-student/thesis-student.interface';
import { ThesisLoadMoreStudentsResponse } from '../../libs/thesis/thesis.interface';
import { LoadMoreTarget } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import ThesisStudentItem from './ThesisStudentItem';

interface ComponentPros {
  thesisId: number;
  initStudents: ThesisStudent[];
  initIsMore: boolean;
}

const ThesisStudentList: React.FC<ComponentPros> = ({ initStudents, initIsMore, thesisId }) => {
  const [isMore, setIsMore] = useState<boolean>(initIsMore);
  const [students, setStudents] = useState<ThesisStudent[]>(initStudents);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const thesisService = ThesisService.getInstance();

  const onLoadMoreClick = async () => {
    try {
      setLoadMoreLoading(true);
      const { students: newStudents, isMoreStudents } = (
        await thesisService.loadMoreAttendees(LoadMoreTarget.STUDENT, thesisId, students.length)
      ).data as ThesisLoadMoreStudentsResponse;
      setStudents([...students, ...newStudents]);
      setIsMore(isMoreStudents);
    } catch (error) {
      await thesisService.requestErrorHandler(error);
    }

    setLoadMoreLoading(false);
  };

  const loadMoreButton = () => {
    return (
      <Row justify="center" style={{ padding: 10 }}>
        <Button type="primary" loading={loadMoreLoading} onClick={onLoadMoreClick}>
          {ThesisTerminology.THESIS_8}
        </Button>
      </Row>
    );
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={students}
      loadMore={isMore && loadMoreButton()}
      renderItem={(thesisStudent: ThesisStudent) => (
        <ThesisStudentItem thesisStudent={thesisStudent} />
      )}
    />
  );
};

export default ThesisStudentList;
