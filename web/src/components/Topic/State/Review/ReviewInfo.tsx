import { Empty } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ReviewService from '../../../../libs/review/review.service';
import ThesisService from '../../../../libs/thesis/thesis.service';
import TextData from '../../../Common/TextData';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import StateBaseInfo from '../StateBaseInfo';
import ReviewEdit from './ReviewEdit';
import ReviewerButton from './ReviewerButton';
import ReviewResult from './ReviewResult';

interface ComponentProps {
  topicId: number;
  thesisId: number;
  canFetch: boolean;
}

const ReviewInfo: React.FC<ComponentProps> = ({ topicId, thesisId, canFetch }) => {
  const reviewService = ReviewService.getInstance();
  const thesisService = ThesisService.getInstance();
  const { data: thesisData } = thesisService.useThesis(thesisId, canFetch);
  const { data: reviewData } = reviewService.useReview(topicId, canFetch);

  if (!reviewData || !thesisData) {
    return <Empty description={ReviewTerminology.REVIEW_4} />;
  }

  const validDateRange: [string | Moment, string | Moment] = [
    thesisData.thesis.progressReport,
    thesisData.thesis.review
  ];

  return (
    <StateBaseInfo
      module={ReportModule.REVIEW}
      stateInfo={reviewData.review}
      adminButton={
        <ReviewEdit
          thesisId={thesisData.thesis.id}
          review={reviewData.review}
          validDateRange={validDateRange}
          thesisCreatorId={thesisData.thesis.creatorId}
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
