import { Checkbox, Space, Typography } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React from 'react';

import { LecturerSearchType } from '../../libs/lecturer/lecturer.resource';

interface ComponentProps {
  searchTypes: LecturerSearchType[];
  onChange: (checkedValue: Array<CheckboxValueType>) => void;
}

const searchTypeOptions = [
  { label: 'Tên giảng viên', value: LecturerSearchType.FULL_NAME },
  { label: 'Mã giảng viên', value: LecturerSearchType.LECTURER_ID }
];

const LecturerSearchTypes: React.FC<ComponentProps> = ({ searchTypes, onChange }) => {
  return (
    <Space direction="vertical" align="start" style={{ padding: 10 }}>
      <Typography.Text type="secondary">Tìm kiếm theo:</Typography.Text>
      <Checkbox.Group options={searchTypeOptions} defaultValue={searchTypes} onChange={onChange} />
    </Space>
  );
};

export default LecturerSearchTypes;
