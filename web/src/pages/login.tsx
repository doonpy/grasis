import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Layout,
  Row,
  Space,
  Typography
} from 'antd';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from '../assets/css/pages/login/index.module.css';
import fhqLogo from '../assets/img/fhq-logo.png';
import hcmuteLogo from '../assets/img/hcmute-logo.png';
import { LoginTerminology } from '../assets/terminology/login.terminology';
import Copyright from '../components/Copyright/Copyright';
import { COMMON_PATH } from '../libs/common/common.resource';
import CommonService from '../libs/common/common.service';
import { LoginInputs } from '../libs/user/user.type';
import UserService from '../libs/user/user.service';

const Login: NextPage = () => {
  const router = useRouter();
  const userClient = UserService.getInstance();
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

  (async () => {
    const commonClient = new CommonService();
    try {
      await commonClient.jwtService.checkTokenExpire();
      if (!commonClient.jwtService.isAccessTokenExpired()) {
        await commonClient.redirectService.redirectTo(COMMON_PATH.INDEX);
      }
    } catch (error) {
      await commonClient.requestErrorHandler(error);
    }
  })();

  return (
    <div>
      <Head>
        <title>{LoginTerminology.LOGIN_1}</title>
      </Head>
      <Layout>
        <Layout.Content className={styles.background} />
        <Layout.Sider theme="light" width={'40%'}>
          <Form
            name="normal_login"
            initialValues={{ remember: true, username }}
            className={styles.form}
            onFinish={handleSubmit}>
            <Space direction="vertical" size="large" className={styles.logo}>
              <Space size="large" align="start">
                <Image preview={false} src={hcmuteLogo} width={'7em'} />
                <Image preview={false} src={fhqLogo} width={'7em'} />
              </Space>
              <Typography.Title level={1} className={styles.logoText}>
                {LoginTerminology.LOGIN_7}
              </Typography.Title>
            </Space>
            <br />
            <br />
            <br />
            <br />
            <br />
            <Divider>{LoginTerminology.LOGIN_8.toUpperCase()}</Divider>
            <Form.Item
              name="username"
              rules={[{ required: true, message: LoginTerminology.LOGIN_3 }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={LoginTerminology.LOGIN_2}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: LoginTerminology.LOGIN_5 }]}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={LoginTerminology.LOGIN_4}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{LoginTerminology.LOGIN_6}</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit" block>
                {LoginTerminology.LOGIN_9}
              </Button>
            </Form.Item>
            <Row justify="center">
              <Copyright />
            </Row>
          </Form>
        </Layout.Sider>
      </Layout>
    </div>
  );
};

export default Login;
