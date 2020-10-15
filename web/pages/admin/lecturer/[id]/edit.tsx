import { Button, Card, Col, Form, Row } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';

import MainLayout from '../../../../components/Layout/MainLayout';
import LecturerFormItem from '../../../../components/Lecturer/LecturerFormItem';
import UserFormItem from '../../../../components/User/UserFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import LecturerClient from '../../../../libs/lecturer/lecturer.client';
import { LecturerRequestBody } from '../../../../libs/lecturer/lecturer.interface';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../../libs/lecturer/lecturer.resource';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  currentLecturer: LecturerRequestBody;
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const lecturerId: number = parseInt(router.query.id as string);
  const [form] = Form.useForm();

  const handleSubmitButton = async (formValues: LecturerRequestBody) => {
    const lecturerClient = new LecturerClient();

    try {
      await lecturerClient.updateById(lecturerId, formValues);
      await router.push(`${LECTURER_ADMIN_PATH_ROOT}/${lecturerId}`);
      setLoading(false);
    } catch (error) {
      await lecturerClient.requestErrorHandler(error);
    }
  };

  useEffect(() => {
    (async () => {
      let currentLecturer: LecturerRequestBody = null;
      const lecturerServer = new LecturerClient();
      try {
        currentLecturer = await lecturerServer.getInitialForEdit(params.id);
      } catch (error) {
        await lecturerServer.requestErrorHandler(error);
        return;
      }
      form.setFieldsValue(currentLecturer);
    })();
  }, [params]);

  return (
    <Card title="Sửa thông tin giảng viên">
      <Form
        // initialValues={currentLecturer}
        form={form}
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <Row>
          <Col span={12}>
            <UserFormItem isEdit={true} />
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
                <Button type="primary" danger size="large" onClick={router.back}>
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

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<CommonPageProps, PageParams> = async ({ params }) => {
  return {
    props: {
      params,
      title: 'Sửa thông tin giảng viên',
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [
        { text: 'Danh sách giảng viên', href: LECTURER_ADMIN_PATH_ROOT },
        {
          text: 'Chi tiết giảng viên',
          href: `${LECTURER_ADMIN_PATH_ROOT}/${params.id}`
        },
        { text: 'Sửa thông tin giảng viên' }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    },
    revalidate: 1
  };
};

Edit.Layout = MainLayout;

export default Edit;
