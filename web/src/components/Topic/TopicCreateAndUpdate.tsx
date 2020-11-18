import Icon, { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';

import EditIcon from '../../assets/svg/regular/edit.svg';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { TopicPath } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import { TopicForView, TopicRequestBody } from '../../libs/topic/topic.type';
import TopicFormItem from './TopicFormItem';

interface ComponentProps {
  thesisId: number;
  topic?: TopicForView;
}

const TopicCreateAndUpdate: React.FC<ComponentProps> = ({ thesisId, topic }) => {
  const topicService = TopicService.getInstance();
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

  const handleSubmitButton = async (formValues: TopicRequestBody) => {
    try {
      setLoading(true);
      if (topic) {
        await topicService.updateById(topic.id, formValues);
        message.success(TopicTerminology.TOPIC_68);
        setVisible(false);
        setLoading(false);
      } else {
        const {
          data: { id }
        } = await topicService.create(thesisId, formValues);
        message.success(TopicTerminology.TOPIC_67);
        await topicService.redirectService.redirectTo(
          topicService.replaceParams(TopicPath.SPECIFY, [thesisId, id])
        );
      }
    } catch (error) {
      await topicService.requestErrorHandler(error);
      setLoading(false);
    }
  };

  if (topic) {
    useEffect(() => {
      if (!visible) {
        form.setFieldsValue(topic);
      }
    }, [topic]);
  }

  return (
    <>
      <Drawer
        title={topic ? TopicTerminology.TOPIC_16 : TopicTerminology.TOPIC_1}
        width={720}
        onClose={handleCancel}
        visible={visible}>
        <Form form={form} requiredMark={true} layout="vertical" onFinish={handleSubmitButton}>
          <TopicFormItem />
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
      <Button
        type="primary"
        icon={topic ? <Icon component={EditIcon} /> : <PlusOutlined />}
        onClick={onClickEditButton}>
        {topic ? TopicTerminology.TOPIC_16 : TopicTerminology.TOPIC_1}
      </Button>
    </>
  );
};

export default TopicCreateAndUpdate;
