import { Button, Card, Col, Form, Row } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';

import StudentTerminology from '../../../../assets/terminology/student.terminology';
import MainLayout from '../../../../components/Layout/MainLayout';
import StudentFormItem from '../../../../components/Student/StudentFormItem';
import UserFormItem from '../../../../components/User/UserFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import StudentAdminService from '../../../../libs/student/admin.service';
import { StudentForm, StudentRequestBody } from '../../../../libs/student/student.interface';
import { STUDENT_ADMIN_PATH_ROOT } from '../../../../libs/student/student.resource';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  currentStudent: StudentRequestBody;
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ params }) => {
  const router = useRouter();
  const adminService = StudentAdminService.getInstance();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const studentId: number = parseInt(params.id as string);
  const [form] = Form.useForm();

  const handleSubmitButton = async (formValues: StudentForm) => {
    setSubmitLoading(true);
    try {
      await adminService.updateById(studentId, formValues);
      await adminService.redirectService.redirectTo(`${STUDENT_ADMIN_PATH_ROOT}/${studentId}`);
    } catch (error) {
      await adminService.requestErrorHandler(error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    (async () => {
      let currentStudent: StudentRequestBody = null;
      try {
        currentStudent = await adminService.getInitialForEdit(studentId);
        setContentLoading(false);
      } catch (error) {
        await adminService.requestErrorHandler(error);
        return;
      }
      form.setFieldsValue(currentStudent);
    })();
  }, [params]);

  return (
    <Card title={StudentTerminology.STUDENT_12} loading={contentLoading}>
      <Form
        form={form}
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <Row>
          <Col span={12}>
            <UserFormItem isEdit={true} userType={UserType.STUDENT} />
          </Col>
          <Col span={12}>
            <StudentFormItem />
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
      title: StudentTerminology.STUDENT_12,
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        { text: StudentTerminology.STUDENT_1, href: STUDENT_ADMIN_PATH_ROOT },
        {
          text: StudentTerminology.STUDENT_7,
          href: `${STUDENT_ADMIN_PATH_ROOT}/${params.id}`
        },
        { text: StudentTerminology.STUDENT_12 }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    },
    revalidate: 1
  };
};

Edit.Layout = MainLayout;

export default Edit;
