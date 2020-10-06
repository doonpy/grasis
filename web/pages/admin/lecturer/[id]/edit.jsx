import { Button, Card, Col, Form, message, Row } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import LecturerFormItem from '../../../../components/Lecturer/LecturerFormItem';
import UserFormItem from '../../../../components/User/UserFormItem';
import withAuth from '../../../../hoc/withAuth';
import Main from '../../../../layouts/Main';
import { SidebarKey } from '../../../../resource/sidebar';
import { USER_TYPE } from '../../../../resource/user';
import {
  formatLecturerForPost,
  getInitialLecturer,
  updateLecturer
} from '../../../../services/lecturer/lecturer.service';
import {
  formatUserForPost,
  isAdminCheck,
  userTypeCheck
} from '../../../../services/user/user.service';

function Edit({ initLecturer, initUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmitButton = async (values) => {
    const user = formatUserForPost(values);
    const lecturer = formatLecturerForPost(values);
    const res = await updateLecturer(router.query.id, user, lecturer);
    if (res.message) {
      message.error(res.message);
    } else {
      await router.push(`/admin/lecturer/${res.id}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initLecturer.level && !Array.isArray(initLecturer.level)) {
      initLecturer.level = initLecturer.level.split(';');
    }

    form.setFieldsValue({ ...initLecturer, ...initUser });
  }, []);

  return (
    <Card title="Sửa thông tin giảng viên">
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

Edit.layout = Main;
Edit.getInitialProps = async ({ isAdmin, userType, query, req, res, asPath }) => {
  isAdminCheck(isAdmin, res);
  userTypeCheck([USER_TYPE.LECTURER, USER_TYPE.STUDENT], userType, res);

  return {
    ...(await getInitialLecturer(query.id, { req }, { res })),
    title: 'Sửa thông tin giảng viên',
    selectedMenu: SidebarKey.ADMIN_LECTURER,
    breadcrumbs: [
      { text: 'Danh sách giảng viên', href: '/admin/lecturer' },
      { text: 'Chi tiết giảng viên', href: `/admin/lecturer/${query.id}` },
      { text: 'Sửa thông tin giảng viên', href: asPath }
    ]
  };
};

export default withAuth(Edit);
