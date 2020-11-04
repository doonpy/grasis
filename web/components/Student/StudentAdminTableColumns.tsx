import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React from 'react';

import { sortByNumber, sortByString } from '../../libs/common/common.helper';
import { Student } from '../../libs/student/student.interface';
import { IsGraduate, STUDENT_ADMIN_PATH_ROOT } from '../../libs/student/student.resource';
import { User } from '../../libs/user/user.interface';
import TextData from '../Common/TextData';
import { UserAdminTableColumns } from '../User/UserAdminTableColumns';
import StudentIsGraduate from './StudentIsGraduate';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${STUDENT_ADMIN_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const StudentAdminTableColumns: ColumnsType<Student & User> = [
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
  {
    title: 'Niên khóa',
    dataIndex: 'schoolYear',
    key: 'schoolYear',
    sorter: {
      compare: (a, b) => sortByString(a.schoolYear, b.schoolYear),
      multiple: 7
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: 'Lớp',
    dataIndex: 'studentClass',
    key: 'studentClass',
    sorter: {
      compare: (a, b) => sortByString(a.studentClass, b.studentClass),
      multiple: 8
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: 'Tình trạng tốt nghiệp',
    dataIndex: 'isGraduate',
    key: 'isGraduate',
    align: 'center',
    sorter: {
      compare: (a, b) => sortByNumber(a.isGraduate as IsGraduate, b.isGraduate as IsGraduate),
      multiple: 9
    },
    render: (value: number | null) => <StudentIsGraduate isGraduate={value} />
  },
  ...UserAdminTableColumns
];
