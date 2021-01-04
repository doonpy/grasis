import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Comment, Input, message, Modal } from 'antd';
import React, { ChangeEvent, useState } from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView } from '../../libs/topic/topic.type';
import { TopicStateAction } from '../../libs/topic/topic-state/topic-state.resource';
import { TopicStateForView } from '../../libs/topic/topic-state/topic-state.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import AvatarForComment from '../Avatar/AvatarForComment';
import TopicChangeStatusButtonForApprover from './TopicChangeStatusButtonForApprover';
import TopicChangeStatusButtonForCreator from './TopicChangeStatusButtonForCreator';
const { confirm } = Modal;

interface ComponentProps {
  topic: TopicForView;
  setStates: React.Dispatch<TopicStateForView[]>;
  currentState: TopicStateAction;
  setCurrentState: React.Dispatch<TopicStateAction>;
}

const TopicChangeStatus: React.FC<ComponentProps> = ({
  topic: {
    id,
    approver: { id: approverId },
    creator: { id: creatorId }
  },
  setStates,
  currentState,
  setCurrentState
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
          const { data } = await topicService.changeStatus(id, action, note);
          setStates([...data.states]);
          setNote('');
          const lastState = data.states.pop();
          if (lastState) {
            setCurrentState(lastState.action);
          }

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
    if (creatorStatuses.includes(currentState)) {
      return <TopicChangeStatusButtonForCreator onButtonClick={onButtonClick} />;
    }

    if (currentState === TopicStateAction.SEND_REQUEST) {
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
