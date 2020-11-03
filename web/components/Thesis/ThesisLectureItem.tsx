import { List } from 'antd';
import Link from 'next/link';
import React from 'react';

import { LecturerPath } from '../../libs/lecturer/lecturer.resource';
import LecturerService from '../../libs/lecturer/lecturer.service';
import { ThesisLecturer } from '../../libs/thesis/thesis-lecturer/thesis-lecturer.interface';
import LecturerInfo from '../Lecturer/LecturerInfo';

interface ComponentProps {
  thesisLecturer: ThesisLecturer;
}

const ThesisLecturersListItem: React.FC<ComponentProps> = ({
  thesisLecturer: { lecturer, lecturerId }
}) => {
  const lecturerService = LecturerService.getInstance();

  return (
    <List.Item>
      <Link href={lecturerService.replaceParams(LecturerPath.SPECIFY, [lecturerId])}>
        <a>
          <LecturerInfo lecturer={lecturer} />
        </a>
      </Link>
    </List.Item>
  );
};

export default ThesisLecturersListItem;
