import { Button, Card, Col, Form, Row } from 'antd';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { LecturerTerminology } from '../../../assets/terminology/lecturer.terminology';
import MainLayout from '../../../components/Layout/MainLayout';
import LecturerFormItem from '../../../components/Lecturer/LecturerFormItem';
import UserFormItem from '../../../components/User/UserFormItem';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.type';
import LecturerAdminService from '../../../libs/lecturer/admin.service';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../libs/lecturer/lecturer.resource';
import { LecturerForm } from '../../../libs/lecturer/lecturer.type';
import { UserType } from '../../../libs/user/user.resource';

const Create: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async (formValues: LecturerForm) => {
    setLoading(true);
    const adminService = LecturerAdminService.getInstance();
    try {
      const { data } = await adminService.createLecturer(formValues);
      await adminService.redirectService.redirectTo(`${LECTURER_ADMIN_PATH_ROOT}/${data.id}`);
    } catch (error) {
      await adminService.requestErrorHandler(error);
    }
    setLoading(false);
  };

  return (
    <Card title={LecturerTerminology.LECTURER_2}>
      <Form
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <Row>
          <Col span={12}>
            <UserFormItem isEdit={false} userType={UserType.LECTURER} />
          </Col>
          <Col span={12}>
            <LecturerFormItem />
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  style={{ marginRight: 30 }}
                  loading={loading}>
                  Xác nhận
                </Button>
                <Button type="primary" danger size="large" onClick={router.back} disabled={loading}>
                  Hủy
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: LecturerTerminology.LECTURER_2,
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [
        { text: LecturerTerminology.LECTURER_1, href: LECTURER_ADMIN_PATH_ROOT },
        { text: LecturerTerminology.LECTURER_2 }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Create.Layout = MainLayout;

export default Create;
