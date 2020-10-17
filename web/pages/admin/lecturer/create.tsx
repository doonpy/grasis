import { Button, Card, Col, Form, Row } from 'antd';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import MainLayout from '../../../components/Layout/MainLayout';
import LecturerFormItem from '../../../components/Lecturer/LecturerFormItem';
import UserFormItem from '../../../components/User/UserFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import { StudentRequestBody } from '../../../libs/lecturer/lecturer.interface';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../libs/lecturer/lecturer.resource';
import LecturerService from '../../../libs/lecturer/lecturer.service';
import { UserType } from '../../../libs/user/user.resource';

const Create: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async (formValues: StudentRequestBody) => {
    setLoading(true);
    const lecturerService = LecturerService.getInstance();
    try {
      const { data } = await lecturerService.createLecturer(formValues);
      await lecturerService.redirectService.redirectTo(`${LECTURER_ADMIN_PATH_ROOT}/${data.id}`);
      return;
    } catch (error) {
      await lecturerService.requestErrorHandler(error);
    }
    setLoading(false);
  };

  return (
    <Card title="Thêm giảng viên">
      <Form
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <Row>
          <Col span={12}>
            <UserFormItem isEdit={false} />
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
      title: 'Thêm giảng viên',
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [
        { text: 'Danh sách giảng viên', href: LECTURER_ADMIN_PATH_ROOT },
        { text: 'Thêm giảng viên' }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Create.Layout = MainLayout;

export default Create;
