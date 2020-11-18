import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Modal, Space } from 'antd';
import React, { ChangeEvent, useState } from 'react';

import CheckCircleIcon from '../../../../assets/svg/regular/check-circle.svg';
import EditIcon from '../../../../assets/svg/regular/edit.svg';
import MinusCircleIcon from '../../../../assets/svg/regular/minus-circle.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { ReviewTerminology } from '../../../../assets/terminology/review.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import { ReviewResultText } from '../../../../libs/review/review.resource';
import ReviewService from '../../../../libs/review/review.service';
import { StateResult } from '../../../../libs/topic/topic-state/topic-state.resource';
const { confirm } = Modal;

interface ComponentProps {
  topicId: number;
}

const ReviewChangeResult: React.FC<ComponentProps> = ({ topicId }) => {
  const reviewService = ReviewService.getInstance();
  const [reviewerComment, setReviewerComment] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onClickEditButton = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onCommentChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
    setReviewerComment(value);
  };

  const onClickChangeResult = async (result: StateResult) => {
    confirm({
      title: ReviewTerminology.REVIEW_6,
      icon: <ExclamationCircleOutlined />,
      okText: CommonTerminology.COMMON_9,
      cancelText: CommonTerminology.COMMON_10,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          setLoading(true);
          await reviewService.changeResult(topicId, result, reviewerComment);
          message.success(TopicTerminology.TOPIC_61);
          setReviewerComment('');
          setLoading(false);
        } catch (error) {
          setLoading(false);
          await reviewService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <>
      <Drawer
        title={ReviewTerminology.REVIEW_14}
        width={720}
        onClose={handleCancel}
        visible={visible}>
        <Form requiredMark={true} layout="vertical">
          <Form.Item label={<b>{ReviewTerminology.REVIEW_15}</b>}>
            <Input.TextArea rows={10} onChange={onCommentChange} value={reviewerComment} />
          </Form.Item>
          <Space>
            <Button loading={loading} onClick={handleCancel}>
              {CommonTerminology.COMMON_10}
            </Button>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={CheckCircleIcon} />}
              onClick={() => onClickChangeResult(StateResult.TRUE)}>
              {ReviewResultText[StateResult.TRUE]}
            </Button>
            <Button
              loading={loading}
              type="primary"
              icon={<Icon component={MinusCircleIcon} />}
              onClick={() => onClickChangeResult(StateResult.FALSE)}
              danger>
              {ReviewResultText[StateResult.FALSE]}
            </Button>
          </Space>
        </Form>
      </Drawer>
      <Button type="primary" icon={<Icon component={EditIcon} />} onClick={onClickEditButton}>
        {ReviewTerminology.REVIEW_14}
      </Button>
    </>
  );
};

export default ReviewChangeResult;
