import { Button, Card, Form, Space } from 'antd';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import MainLayout from '../../components/Layout/MainLayout';
import ThesisAttendeesSelectFormItem from '../../components/Thesis/ThesisAttendeesSelectFormItem';
import ThesisFormItem from '../../components/Thesis/ThesisFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../libs/common/common.interface';
import { SIDER_KEYS } from '../../libs/common/common.resource';
import { ThesisRequestBody } from '../../libs/thesis/thesis.interface';
import { THESIS_PATH_ROOT, ThesisAttendeeTarget } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import { UserType } from '../../libs/user/user.resource';

const Create: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async (formValues: ThesisRequestBody) => {
    setLoading(true);
    const thesisService = ThesisService.getInstance();

    try {
      const { data } = await thesisService.createThesis(
        thesisService.formatThesisRequestBody(formValues)
      );
      alert(`Tạo khóa luận thành công: ${data.id}`);
    } catch (error) {
      await thesisService.requestErrorHandler(error);
    }
    setLoading(false);
  };

  return (
    <Card title="Tạo khóa luận">
      <Form requiredMark={true} layout="vertical" onFinish={handleSubmitButton}>
        <Space size={100} align="start">
          <ThesisFormItem />
          <Space direction="vertical">
            <ThesisAttendeesSelectFormItem attendeeTarget={ThesisAttendeeTarget.LECTURER} />
            <ThesisAttendeesSelectFormItem attendeeTarget={ThesisAttendeeTarget.STUDENT} />
            <Space size="large">
              <Button htmlType="submit" type="primary" size="large" loading={loading}>
                Xác nhận
              </Button>
              <Button type="primary" danger size="large" onClick={router.back} disabled={loading}>
                Hủy
              </Button>
            </Space>
          </Space>
        </Space>
      </Form>
    </Card>
  );
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: 'Tạo khóa luận',
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: 'Danh sách khóa luận', href: THESIS_PATH_ROOT },
        { text: 'Tạo khóa luận' }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Create.Layout = MainLayout;

export default Create;
