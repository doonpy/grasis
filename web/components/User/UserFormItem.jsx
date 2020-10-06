import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Radio, Switch } from 'antd';
import React from 'react';

const genderOptions = [
  { label: 'Nam', value: 0 },
  { label: 'Nữ', value: 1 }
];

function UserFormItem({ isEdit }) {
  return (
    <div>
      <Form.Item
        required
        name="username"
        label="Tên người dùng"
        rules={
          isEdit
            ? []
            : [
                {
                  required: true,
                  message: 'Vui lòng nhập tên người dùng!'
                }
              ]
        }>
        <Input name="username" />
      </Form.Item>
      <Form.Item
        required
        name="password"
        label="Mật khẩu"
        rules={
          isEdit
            ? []
            : [
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!'
                }
              ]
        }>
        <Input.Password
          name="password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        required
        name="confirmPassword"
        label="Mật khẩu xác nhận"
        rules={
          isEdit
            ? []
            : [
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu xác nhận!'
                }
              ]
        }>
        <Input.Password
          name="confirmPassword"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item name="lastname" label="Họ và tên đệm">
        <Input name="lastname" />
      </Form.Item>
      <Form.Item name="firstname" label="Tên">
        <Input name="firstname" />
      </Form.Item>
      <Form.Item name="gender" label="Giới tính">
        <Radio.Group name="gender" options={genderOptions} />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input type="email" name="email" />
      </Form.Item>
      <Form.Item name="address" label="Địa chỉ">
        <Input name="address" />
      </Form.Item>
      <Form.Item name="phone" label="Số điện thoại">
        <Input name="phone" />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" valuePropName="checked">
        <Switch
          defaultChecked
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
      <Form.Item name="isAdmin" label="Quản trị viên" valuePropName="checked">
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </div>
  );
}

export default UserFormItem;
