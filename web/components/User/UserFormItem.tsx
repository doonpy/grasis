import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Radio, Switch } from 'antd';
import React from 'react';

import LoginUser from '../../libs/user/instance/LoginUser';
import { Gender, UserType } from '../../libs/user/user.resource';

interface ComponentProps {
  isEdit: boolean;
  userType: UserType;
  userId?: number;
}

const genderOptions = [
  { label: 'Nam', value: Gender.MALE },
  { label: 'Nữ', value: Gender.FEMALE }
];

function getUsernameRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }];
}

function getPasswordRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: 'Vui lòng nhập mật khẩu!' }];
}

function getConfirmPasswordRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' }];
}

const UserFormItem: React.FC<ComponentProps> = ({ isEdit, userType, userId }) => {
  const loginUserId = LoginUser.getInstance().getId();
  const isAdminFormInput = () => {
    if (userType === UserType.LECTURER) {
      if (isEdit && userId === loginUserId) {
        return <></>;
      }

      return (
        <Form.Item name={['user', 'isAdmin']} label="Quản trị viên" valuePropName="checked">
          <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Form.Item>
      );
    }
  };

  return (
    <div>
      <Form.Item name={['user', 'username']} label="Tên đăng nhập" rules={getUsernameRules(isEdit)}>
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'password']} label="Mật khẩu" rules={getPasswordRules(isEdit)}>
        <Input.Password
          name="password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        required
        name={['user', 'confirmPassword']}
        label="Mật khẩu xác nhận"
        rules={getConfirmPasswordRules(isEdit)}>
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item name={['user', 'lastname']} label="Họ và tên đệm">
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'firstname']} label="Tên">
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'gender']} label="Giới tính">
        <Radio.Group options={genderOptions} />
      </Form.Item>
      <Form.Item name={['user', 'email']} label="Email">
        <Input type="email" />
      </Form.Item>
      <Form.Item name={['user', 'address']} label="Địa chỉ">
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'phone']} label="Số điện thoại">
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'status']} label="Trạng thái" valuePropName="checked">
        <Switch
          defaultChecked
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
      {isAdminFormInput()}
    </div>
  );
};

export default UserFormItem;
