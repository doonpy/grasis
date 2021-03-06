import { Alert, Empty, Space, Spin } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { ReportModule, ResultModule } from '../../../../libs/common/common.resource';
import ProgressReportService from '../../../../libs/progress-report/progress-report.service';
import ReviewService from '../../../../libs/review/review.service';
import { ReviewForView } from '../../../../libs/review/review.type';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import { TopicForView } from '../../../../libs/topic/topic.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import TextData from '../../../Common/TextData';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import UploadViewResult from '../../../Upload/UploadViewResult';
import StateBaseInfo from '../StateBaseInfo';
import ReviewChangeResult from './ReviewChangeResult';
import ReviewEdit from './ReviewEdit';
import ReviewResult from './ReviewResult';

interface ComponentProps {
  topic: TopicForView;
  thesis: ThesisForView;
  canFetch: boolean;
}

const ReviewInfo: React.FC<ComponentProps> = ({ topic, thesis, canFetch }) => {
  const reviewService = ReviewService.getInstance();
  const progressReportService = ProgressReportService.getInstance();
  const {
    data: progressReportResultData,
    isLoading: progressReportResultLoading
  } = progressReportService.useProgressReportResult(topic.id, canFetch);
  const { data: reviewData, isLoading: reviewLoading } = reviewService.useReview(
    topic.id,
    canFetch && progressReportResultData && progressReportResultData.result === StateResult.TRUE
  );
  const [review, setReview] = useState<ReviewForView | undefined>(
    reviewData ? reviewData.review : undefined
  );
  useEffect(() => {
    if (reviewData) {
      setReview(reviewData.review);
    }
  }, [reviewData]);

  if (reviewLoading && progressReportResultLoading) {
    return <Spin />;
  }

  if (progressReportResultData && progressReportResultData.result !== StateResult.TRUE) {
    return <Empty description={ReviewTerminology.REVIEW_18} />;
  }

  if (!review) {
    return <Empty description={ReviewTerminology.REVIEW_4} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [thesis.progressReport, thesis.review];
  const loginUser = LoginUser.getInstance();
  const canModifyUploadResult =
    review.reviewerId === loginUser.getId() &&
    thesis.state === ThesisState.REVIEW &&
    review.result === StateResult.NOT_DECIDED;
  const canModifyUploadReport =
    loginUser.isStudent() &&
    thesis.state === ThesisState.REVIEW &&
    review.reporters.findIndex(({ id }) => id === loginUser.getId()) !== -1 &&
    review.result === StateResult.NOT_DECIDED;
  const extendInfo = [
    {
      label: ReviewTerminology.REVIEW_5,
      element: review.reviewer ? <LecturerFastView lecturer={review.reviewer} /> : <TextData />
    },

    {
      label: ReviewTerminology.REVIEW_12,
      element: <TextData text={review.reviewerComment} isParagraph={true} />
    },
    {
      label: ReviewTerminology.REVIEW_1,
      element: <ReviewResult result={review.result} />
    }
  ];
  if (!loginUser.isStudent()) {
    extendInfo.push({
      label: ReviewTerminology.REVIEW_13,
      element: (
        <>
          <Alert message={ReviewTerminology.REVIEW_16} type="info" showIcon />
          <UploadViewResult
            module={ResultModule.REVIEW}
            topicId={topic.id}
            canUpload={canModifyUploadResult}
            canDelete={canModifyUploadResult}
            canFetch={canFetch}
          />
        </>
      )
    });
  }

  return (
    <StateBaseInfo
      module={ReportModule.REVIEW}
      stateInfo={review}
      buttons={
        <Space>
          {review.result === StateResult.NOT_DECIDED && (
            <ReviewEdit
              thesisId={thesis.id}
              review={review}
              setReview={setReview}
              validDateRange={validDateRange}
              thesisCreatorId={thesis.creatorId}
            />
          )}
          {thesis.state === ThesisState.REVIEW &&
            review.reviewerId === loginUser.getId() &&
            review.result === StateResult.NOT_DECIDED && (
              <ReviewChangeResult review={review} setReview={setReview} />
            )}
        </Space>
      }
      extendInfo={extendInfo}
      canFetch={canFetch}
      canUpload={canModifyUploadReport}
      canDelete={canModifyUploadReport}
    />
  );
};

export default ReviewInfo;
