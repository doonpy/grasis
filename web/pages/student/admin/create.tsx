import { Button, Card, Col, Form, Row } from 'antd';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { StudentTerminology } from '../../../assets/terminology/student.terminology';
import MainLayout from '../../../components/Layout/MainLayout';
import StudentFormItem from '../../../components/Student/StudentFormItem';
import UserFormItem from '../../../components/User/UserFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import StudentAdminService from '../../../libs/student/admin.service';
import { StudentForm } from '../../../libs/student/student.interface';
import { STUDENT_ADMIN_PATH_ROOT } from '../../../libs/student/student.resource';
import { UserType } from '../../../libs/user/user.resource';

const Create: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async (formValues: StudentForm) => {
    setLoading(true);
    const adminService = StudentAdminService.getInstance();
    try {
      const { data } = await adminService.createStudent(formValues);
      await adminService.redirectService.redirectTo(`${STUDENT_ADMIN_PATH_ROOT}/${data.id}`);
      return;
    } catch (error) {
      await adminService.requestErrorHandler(error);
    }
    setLoading(false);
  };

  return (
    <Card title={StudentTerminology.STUDENT_2}>
      <Form
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmitButton}>
        <Row>
          <Col span={12}>
            <UserFormItem isEdit={false} userType={UserType.STUDENT} />
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

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
  return {
    props: {
      title: StudentTerminology.STUDENT_2,
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        { text: StudentTerminology.STUDENT_1, href: STUDENT_ADMIN_PATH_ROOT },
        { text: StudentTerminology.STUDENT_2 }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Create.Layout = MainLayout;

export default Create;
