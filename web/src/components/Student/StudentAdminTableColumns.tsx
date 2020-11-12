import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import React from 'react';

import { sortByString } from '../../libs/common/common.helper';
import { STUDENT_ADMIN_PATH_ROOT } from '../../libs/student/student.resource';
import { StudentForListView } from '../../libs/student/student.type';
import TextData from '../Common/TextData';
import { UserAdminTableColumns } from '../User/UserAdminTableColumns';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${STUDENT_ADMIN_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const StudentAdminTableColumns: ColumnsType<StudentForListView> = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: 'Mã sinh viên',
    dataIndex: 'studentId',
    key: 'studentId',
    width: '10%',
    sorter: {
      compare: (a, b) => sortByString(a.studentId, b.studentId),
      multiple: 6
    },
    render: (value: string | null) => <TextData text={value} />
  },
  ...UserAdminTableColumns
];
