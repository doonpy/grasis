import { Button, Card, Col, Form, Row, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import { ThesisTerminology } from '../../../../assets/terminology/thesis.terminology';
import { TopicTerminology } from '../../../../assets/terminology/topic.terminology';
import MainLayout from '../../../../components/Layout/MainLayout';
import TopicFormItem from '../../../../components/Topic/TopicFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import { THESIS_PATH_ROOT, ThesisPath } from '../../../../libs/thesis/thesis.resource';
import ThesisService from '../../../../libs/thesis/thesis.service';
import { TopicRequestBody } from '../../../../libs/topic/topic.interface';
import { TopicPath } from '../../../../libs/topic/topic.resource';
import TopicService from '../../../../libs/topic/topic.service';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId?: string;
}

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const { thesisId } = params;
  const [loading, setLoading] = useState(false);
  const topicService = TopicService.getInstance();

  const handleSubmitButton = async (formValues: TopicRequestBody) => {
    formValues.thesisId = parseInt(thesisId);
    try {
      setLoading(true);
      const {
        data: { id }
      } = await topicService.create(formValues);
      await topicService.redirectService.redirectTo(
        topicService.replaceParams(TopicPath.SPECIFY, [thesisId, id])
      );
    } catch (error) {
      await topicService.requestErrorHandler(error);
      setLoading(false);
    }
  };

  return (
    <Card title={TopicTerminology.TOPIC_1}>
      <Form
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
  const thesisService = ThesisService.getInstance();
  return {
    props: {
      params,
      title: TopicTerminology.TOPIC_1,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        {
          text: ThesisTerminology.THESIS_4,
          href: thesisService.replaceParams(ThesisPath.SPECIFY, [params.thesisId])
        },
        { text: TopicTerminology.TOPIC_1 }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
