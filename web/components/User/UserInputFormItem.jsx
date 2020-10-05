import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Radio, Switch } from 'antd';
import React from 'react';

import { IS_ADMIN, USER_STATUS } from '../../services/user.service';

const genderOptions = [
  { label: 'Nam', value: 0 },
  { label: 'Nữ', value: 1 }
];

function UserInputFormItem({ user, setUser }) {
  const handleUserInputChange = (e) => {
    if (e.persist) {
      e.persist();
    }

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {' '}
      <Form.Item
        required
        name="username"
        label="Tên người dùng"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên người dùng!'
          }
        ]}>
        <Input name="username" value={user.username} onChange={handleUserInputChange} />
      </Form.Item>
      <Form.Item
        required
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập mật khẩu!'
          }
        ]}>
        <Input.Password
          name="password"
          value={user.password}
          onChange={handleUserInputChange}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        required
        name="confirmPassword"
        label="Mật khẩu xác nhận"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập mật khẩu xác nhận!'
          }
        ]}>
        <Input.Password
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleUserInputChange}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item name="lastname" label="Họ và tên đệm">
        <Input name="lastname" value={user.lastname} onChange={handleUserInputChange} />
      </Form.Item>
      <Form.Item name="firstname" label="Tên">
        <Input name="firstname" value={user.firstname} onChange={handleUserInputChange} />
      </Form.Item>
      <Form.Item name="gender" label="Giới tính">
        <Radio.Group
          name="gender"
          value={user.gender}
          onChange={handleUserInputChange}
          options={genderOptions}
        />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input type="email" name="email" value={user.email} onChange={handleUserInputChange} />
      </Form.Item>
      <Form.Item name="address" label="Địa chỉ">
        <Input name="address" value={user.address} onChange={handleUserInputChange} />
      </Form.Item>
      <Form.Item name="phone" label="Số điện thoại">
        <Input name="phone" value={user.phone} onChange={handleUserInputChange} />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" valuePropName="checked">
        <Switch
          defaultChecked
          checked={user.status === USER_STATUS.ACTIVE}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) =>
            setUser({ ...user, status: checked ? USER_STATUS.ACTIVE : USER_STATUS.IN_ACTIVE })
          }
        />
      </Form.Item>
      <Form.Item name="isAdmin" label="Quản trị viên" valuePropName="checked">
        <Switch
          checked={user.isAdmin === IS_ADMIN.TRUE}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) =>
            setUser({ ...user, isAdmin: checked ? IS_ADMIN.TRUE : IS_ADMIN.FALSE })
          }
        />
      </Form.Item>
    </div>
  );
}

export default UserInputFormItem;
