import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Layout, message, Row } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import loginBg from '../assets/img/login-bg.jpg';
import Copyright from '../components/Copyright/Copyright';
import { postLogin } from '../services/auth/auth.service';
import { JwtService } from '../services/auth/jwt.service';
import { redirectTo, redirectToIndex } from '../services/auth/redirect.service';

const styles = {
  background: {
    height: '100vh',
    backgroundImage: `url(${loginBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
    backgroundPosition: 'center'
  },
  form: {
    padding: '20%'
  },
  forgot: { float: 'right' },
  button: { width: '100%' }
};

function Login({ initialRemember }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const { remember, ...inputs } = values;
    if (remember) {
      JwtService.setRememberValue({ status: remember, username: inputs.username });
    }

    const errorMessage = await postLogin(inputs);
    if (errorMessage) {
      message.error(errorMessage);
      setLoading(false);
      return;
    }

    if (router.query.redirectUrl) {
      redirectTo(router.query.redirectUrl);
    }
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <Layout>
        <Layout.Content style={styles.background} />
        <Layout.Sider theme="light" width={'40%'}>
          <Form
            name="normal_login"
            initialValues={{ remember: initialRemember.status, username: initialRemember.username }}
            style={styles.form}
            onFinish={handleSubmit}>
            <Row justify="center">
              <Button icon={<LoginOutlined />} size="large" type="primary" shape="circle" ghost />
            </Row>
            <br />
            <br />
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Tên người dùng"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit" style={styles.button}>
                Đăng nhập
              </Button>
            </Form.Item>
            <Copyright />
          </Form>
        </Layout.Sider>
      </Layout>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const auth = JwtService.fromNext(ctx);
  if (!auth.isExpired() && auth.isActive()) {
    await redirectToIndex(ctx.res);
  }
  return { props: { initialRemember: auth.remember } };
};

export default Login;
