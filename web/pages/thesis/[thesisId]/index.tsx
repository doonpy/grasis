import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { ThesisTerminology } from '../../../assets/terminology/thesis.terminology';
import MainLayout from '../../../components/Layout/MainLayout';
import ThesisAttendeesInfo from '../../../components/Thesis/ThesisAttendeesInfo';
import ThesisInfo from '../../../components/Thesis/ThesisInfo';
import { CommonPageProps, NextPageWithLayout } from '../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../libs/common/common.resource';
import ThesisAdminService from '../../../libs/thesis/admin.service';
import { THESIS_PATH_ROOT, ThesisPath } from '../../../libs/thesis/thesis.resource';
import ThesisService from '../../../libs/thesis/thesis.service';
import LoginUser from '../../../libs/user/instance/LoginUser';
import { UserType } from '../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  thesisId?: string;
}

const { confirm } = Modal;

const Index: NextPageWithLayout<PageProps> = ({ params }) => {
  const thesisService = ThesisService.getInstance();
  const thesisId = parseInt(params.thesisId);
  const { data, isLoading } = thesisService.useThesis(thesisId);
  const adminService = ThesisAdminService.getInstance();

  const showDeleteConfirm = () => {
    confirm({
      title: ThesisTerminology.THESIS_21,
      icon: <ExclamationCircleOutlined />,
      content: ThesisTerminology.THESIS_22,
      okText: ThesisTerminology.THESIS_23,
      cancelText: ThesisTerminology.THESIS_24,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await adminService.deleteById(thesisId);
          await adminService.redirectService.redirectTo(THESIS_PATH_ROOT);
        } catch (error) {
          await adminService.requestErrorHandler(error);
        }
      }
    });
  };

  return (
    <Card
      loading={isLoading}
      title={ThesisTerminology.THESIS_4}
      extra={
        LoginUser.getInstance().isAdmin() && (
          <Space>
            <Link href={thesisService.replaceParams(ThesisPath.EDIT, [thesisId])}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                size="large"
                disabled={isLoading}
              />
            </Link>
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              size="large"
              onClick={showDeleteConfirm}
              disabled={isLoading}
            />
          </Space>
        )
      }>
      {data && (
        <Space direction="vertical" size="large">
          <ThesisInfo thesis={data.thesis} />
          <ThesisAttendeesInfo
            thesisId={thesisId}
            initLecturers={data.thesis.lecturers}
            initStudents={data.thesis.students}
            initIsMoreLecturers={data.isMoreLecturers}
            initIsMoreStudents={data.isMoreStudents}
          />
        </Space>
      )}
    </Card>
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
      title: ThesisTerminology.THESIS_4,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        { text: ThesisTerminology.THESIS_4 }
      ],
      isAdminCheck: false,
      allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
    },
    revalidate: 1
  };
};

Index.Layout = MainLayout;

export default Index;
