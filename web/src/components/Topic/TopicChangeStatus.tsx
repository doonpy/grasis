import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Comment, Input, message, Modal } from 'antd';
import React, { ChangeEvent, useState } from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView } from '../../libs/topic/topic.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import AvatarForComment from '../Avatar/AvatarForComment';
import TopicChangeStatusButtonForApprover from './TopicChangeStatusButtonForApprover';
import TopicChangeStatusButtonForCreator from './TopicChangeStatusButtonForCreator';
const { confirm } = Modal;

interface ComponentProps {
  thesisId: number;
  topic: TopicForView;
}

const TopicChangeStatus: React.FC<ComponentProps> = ({
  thesisId,
  topic: {
    id,
    approver: { id: approverId },
    creator: { id: creatorId },
    status
  }
}) => {
  const [note, setNote] = useState<string>('');
  const topicService = TopicService.getInstance();
  const loginUser = LoginUser.getInstance();

  const onNoteChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(value);
  };

  const onButtonClick: (action: TopicStateAction) => void = (action) => {
    confirm({
      title: TopicTerminology.TOPIC_31,
      icon: <ExclamationCircleOutlined />,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await topicService.changeStatus(thesisId, id, action, note);
          setNote('');
          message.success(TopicTerminology.TOPIC_44);
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  const creatorStatuses = [
    TopicStateAction.WITHDRAW,
    TopicStateAction.SEND_BACK,
    TopicStateAction.NEW
  ];
  const buttonsRender = () => {
    if (creatorStatuses.includes(status)) {
      return <TopicChangeStatusButtonForCreator onButtonClick={onButtonClick} />;
    }

    if (status === TopicStateAction.SEND_REQUEST) {
      if (loginUser.getId() === approverId) {
        return <TopicChangeStatusButtonForApprover onButtonClick={onButtonClick} />;
      }

      if (loginUser.getId() === creatorId) {
        return (
          <TopicChangeStatusButtonForCreator onButtonClick={onButtonClick} withdrawOnly={true} />
        );
      }
    }
  };

  return (
    <Comment
      avatar={
        <AvatarForComment
          id={loginUser.getId()}
          firstname={loginUser.getFirstname()}
          lastname={loginUser.getLastname()}
        />
      }
      content={
        <div>
          <Input.TextArea
            placeholder={TopicTerminology.TOPIC_21}
            value={note}
            rows={4}
            onChange={onNoteChange}
          />
          <br />
          <br />
          {buttonsRender()}
        </div>
      }
    />
  );
};

export default TopicChangeStatus;
