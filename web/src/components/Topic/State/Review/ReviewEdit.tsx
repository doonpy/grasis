import Icon from '@ant-design/icons';
import { Button, Drawer, Form, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import EditIcon from '../../../../assets/svg/regular/edit.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import ReviewAdminService from '../../../../libs/review/admin.service';
import { REVIEWER_ID_FIELD } from '../../../../libs/review/review.resource';
import { ReviewForView, ReviewRequestBody } from '../../../../libs/review/review.type';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import ThesisSelectLecturerInThesis from '../../../Thesis/ThesisSelectLecturerInThesis';
import StateEditBaseItem from '../StateEditBaseItem';

interface ComponentProps {
  thesisId: number;
  review: ReviewForView;
  validDateRange: [string | Moment, string | Moment];
  thesisCreatorId: number;
}

const ReviewEdit: React.FC<ComponentProps> = ({
  thesisId,
  review,
  validDateRange,
  thesisCreatorId
}) => {
  const adminService = ReviewAdminService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();
  const onClickEditButton = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFormSubmit = async (formValues: ReviewRequestBody) => {
    setLoading(true);
    try {
      await adminService.updateById(review.id, formValues);
      message.success(ReviewTerminology.REVIEW_11);
      setLoading(false);
      setVisible(false);
    } catch (error) {
      setLoading(false);
      await adminService.requestErrorHandler(error);
    }
  };

  useEffect(() => {
    if (!visible) {
      review.time = moment(review.time);
      form.setFieldsValue(review);
    }
  }, [review]);

  if (
    !loginUser.isAdmin() ||
    loginUser.getId() !== thesisCreatorId ||
    review.result !== StateResult.NOT_DECIDED
  ) {
    return <></>;
  }

  return (
    <>
      <Drawer
        title={ReviewTerminology.REVIEW_2}
        width={720}
        onClose={handleCancel}
        visible={visible}>
        <Form form={form} requiredMark={true} layout="vertical" onFinish={onFormSubmit}>
          <StateEditBaseItem validDateRange={validDateRange} />
          <ThesisSelectLecturerInThesis
            thesisId={thesisId}
            fieldName={REVIEWER_ID_FIELD}
            defaultValue={review.reviewer}
            label={ReviewTerminology.REVIEW_5}
          />
          <Space size="middle">
            <Button loading={loading} onClick={handleOk} type="primary">
              {CommonTerminology.COMMON_9}
            </Button>
            <Button loading={loading} onClick={handleCancel} type="primary" danger>
              {CommonTerminology.COMMON_10}
            </Button>
          </Space>
        </Form>
      </Drawer>
      <Button type="primary" icon={<Icon component={EditIcon} />} onClick={onClickEditButton}>
        {TopicTerminology.TOPIC_59}
      </Button>
    </>
  );
};

export default ReviewEdit;
