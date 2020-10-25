import { Button, Card, Form, Space } from 'antd';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import ThesisTerminology from '../../../assets/terminology/thesis.terminology';
import MainLayout from '../../../components/Layout/MainLayout';
import ThesisAttendeesSelectFormItem from '../../../components/Thesis/ThesisAttendeesSelectFormItem';
import ThesisFormItem from '../../../components/Thesis/ThesisFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import ThesisAdminService from '../../../libs/thesis/admin.service';
import { ThesisRequestBody } from '../../../libs/thesis/thesis.interface';
import { THESIS_PATH_ROOT, ThesisAttendeeTarget } from '../../../libs/thesis/thesis.resource';
import { UserType } from '../../../libs/user/user.resource';

const Create: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async (formValues: ThesisRequestBody) => {
    setLoading(true);
    const adminService = ThesisAdminService.getInstance();

    try {
      const { data } = await adminService.createThesis(
        adminService.formatThesisRequestBody(formValues)
      );
      await adminService.redirectService.redirectTo(`${THESIS_PATH_ROOT}/${data.id}`);
    } catch (error) {
      await adminService.requestErrorHandler(error);
    }
    setLoading(false);
  };

  return (
    <Card title={ThesisTerminology.THESIS_25}>
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
      title: ThesisTerminology.THESIS_25,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        { text: ThesisTerminology.THESIS_25 }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Create.Layout = MainLayout;

export default Create;
