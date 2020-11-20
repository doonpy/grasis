const COUNCIL_API_ADMIN_ROOT = `/admin/councils`;

export const CouncilApi = {
  ADMIN_GET_MANY_BY_THESIS_ID: `${COUNCIL_API_ADMIN_ROOT}?offset=@0&keyword=@1&thesisId=@2`,
  ADMIN_SPECIFY: `${COUNCIL_API_ADMIN_ROOT}/@0`
};

export const CouncilRequestBodyField = {
  CHAIRMAN_ID: 'chairmanId',
  INSTRUCTOR_ID: 'instructorId',
  COMMISSIONER_ID: 'commissionerId'
};
