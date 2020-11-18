import { ReviewTerminology } from '../../assets/terminology/review.terminology';

const REVIEW_API_ROOT = 'reviews';

const REVIEW_ADMIN_API_ROOT = 'admin/reviews';

export const ReviewApi = {
  ADMIN_SPECIFY: `${REVIEW_ADMIN_API_ROOT}/@0`,
  CHANGE_RESULT: `${REVIEW_API_ROOT}/@0/change-result`,
  SPECIFY: `${REVIEW_API_ROOT}/@0`
};

export const ReviewResultText = [
  '',
  ReviewTerminology.REVIEW_9,
  ReviewTerminology.REVIEW_7,
  ReviewTerminology.REVIEW_8
];

export const REVIEWER_ID_FIELD = 'reviewerId';
