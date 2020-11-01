import { List } from 'antd';
import Link from 'next/link';
import React from 'react';

import { StudentPath } from '../../libs/student/student.resource';
import StudentService from '../../libs/student/student.service';
import { ThesisStudent } from '../../libs/thesis/thesis-student/thesis-student.interface';
import StudentInfo from '../Student/StudentInfo';

interface ComponentProps {
  thesisStudent: ThesisStudent;
}

const ThesisStudentItem: React.FC<ComponentProps> = ({ thesisStudent: { student, studentId } }) => {
  const studentService = StudentService.getInstance();

  return (
    <List.Item>
      <Link href={studentService.replaceParams(StudentPath.SPECIFY, [studentId])}>
        <a>
          <StudentInfo student={student} />
        </a>
      </Link>
    </List.Item>
  );
};

export default ThesisStudentItem;
