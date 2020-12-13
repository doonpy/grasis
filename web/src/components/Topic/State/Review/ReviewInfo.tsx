import { Empty, Space } from 'antd';
import { Moment } from 'moment';
import React from 'react';

import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { ReportModule, ResultModule } from '../../../../libs/common/common.resource';
import ReviewService from '../../../../libs/review/review.service';
import { ThesisState } from '../../../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../../../libs/thesis/thesis.type';
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
  const loginUser = LoginUser.getInstance();
  const canUpload = reviewData.review.reviewerId
    ? reviewData.review.reviewerId === loginUser.getId()
    : false;

  return (
    <StateBaseInfo
      module={ReportModule.REVIEW}
      stateInfo={reviewData.review}
      buttons={
        <Space>
          {reviewData.review.result === StateResult.NOT_DECIDED && (
            <ReviewEdit
              thesisId={thesis.id}
              review={reviewData.review}
              validDateRange={validDateRange}
              thesisCreatorId={thesis.creatorId}
            />
          )}
          {thesis.state === ThesisState.REVIEW &&
            reviewData.review.reviewerId === loginUser.getId() &&
            reviewData.review.result === StateResult.NOT_DECIDED && (
              <ReviewChangeResult topicId={topicId} />
            )}
        </Space>
      }
      extendInfo={[
        {
          label: ReviewTerminology.REVIEW_5,
          element: reviewData.review.reviewer ? (
            <LecturerFastView lecturer={reviewData.review.reviewer} />
          ) : (
            <TextData />
          )
        },

        {
          label: ReviewTerminology.REVIEW_12,
          element: <TextData text={reviewData.review.reviewerComment} isParagraph={true} />
        },
        {
          label: ReviewTerminology.REVIEW_1,
          element: <ReviewResult result={reviewData.review.result} />
        },
        {
          label: ReviewTerminology.REVIEW_13,
          element: (
            <UploadViewResult
              module={ResultModule.REVIEW}
              topicId={topicId}
              canUpload={canUpload}
              canFetch={canFetch}
            />
          )
        }
      ]}
      canFetch={canFetch}
    />
  );
};

export default ReviewInfo;
