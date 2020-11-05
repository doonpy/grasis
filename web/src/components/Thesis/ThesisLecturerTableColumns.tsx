import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import React from 'react';

import { LecturerTerminology } from '../../assets/terminology/lecturer.terminology';
import UserTerminology from '../../assets/terminology/user.terminology';
import { sortByNumber, sortByString } from '../../libs/common/common.helper';
import CommonService from '../../libs/common/common.service';
import { LecturerPath } from '../../libs/lecturer/lecturer.resource';
import { ThesisLecturerForView } from '../../libs/thesis/thesis-lecturer/thesis-lecturer.interface';
import { Gender } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';
import UserGenderRender from '../User/UserGenderRender';

function idRender(id: number): JSX.Element {
  const commonService = CommonService.getInstance();

  return (
    <Link href={commonService.replaceParams(LecturerPath.SPECIFY, [id])}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const ThesisLecturerTableColumns: ColumnsType<ThesisLecturerForView> = [
  {
    title: '',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    render: idRender
  },
  {
    title: UserTerminology.USER_5,
    key: 'lastname',
    dataIndex: 'lastname',
    sorter: {
      compare: (a, b) => sortByString(a.lastname, b.lastname),
      multiple: 2
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_4,
    key: 'firstname',
    dataIndex: 'firstname',
    sorter: {
      compare: (a, b) => sortByString(a.firstname, b.firstname),
      multiple: 3
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: UserTerminology.USER_6,
    key: 'gender',
    dataIndex: 'gender',
    align: 'center',
    sorter: {
      compare: (a, b) => sortByNumber(a.gender, b.gender),
      multiple: 4
    },
    render: (value: Gender | null) => <UserGenderRender gender={value} />
  },
  {
    title: LecturerTerminology.LECTURER_3,
    key: 'lecturerId',
    dataIndex: 'lecturerId',
    align: 'center',
    sorter: {
      compare: (a, b) => sortByString(a.lecturerId, b.lecturerId),
      multiple: 5
    },
    render: (value: string | null) => <TextData text={value} />
  }
];
