import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Radio, Switch } from 'antd';
import React from 'react';

import UserTerminology from '../../assets/terminology/user.terminology';
import LoginUser from '../../libs/user/instance/LoginUser';
import { Gender, UserType } from '../../libs/user/user.resource';

interface ComponentProps {
  isEdit: boolean;
  userType: UserType;
  userId?: number;
}

const genderOptions = [
  { label: UserTerminology.USER_12, value: Gender.MALE },
  { label: UserTerminology.USER_13, value: Gender.FEMALE }
];

function getUsernameRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: UserTerminology.USER_14 }];
}

function getPasswordRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: UserTerminology.USER_15 }];
}

function getConfirmPasswordRules(isEdit: boolean) {
  return isEdit ? [] : [{ required: true, message: UserTerminology.USER_16 }];
}

const UserFormItem: React.FC<ComponentProps> = ({ isEdit, userType, userId }) => {
  const loginUserId = LoginUser.getInstance().getId();
  const isAdminFormInput = () => {
    if (userType === UserType.LECTURER) {
      if (isEdit && userId === loginUserId) {
        return <></>;
      }

      return (
        <>
          <Form.Item
            name={['user', 'status']}
            label={UserTerminology.USER_10}
            valuePropName="checked">
            <Switch
              defaultChecked
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
          <Form.Item
            name={['user', 'isAdmin']}
            label={UserTerminology.USER_11}
            valuePropName="checked">
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
        </>
      );
    }
  };

  return (
    <div>
      <Form.Item
        name={['user', 'username']}
        label={UserTerminology.USER_1}
        rules={getUsernameRules(isEdit)}>
        <Input />
      </Form.Item>
      <Form.Item
        name={['user', 'password']}
        label={UserTerminology.USER_2}
        rules={getPasswordRules(isEdit)}>
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        required
        name={['user', 'confirmPassword']}
        label={UserTerminology.USER_3}
        rules={getConfirmPasswordRules(isEdit)}>
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item name={['user', 'lastname']} label={UserTerminology.USER_5}>
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'firstname']} label={UserTerminology.USER_4}>
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'gender']} label={UserTerminology.USER_6}>
        <Radio.Group options={genderOptions} />
      </Form.Item>
      <Form.Item name={['user', 'email']} label={UserTerminology.USER_7}>
        <Input type="email" />
      </Form.Item>
      <Form.Item name={['user', 'address']} label={UserTerminology.USER_8}>
        <Input />
      </Form.Item>
      <Form.Item name={['user', 'phone']} label={UserTerminology.USER_9}>
        <Input />
      </Form.Item>
      {isAdminFormInput()}
    </div>
  );
};

export default UserFormItem;
