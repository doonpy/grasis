import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import MainLayout from '../../../components/Layout/MainLayout';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.type';
import { UserType } from '../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Index: NextPageWithLayout<PageProps> = () => {
  return (
    // <Card
    //   title="Chi tiết giảng viên"
    //   loading={isLoading}
    //   extra={
    //     <Space>
    //       <Link href={`${LECTURER_ADMIN_PATH_ROOT}/${lecturerId}/edit`}>
    //         <Button
    //           type="primary"
    //           shape="circle"
    //           icon={<EditOutlined />}
    //           size="large"
    //           disabled={isLoading && lecturerId !== loginUserId}
    //         />
    //       </Link>
    //       <Button
    //         type="primary"
    //         danger
    //         shape="circle"
    //         icon={<DeleteOutlined />}
    //         size="large"
    //         onClick={showDeleteConfirm}
    //         disabled={isLoading || lecturerId === loginUserId}
    //       />
    //     </Space>
    //   }>
    //   <Space size={48} align={'start'}>
    //     <div className={styles.avatar}>
    //       <AvatarView userId={lecturerId} width={250} height={250} />
    //     </div>
    //     <UserView user={data && data.lecturer.user} userType={UserType.LECTURER} />
    //     <LecturerView lecturer={data && data.lecturer} />
    //   </Space>
    // </Card>
    <div>Implementing...</div>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<CommonPageProps> = async ({ params }) => {
  return {
    props: {
      params,
      title: 'Chi tiết giảng viên',
      breadcrumbs: [
        {
          text: 'Chi tiết giảng viên'
        }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
