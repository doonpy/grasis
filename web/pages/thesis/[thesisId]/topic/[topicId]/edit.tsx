import { Button, Card, Col, Form, Row, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';

import { ThesisTerminology } from '../../../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../../../assets/terminology/topic.terminology';
import MainLayout from '../../../../../components/Layout/MainLayout';
import TopicFormItem from '../../../../../components/Topic/TopicFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../../libs/common/common.resource';
import CommonService from '../../../../../libs/common/common.service';
import { THESIS_PATH_ROOT, ThesisPath } from '../../../../../libs/thesis/thesis.resource';
import { TopicRequestBody } from '../../../../../libs/topic/topic.interface';
import { TOPIC_PATH_ROOT, TopicPath } from '../../../../../libs/topic/topic.resource';
import TopicService from '../../../../../libs/topic/topic.service';
import { UserType } from '../../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId?: string;
  topicId?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ params }) => {
  const thesisId = parseInt(params.thesisId);
  const topicId = parseInt(params.topicId);
  const [loading, setLoading] = useState<boolean>(false);
  const [contentLoading, setContentLoading] = useState<boolean>(true);
  const topicService = TopicService.getInstance();
  const [form] = Form.useForm();

  const handleSubmitButton = async (formValues: TopicRequestBody) => {
    try {
      setLoading(true);
      const {
        data: { id }
      } = await topicService.updateById(thesisId, topicId, formValues);
      await topicService.redirectService.redirectTo(
        topicService.replaceParams(TopicPath.SPECIFY, [thesisId, id])
      );
    } catch (error) {
      await topicService.requestErrorHandler(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const topicForEdit = await topicService.getInitialForEdit(thesisId, topicId);
        form.setFieldsValue(topicForEdit);
        setContentLoading(false);
      } catch (error) {
        await topicService.requestErrorHandler(error);
      }
    })();
  }, []);

  return (
    <Card title={TopicTerminology.TOPIC_16} loading={contentLoading}>
      <Form
        form={form}
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <TopicFormItem />
        <Row>
          <Col offset={10}>
            <Space size="large">
              <Button htmlType="submit" type="primary" size="large" loading={loading}>
                Xác nhận
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                onClick={useRouter().back}
                disabled={loading}>
                Hủy
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<CommonPageProps, PageParams> = async ({ params }) => {
  const commonService = CommonService.getInstance();
  const { topicId, thesisId } = params;

  return {
    props: {
      params,
      title: TopicTerminology.TOPIC_16,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        {
          text: ThesisTerminology.THESIS_4,
          href: commonService.replaceParams(ThesisPath.SPECIFY, [thesisId])
        },
        { text: TopicTerminology.TOPIC_6, href: TOPIC_PATH_ROOT },
        {
          text: TopicTerminology.TOPIC_11,
          href: commonService.replaceParams(TopicPath.SPECIFY, [thesisId, topicId])
        },
        { text: TopicTerminology.TOPIC_16 }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Edit.Layout = MainLayout;

export default Edit;
