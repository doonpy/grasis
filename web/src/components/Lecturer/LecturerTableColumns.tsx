import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import React from 'react';

import { sortByString } from '../../libs/common/common.helper';
import { LECTURER_ADMIN_PATH_ROOT } from '../../libs/lecturer/lecturer.resource';
import { LecturerForListView } from '../../libs/lecturer/lecturer.type';
import TextData from '../Common/TextData';
import { UserAdminTableColumns } from '../User/UserAdminTableColumns';

function idRender(id: number): JSX.Element {
  return (
    <Link href={`${LECTURER_ADMIN_PATH_ROOT}/${id}`}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const LecturerTableColumns: ColumnsType<LecturerForListView> = [
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
      compare: (a, b) => sortByString(a.lecturerId, b.lecturerId),
      multiple: 6
    },
    render: (value: string | null) => <TextData text={value} />
  },
  ...UserAdminTableColumns
];
