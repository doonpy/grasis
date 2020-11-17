import { Empty } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ReviewService from '../../../../libs/review/review.service';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
import TextData from '../../../Common/TextData';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import StateBaseInfo from '../StateBaseInfo';
import ReviewEdit from './ReviewEdit';
import ReviewerButton from './ReviewerButton';
import ReviewResult from './ReviewResult';

interface ComponentProps {
  topicId: number;
  thesis: ThesisForView;
  canFetch: boolean;
}

const ReviewInfo: React.FC<ComponentProps> = ({ topicId, thesis, canFetch }) => {
  const reviewService = ReviewService.getInstance();
  const { data: reviewData } = reviewService.useReview(topicId, canFetch);

  if (!reviewData) {
    return <Empty description={ReviewTerminology.REVIEW_4} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [thesis.progressReport, thesis.review];

  return (
    <StateBaseInfo
      module={ReportModule.REVIEW}
      stateInfo={reviewData.review}
      adminButton={
        <ReviewEdit
          thesisId={thesis.id}
          review={reviewData.review}
          validDateRange={validDateRange}
          thesisCreatorId={thesis.creatorId}
        />
      }
      extendInfo={[
        {
          label: ReviewTerminology.REVIEW_5,
          element: reviewData.review.reviewerView ? (
            <LecturerFastView lecturer={reviewData.review.reviewerView} />
          ) : (
            <TextData />
          )
        },
        {
          label: ReviewTerminology.REVIEW_1,
          element: <ReviewResult result={reviewData.review.result} />
        }
      ]}
      extra={<ReviewerButton review={reviewData.review} />}
    />
  );
};

export default ReviewInfo;
