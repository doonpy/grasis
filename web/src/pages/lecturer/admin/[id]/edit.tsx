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
import CommonService from '../../../../libs/common/common.service';
import LecturerAdminService from '../../../../libs/lecturer/admin.service';
import { LecturerForm } from '../../../../libs/lecturer/lecturer.interface';
import {
  LECTURER_ADMIN_PATH_ROOT,
  LecturerPath
} from '../../../../libs/lecturer/lecturer.resource';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ params }) => {
  const router = useRouter();
  const adminService = LecturerAdminService.getInstance();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const lecturerId = parseInt(router.query.id as string);
  const [form] = Form.useForm();

  const handleSubmitButton = async (formValues: LecturerForm) => {
    setSubmitLoading(true);
    try {
      await adminService.updateById(lecturerId, formValues);
      await router.push(`${LECTURER_ADMIN_PATH_ROOT}/${lecturerId}`);
    } catch (error) {
      await adminService.requestErrorHandler(error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    (async () => {
      let initForm: LecturerForm = {};
      try {
        initForm = await adminService.getInitialForEdit(lecturerId);
        setContentLoading(false);
      } catch (error) {
        await adminService.requestErrorHandler(error);
        return;
      }

      form.setFieldsValue(initForm);
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
            <UserFormItem isEdit={true} userType={UserType.LECTURER} userId={lecturerId} />
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
          href: CommonService.getInstance().replaceParams(LecturerPath.SPECIFY, [
            (params && params.id) || NaN
          ])
        },
        { text: 'Sửa thông tin giảng viên' }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Edit.Layout = MainLayout;

export default Edit;
