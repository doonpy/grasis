import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React from 'react';

import { Student } from '../../libs/student/student.interface';
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

function sortByStudentId(a: Student, b: Student): number {
  if (a.studentId < b.studentId) {
    return -1;
  }
  if (a.studentId > b.studentId) {
    return 1;
  }
  return 0;
}

function sortBySchoolYear(a: Student, b: Student): number {
  if (a.schoolYear < b.schoolYear) {
    return -1;
  }
  if (a.schoolYear > b.schoolYear) {
    return 1;
  }
  return 0;
}

function sortByClass(a: Student, b: Student): number {
  if (a.studentClass < b.studentClass) {
    return -1;
  }
  if (a.studentClass > b.studentClass) {
    return 1;
  }
  return 0;
}

function sortByIsGraduate(a: Student, b: Student): number {
  if (a.isGraduate < b.isGraduate) {
    return -1;
  }
  if (a.isGraduate > b.isGraduate) {
    return 1;
  }
  return 0;
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
    sorter: {
      compare: sortByIsGraduate,
      multiple: 9
    },
    render: (value: number | null) => <StudentIsGraduate isGraduate={value} />
  },
  ...USER_COLUMNS
];
