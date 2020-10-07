import { Button, Card, Col, Form, message, Row } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import LecturerFormItem from '../../../components/Lecturer/LecturerFormItem';
import UserFormItem from '../../../components/User/UserFormItem';
import withAuth from '../../../hoc/withAuth';
import Main from '../../../layouts/Main';
import { SidebarKey } from '../../../module/common/sidebar';
import { createLecturer, formatLecturerForPost } from '../../../module/lecturer/lecturer.service';
import { USER_TYPE } from '../../../module/user/user.resource';
import { formatUserForPost, isAdminCheck, userTypeCheck } from '../../../module/user/user.service';

function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async (values) => {
    setLoading(true);
    const user = formatUserForPost(values);
    const lecturer = formatLecturerForPost(values);
    const res = await createLecturer(user, lecturer);
    if (res.message) {
      message.error(res.message);
    } else {
      await router.push(`/admin/lecturer/${res.id}`);
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
            <UserFormItem />
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
}

Create.layout = Main;
Create.getInitialProps = async ({ isAdmin, userType, res, asPath }) => {
  isAdminCheck(isAdmin, res);
  userTypeCheck([USER_TYPE.LECTURER, USER_TYPE.STUDENT], userType, res);

  return {
    title: 'Thêm giảng viên',
    selectedMenu: SidebarKey.ADMIN_LECTURER,
    breadcrumbs: [
      { text: 'Danh sách giảng viên', href: '/admin/lecturer' },
      { text: 'Thêm giảng viên', href: asPath }
    ]
  };
};

export default withAuth(Create);
