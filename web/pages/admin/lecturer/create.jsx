import { Button, Card, Col, Form, Input, message, Radio, Row, Select, Switch } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import UserInputFormItem from '../../../components/User/UserInputFormItem';
import withAuth from '../../../hooks/withAuth';
import Main from '../../../layouts/Main';
import { createLecturer } from '../../../services/lecturer/lecturer.service';

function Create() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [lecturer, setLecturer] = useState({});

  const handleLecturerInputChange = (e) => {
    if (e.persist) {
      e.persist();
    }

    setLecturer({ ...lecturer, [e.target.name]: e.target.value });
  };

  const handleLevelInputChange = (value) => {
    setLecturer({ ...lecturer, level: value.join(';') });
  };

  const handleSubmitButton = async () => {
    const res = await createLecturer(user, lecturer);
    if (res.error) {
      message.error(res.message);
    } else {
      await router.push(`/admin/lecturer/${res.id}`);
    }
  };

  return (
    <Card title="Thêm giảng viên">
      <Form
        requiredMark={true}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}>
        <Row>
          <Col span={12}>
            <UserInputFormItem user={user} setUser={setUser} />
          </Col>
          <Col span={12}>
            <Form.Item name="lecturerId" label="Mã giảng viên">
              <Input
                name="lecturerId"
                value={lecturer.lecturerId}
                onChange={handleLecturerInputChange}
                maxLength={4}
              />
            </Form.Item>
            <Form.Item name="level" label="Trình độ học vấn">
              <Select
                name="level"
                mode="multiple"
                value={lecturer.level && lecturer.level.split(';')}
                optionLabelProp="label"
                onChange={handleLevelInputChange}>
                <Select.Option value="Thạc sĩ" label="Thạc sĩ">
                  Thạc sĩ
                </Select.Option>
                <Select.Option value="Tiến sĩ" label="Tiến sĩ">
                  Tiến sĩ
                </Select.Option>
                <Select.Option value="Phó giáo sư" label="Phó giáo sư">
                  Phó giáo sư
                </Select.Option>
                <Select.Option value="Giáo sư" label="Giáo sư">
                  Giáo sư
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="position" label="Chức vụ">
              <Input
                name="position"
                value={lecturer.position}
                onChange={handleLecturerInputChange}
              />
            </Form.Item>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  style={{ marginRight: 30 }}
                  onClick={handleSubmitButton}>
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
Create.getInitialProps = async (ctx) => {
  return { title: 'Giảng viên', selectedMenu: '7' };
};

export default withAuth(Create);
