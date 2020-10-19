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
import AdminLecturerService from '../../../../libs/lecturer/admin/admin.lecturer.service';
import { StudentRequestBody } from '../../../../libs/lecturer/lecturer.interface';
import { LECTURER_ADMIN_PATH_ROOT } from '../../../../libs/lecturer/lecturer.resource';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  currentLecturer: StudentRequestBody;
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ params }) => {
  const router = useRouter();
  const adminLecturerService = AdminLecturerService.getInstance();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const lecturerId = parseInt(router.query.id as string);
  const [form] = Form.useForm();

  const handleSubmitButton = async (formValues: StudentRequestBody) => {
    setSubmitLoading(true);
    try {
      await adminLecturerService.updateById(lecturerId, formValues, true);
      await router.push(`${LECTURER_ADMIN_PATH_ROOT}/${lecturerId}`);
    } catch (error) {
      await adminLecturerService.requestErrorHandler(error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    (async () => {
      let currentLecturer: StudentRequestBody = null;
      try {
        currentLecturer = await adminLecturerService.getInitialForEdit(lecturerId, true);
        setContentLoading(false);
      } catch (error) {
        await adminLecturerService.requestErrorHandler(error);
        return;
      }
      form.setFieldsValue(currentLecturer);
    })();
  }, [params]);

  return (
    <Card title="Sửa thông tin giảng viên" loading={contentLoading}>
      <Form
        form={form}
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <Row>
          <Col span={12}>
            <UserFormItem isEdit={true} userType={UserType.LECTURER} />
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
                  loading={submitLoading}>
                  Xác nhận
                </Button>
                <Button
                  type="primary"
                  danger
                  size="large"
                  onClick={router.back}
                  disabled={submitLoading}>
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
