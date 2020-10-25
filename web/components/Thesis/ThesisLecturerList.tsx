import { Button, List, Row } from 'antd';
import React, { useState } from 'react';

import ThesisTerminology from '../../assets/terminology/thesis.terminology';
import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { ThesisLoadMoreLecturersResponse } from '../../libs/thesis/thesis.interface';
import { LoadMoreTarget } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import ThesisLecturersListItem from './ThesisLectureItem';

interface ComponentPros {
  thesisId: number;
  initLecturers: Lecturer[];
  initIsMore: boolean;
}

const ThesisLecturerList: React.FC<ComponentPros> = ({ initLecturers, initIsMore, thesisId }) => {
  const [isMore, setIsMore] = useState<boolean>(initIsMore);
  const [lecturers, setLecturers] = useState<Lecturer[]>(initLecturers);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const thesisService = ThesisService.getInstance();

  const onLoadMoreClick = async () => {
    try {
      setLoadMoreLoading(true);
      const { lecturers: newLecturers, isMoreLecturers } = (
        await thesisService.loadMoreAttendees(LoadMoreTarget.LECTURER, thesisId, lecturers.length)
      ).data as ThesisLoadMoreLecturersResponse;
      setLecturers([...lecturers, ...newLecturers]);
      setIsMore(isMoreLecturers);
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
      dataSource={lecturers}
      loadMore={isMore && loadMoreButton()}
      renderItem={(lecturer: Lecturer) => <ThesisLecturersListItem lecturer={lecturer} />}
    />
  );
};

export default ThesisLecturerList;
