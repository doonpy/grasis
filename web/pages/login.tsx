import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Image, Input, Layout, Space, Typography } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { CSSProperties, useState } from 'react';

import logo from '../assets/img/hcmute-logo.png';
import loginBg from '../assets/img/login-bg.jpg';
import Copyright from '../components/Copyright/Copyright';
import { COMMON_PATH } from '../libs/common/common.resource';
import CommonServer from '../libs/common/common.server';
import UserClient from '../libs/user/user.client';
import { LoginInputs } from '../libs/user/user.interface';

const styles: Record<string, CSSProperties> = {
  background: {
    height: '100vh',
    backgroundImage: `url(${loginBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
    backgroundPosition: 'center'
  },
  form: {
    padding: '15%'
  },
  forgot: { float: 'right' },
  button: { width: '100%' },
  brand: { textAlign: 'center', width: '100%' }
};

const Login: NextPage = () => {
  const router = useRouter();
  const userClient = UserClient.getInstance();
  const [loading, setLoading] = useState(false);
  const { username } = userClient.getRememberValue();

  const handleSubmit = async (values: LoginInputs) => {
    setLoading(true);
    const { remember, ...inputs } = values;
    if (remember) {
      userClient.setRememberValue({ username: inputs.username });
    }

    try {
      await userClient.login(values);
      setLoading(false);
    } catch (error) {
      await userClient.requestErrorHandler(error);
      setLoading(false);
      return;
    }

    if (router.query.redirectUrl) {
      await userClient.redirectService.redirectTo(router.query.redirectUrl as string);
    } else {
      await userClient.redirectService.redirectTo(COMMON_PATH.INDEX);
    }
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
            initialValues={{ remember: true, username }}
            style={styles.form}
            onFinish={handleSubmit}>
            <Space direction="vertical" size="large" style={styles.brand}>
              <Image preview={false} src={logo} width={170} />
              <Typography.Title level={2}>GRASIS</Typography.Title>
            </Space>
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
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const commonServer = new CommonServer(ctx);
  try {
    await commonServer.jwtService.checkTokenExpire();
    if (!commonServer.jwtService.isAccessTokenExpired()) {
      await commonServer.redirectService.redirectTo(COMMON_PATH.INDEX);
    }
  } catch (error) {
    await commonServer.requestErrorHandler(error);
  }

  return { props: {} };
};

export default Login;
