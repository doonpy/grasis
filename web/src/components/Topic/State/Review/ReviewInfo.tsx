import { Alert, Empty, Space, Spin } from 'antd';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { ReportModule, ResultModule } from '../../../../libs/common/common.resource';
import ReviewService from '../../../../libs/review/review.service';
import { ReviewForView } from '../../../../libs/review/review.type';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import { TopicForView } from '../../../../libs/topic/topic.type';
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
  const { data, isLoading } = reviewService.useReview(topic.id, canFetch);
  const [review, setReview] = useState<ReviewForView | undefined>(data ? data.review : undefined);
  useEffect(() => {
    if (data) {
      setReview(data.review);
    }
  }, [data]);

  if (isLoading) {
    return <Spin />;
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
      extendInfo={[
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
        },
        {
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
        }
      ]}
      canFetch={canFetch}
      canUpload={canModifyUploadReport}
      canDelete={canModifyUploadReport}
    />
  );
};

export default ReviewInfo;
