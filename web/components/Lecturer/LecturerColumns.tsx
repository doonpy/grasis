import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React from 'react';

import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import { LECTURER_ADMIN_PATH_ROOT } from '../../libs/lecturer/lecturer.resource';
import TextData from '../Common/TextData';
import { USER_COLUMNS } from '../User/UserColumns';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${LECTURER_ADMIN_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

function sortByLecturerId(a: Lecturer, b: Lecturer): number {
  if (a.lecturerId < b.lecturerId) {
    return -1;
  }
  if (a.lecturerId > b.lecturerId) {
    return 1;
  }
  return 0;
}

function sortByPosition(a: Lecturer, b: Lecturer): number {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
}

export const LECTURER_TABLE_COLUMNS: ColumnsType = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: 'Mã giảng viên',
    dataIndex: 'lecturerId',
    key: 'lecturerId',
    width: '10%',
    sorter: {
      compare: sortByLecturerId,
      multiple: 6
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: 'Chức vụ',
    dataIndex: 'position',
    key: 'position',
    sorter: {
      compare: sortByPosition,
      multiple: 7
    },
    render: (value: string | null) => <TextData text={value} />
  },
  ...USER_COLUMNS
];
