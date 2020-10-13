import { Button, Card, Col, Form, Row } from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';

import MainLayout from '../../../../components/Layout/MainLayout';
import LecturerFormItem from '../../../../components/Lecturer/LecturerFormItem';
import UserFormItem from '../../../../components/User/UserFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import LecturerClient from '../../../../libs/lecturer/lecturer.client';
import { LecturerRequestBody } from '../../../../libs/lecturer/lecturer.interface';
import {
  LECTURER_ADMIN_PATH_ROOT,
  LECTURER_PATH
} from '../../../../libs/lecturer/lecturer.resource';
import LecturerServer from '../../../../libs/lecturer/lecturer.server';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  currentLecturer: LecturerRequestBody;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ currentLecturer }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const lecturerId: number = parseInt(router.query.id as string);

  const handleSubmitButton = async (formValues: LecturerRequestBody) => {
    const lecturerClient = new LecturerClient();

    try {
      await lecturerClient.updateById(lecturerId, formValues);
      await router.push(`${LECTURER_PATH.DETAIL}${lecturerId}`);
      setLoading(false);
    } catch (error) {
      await lecturerClient.requestErrorHandler(error);
    }
  };

  return (
    <Card title="Sửa thông tin giảng viên">
      <Form
        initialValues={currentLecturer}
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

export const getServerSideProps: GetServerSideProps<CommonPageProps, PageParams> = async (ctx) => {
  let currentLecturer: LecturerRequestBody = null;
  const lecturerServer = new LecturerServer(ctx);
  try {
    currentLecturer = await lecturerServer.getInitialForEdit(ctx.params.id);
  } catch (error) {
    await lecturerServer.requestErrorHandler(error);
  }

  return {
    props: {
      currentLecturer,
      title: 'Sửa thông tin giảng viên',
      selectedMenu: SIDER_KEYS.ADMIN_LECTURER,
      breadcrumbs: [
        { text: 'Danh sách giảng viên', href: LECTURER_ADMIN_PATH_ROOT },
        {
          text: 'Chi tiết giảng viên',
          href: `${LECTURER_PATH.DETAIL}${ctx.params.id}`
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
