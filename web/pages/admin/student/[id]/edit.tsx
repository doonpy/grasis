import { Button, Card, Col, Form, Row } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';

import MainLayout from '../../../../components/Layout/MainLayout';
import StudentFormItem from '../../../../components/Student/StudentFormItem';
import UserFormItem from '../../../../components/User/UserFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import AdminStudentService from '../../../../libs/student/admin/admin.student.service';
import { StudentRequestBody } from '../../../../libs/student/student.interface';
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
  const adminStudentService = AdminStudentService.getInstance();
  const [loading, setLoading] = useState(false);
  const studentId: number = parseInt(router.query.id as string);
  const [form] = Form.useForm();

  const handleSubmitButton = async (formValues: StudentRequestBody) => {
    setLoading(true);
    try {
      await adminStudentService.updateById(studentId, formValues);
      await router.push(`${STUDENT_ADMIN_PATH_ROOT}/${studentId}`);
    } catch (error) {
      await adminStudentService.requestErrorHandler(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      let currentStudent: StudentRequestBody = null;
      try {
        currentStudent = await adminStudentService.getInitialForEdit(params.id);
      } catch (error) {
        await adminStudentService.requestErrorHandler(error);
        return;
      }
      form.setFieldsValue(currentStudent);
    })();
  }, [params]);

  return (
    <Card title="Sửa thông tin sinh viên">
      <Form
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
            <StudentFormItem />
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
      title: 'Sửa thông tin sinh viên',
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        { text: 'Danh sách sinh viên', href: STUDENT_ADMIN_PATH_ROOT },
        {
          text: 'Chi tiết sinh viên',
          href: `${STUDENT_ADMIN_PATH_ROOT}/${params.id}`
        },
        { text: 'Sửa thông tin sinh viên' }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    },
    revalidate: 1
  };
};

Edit.Layout = MainLayout;

export default Edit;