import { Empty } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { ReportModule } from '../../../../libs/common/common.resource';
import ReviewService from '../../../../libs/review/review.service';
import { Thesis } from '../../../../libs/thesis/thesis.type';
import TextData from '../../../Common/TextData';
import LecturerFastView from '../../../Lecturer/LecturerFastView';
import StateBaseInfo from '../StateBaseInfo';
import ReviewEdit from './ReviewEdit';
import ReviewerButton from './ReviewerButton';
import ReviewResult from './ReviewResult';

interface ComponentProps {
  topicId: number;
  thesis: Thesis;
  canFetch: boolean;
}

const ReviewInfo: React.FC<ComponentProps> = ({ topicId, thesis, canFetch }) => {
  const reviewService = ReviewService.getInstance();
  const { data } = reviewService.useReview(topicId, canFetch);
  const validDateRange: [string | Moment, string | Moment] = [thesis.progressReport, thesis.review];

  if (!data) {
    return <Empty description={ReviewTerminology.REVIEW_4} />;
  }

  return (
    <StateBaseInfo
      module={ReportModule.REVIEW}
      stateInfo={data.review}
      adminButton={
        <ReviewEdit
          thesisId={thesis.id}
          review={data.review}
          validDateRange={validDateRange}
          thesisCreatorId={thesis.creatorId}
        />
      }
      extendInfo={[
        {
          label: ReviewTerminology.REVIEW_5,
          element: data.review.reviewerView ? (
            <LecturerFastView lecturer={data.review.reviewerView} />
          ) : (
            <TextData />
          )
        },
        {
          label: ReviewTerminology.REVIEW_1,
          element: <ReviewResult result={data.review.result} />
        }
      ]}
      extra={<ReviewerButton review={data.review} />}
    />
  );
};

export default ReviewInfo;
