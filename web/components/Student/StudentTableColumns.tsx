import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React from 'react';

import {
  sortByClass,
  sortByIsGraduate,
  sortBySchoolYear,
  sortByStudentId
} from '../../libs/student/student.helper';
import { STUDENT_ADMIN_PATH_ROOT } from '../../libs/student/student.resource';
import TextData from '../Common/TextData';
import { USER_COLUMNS } from '../User/UserColumns';
import StudentIsGraduate from './StudentIsGraduate';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${STUDENT_ADMIN_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const StudentTableColumns: ColumnsType = [
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
      compare: sortByStudentId,
      multiple: 6
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: 'Niên khóa',
    dataIndex: 'schoolYear',
    key: 'schoolYear',
    sorter: {
      compare: sortBySchoolYear,
      multiple: 7
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: 'Lớp',
    dataIndex: 'studentClass',
    key: 'studentClass',
    sorter: {
      compare: sortByClass,
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
      compare: sortByIsGraduate,
      multiple: 9
    },
    render: (value: number | null) => <StudentIsGraduate isGraduate={value} />
  },
  ...USER_COLUMNS
];
