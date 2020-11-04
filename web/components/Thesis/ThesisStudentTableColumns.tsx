import { FileTextTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React from 'react';

import { StudentTerminology } from '../../assets/terminology/student.terminology';
import UserTerminology from '../../assets/terminology/user.terminology';
import { sortByNumber, sortByString } from '../../libs/common/common.helper';
import CommonService from '../../libs/common/common.service';
import { StudentPath } from '../../libs/student/student.resource';
import { ThesisStudentForView } from '../../libs/thesis/thesis-student/thesis-student.interface';
import { Gender } from '../../libs/user/user.resource';
import TextData from '../Common/TextData';
import UserGenderRender from '../User/UserGenderRender';

function idRender(id: number): JSX.Element {
  const commonService = CommonService.getInstance();

  return (
    <Link href={commonService.replaceParams(StudentPath.SPECIFY, [id])}>
      <Button ghost type="primary" shape="circle" icon={<FileTextTwoTone />} />
    </Link>
  );
}

export const ThesisStudentTableColumns: ColumnsType<ThesisStudentForView> = [
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
    title: StudentTerminology.STUDENT_3,
    key: 'studentId',
    dataIndex: 'studentId',
    align: 'center',
    sorter: {
      compare: (a, b) => sortByString(a.studentId, b.studentId),
      multiple: 5
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: StudentTerminology.STUDENT_4,
    key: 'schoolYear',
    dataIndex: 'schoolYear',
    align: 'center',
    sorter: {
      compare: (a, b) => sortByString(a.schoolYear, b.schoolYear),
      multiple: 6
    },
    render: (value: string | null) => <TextData text={value} />
  },
  {
    title: StudentTerminology.STUDENT_5,
    key: 'studentClass',
    dataIndex: 'studentClass',
    align: 'center',
    sorter: {
      compare: (a, b) => sortByString(a.studentClass, b.studentClass),
      multiple: 7
    },
    render: (value: string | null) => <TextData text={value} />
  }
];
