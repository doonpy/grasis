import { message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useFindOneLecturer } from '../../../../hooks/lecturer.hook';
import withAuth from '../../../../hooks/withAuth';
import Main from '../../../../layouts/Main';
import { getInitialLecturerState } from '../../../../services/lecturer/lecturer.service';

function Edit({ setNotifyPopup }) {
  const router = useRouter();
  const [lecturer, setLecturer] = useState(getInitialLecturerState());
  const { data, isLoading } = useFindOneLecturer(router.query.id);

  useEffect(() => {
    if (data && data.error) {
      message.error(data.message);
      return;
    }

    if (!isLoading && data) {
      setLecturer(data.lecturer);
    }
  }, [data]);

  return (
    <div>
      {'Lecturer ID: '}
      {router.query.id}
    </div>
  );
}

Edit.layout = Main;
Edit.getInitialProps = async (ctx) => {
  return { title: 'Giảng viên', selectedMenu: '7' };
};

export default withAuth(Edit);
