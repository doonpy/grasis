import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import CheckIcon from '../../assets/svg/regular/check.svg';
import MinusIcon from '../../assets/svg/regular/minus.svg';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicStudentStatus } from '../../libs/topic/topic-student/topic-student.resource';
import TopicStudentService from '../../libs/topic/topic-student/topic-student.service';
import { TopicStudentForView } from '../../libs/topic/topic-student/topic-student.type';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView } from '../../libs/topic/topic.type';

const { confirm } = Modal;

interface ComponentProps {
  topicStudent: TopicStudentForView;
  topic: TopicForView;
  setTopic: React.Dispatch<TopicForView>;
  topicStudents: TopicStudentForView[];
  setTopicStudents: React.Dispatch<TopicStudentForView[]>;
}

const TopicStudentRegisterAction: React.FC<ComponentProps> = ({
  topicStudent: { topicId, id, status },
  topic,
  setTopic,
  topicStudents,
  setTopicStudents
}) => {
  const [disableButton, setDisableButton] = useState<TopicStudentStatus>(status);
  const topicService = TopicService.getInstance();
  const topicStudentService = TopicStudentService.getInstance();

  const onConfirmChangeStudentRegisterStatus: (status: TopicStudentStatus) => void = (status) => {
    confirm({
      title:
        status === TopicStudentStatus.APPROVED
          ? TopicTerminology.TOPIC_49
          : TopicTerminology.TOPIC_50,
      icon: <ExclamationCircleOutlined />,
      okText: TopicTerminology.TOPIC_19,
      cancelText: TopicTerminology.TOPIC_20,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          const { data } = await topicService.changeStudentRegisterStatus(topicId, id, status);
          if (status === TopicStudentStatus.APPROVED) {
            topic.currentStudent++;
            setTopic(topic);
          }

          setTopicStudents(
            topicStudentService.updateItemInStudentList(topicStudents, data.student)
          );
          setDisableButton(status);
          message.success(TopicTerminology.TOPIC_43);
        } catch (error) {
          await topicService.requestErrorHandler(error);
        }
      }
    });
  };

  useEffect(() => {
    setDisableButton(status);
  }, [status]);

  return (
    <Space size="middle">
      <Button
        shape="circle"
        type="primary"
        icon={<Icon component={CheckIcon} />}
        onClick={() => onConfirmChangeStudentRegisterStatus(TopicStudentStatus.APPROVED)}
        disabled={disableButton !== TopicStudentStatus.PENDING}
      />
      <Button
        shape="circle"
        type="primary"
        icon={<Icon component={MinusIcon} />}
        danger
        onClick={() => onConfirmChangeStudentRegisterStatus(TopicStudentStatus.REJECTED)}
        disabled={disableButton !== TopicStudentStatus.PENDING}
      />
    </Space>
  );
};

export default TopicStudentRegisterAction;
