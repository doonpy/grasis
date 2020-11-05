import { Checkbox, Space, Typography } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React from 'react';

import { StudentSearchType } from '../../libs/student/student.resource';

interface ComponentProps {
  searchTypes: StudentSearchType[];
  onChange: (checkedValue: Array<CheckboxValueType>) => void;
}

const StudentSearchTypes: React.FC<ComponentProps> = ({ searchTypes, onChange }) => {
  return (
    <Space direction="vertical" align="start" style={{ padding: 10 }}>
      <Typography.Text type="secondary">Tìm kiếm theo:</Typography.Text>
      <Checkbox.Group defaultValue={searchTypes} onChange={onChange}>
        <Space direction="vertical">
          <Checkbox value={StudentSearchType.FULL_NAME}>Tên sinh viên</Checkbox>
          <Checkbox value={StudentSearchType.STUDENT_ID}>Mã sinh viên</Checkbox>
        </Space>
        <Space direction="vertical">
          <Checkbox value={StudentSearchType.SCHOOL_YEAR}>Niên khóa</Checkbox>
          <Checkbox value={StudentSearchType.STUDENT_CLASS}>Lớp</Checkbox>
        </Space>
      </Checkbox.Group>
    </Space>
  );
};

export default StudentSearchTypes;
