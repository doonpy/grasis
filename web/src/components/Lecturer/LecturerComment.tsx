import { Comment } from 'antd';
import React from 'react';

import { Lecturer } from '../../libs/lecturer/lecturer.interface';
import AvatarForComment from '../Avatar/AvatarForComment';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';

interface ComponentProps {
  lecturer: Lecturer;
  date: string;
  comment: string | null;
}

const LecturerComment: React.FC<ComponentProps> = ({
  lecturer: {
    lecturerId,
    user: { id, firstname, lastname }
  },
  date,
  comment
}) => {
  const fullName = `${lastname || ''} ${firstname || ''}`;
  const lecturerIdStr = lecturerId ? `(${lecturerId})` : '';

  return (
    <Comment
      author={<a> {`${fullName} ${lecturerIdStr}`}</a>}
      avatar={<AvatarForComment id={id} firstname={firstname} lastname={lastname} />}
      content={<TextData text={comment} isParagraph={true} />}
      datetime={<DateData date={date} isRelative={true} />}
    />
  );
};

export default LecturerComment;
