import { Button, List, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { ThesisLecturer } from '../../libs/thesis/thesis-lecturer/thesis-lecturer.interface';
import { ThesisLoadMoreLecturersResponse } from '../../libs/thesis/thesis.interface';
import { LoadMoreTarget } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import ThesisLecturersListItem from './ThesisLectureItem';

interface ComponentPros {
  thesisId: number;
  initLecturers: ThesisLecturer[];
  initIsMore: boolean;
}

const ThesisLecturerList: React.FC<ComponentPros> = ({ initLecturers, initIsMore, thesisId }) => {
  const [isMore, setIsMore] = useState<boolean>(initIsMore);
  const [lecturers, setLecturers] = useState<ThesisLecturer[]>(initLecturers);
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

  useEffect(() => {
    setLecturers(initLecturers);
    setIsMore(initIsMore);
  }, [initLecturers]);

  return (
    <List
      loading={loadMoreLoading}
      itemLayout="horizontal"
      dataSource={lecturers}
      loadMore={isMore && loadMoreButton()}
      renderItem={(lecturer: ThesisLecturer) => (
        <ThesisLecturersListItem thesisLecturer={lecturer} />
      )}
      rowKey={(record: ThesisLecturer) => record.lecturerId.toString()}
    />
  );
};

export default ThesisLecturerList;
