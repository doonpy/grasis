import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import MainLayout from '../../../components/Layout/MainLayout';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
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
    //   title="Chi tiết sinh viên"
    //   loading={isLoading}
    //   extra={
    //     <Space>
    //       <Link href={`${STUDENT_ADMIN_PATH_ROOT}/${studentId}/edit`}>
    //         <Button
    //           type="primary"
    //           shape="circle"
    //           icon={<EditOutlined />}
    //           size="large"
    //           disabled={isLoading}
    //         />
    //       </Link>
    //       <Button
    //         type="primary"
    //         danger
    //         shape="circle"
    //         icon={<DeleteOutlined />}
    //         size="large"
    //         onClick={showDeleteConfirm}
    //         disabled={isLoading}
    //       />
    //     </Space>
    //   }>
    //   <Space size={48} align={'start'}>
    //     <div className={styles.avatar}>
    //       <AvatarView userId={studentId} width={250} height={250} />
    //     </div>
    //     <UserView user={data && data.student.user} userType={UserType.STUDENT} />
    //     <StudentView student={data && data.student} />
    //   </Space>
    // </Card>
    <div>Implementing</div>
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
      title: 'Chi tiết sinh viên',
      selectedMenu: SIDER_KEYS.ADMIN_STUDENT,
      breadcrumbs: [
        {
          text: 'Chi tiết sinh viên'
        }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    }
  };
};

Index.Layout = MainLayout;

export default Index;
