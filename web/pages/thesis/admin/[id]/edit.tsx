import { Button, Card, Form, Space } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';

import { ThesisTerminology } from '../../../../assets/terminology/thesis.terminology';
import MainLayout from '../../../../components/Layout/MainLayout';
import ThesisAttendeesSelectFormItem from '../../../../components/Thesis/ThesisAttendeesSelectFormItem';
import ThesisFormItem from '../../../../components/Thesis/ThesisFormItem';
import { CommonPageProps, NextPageWithLayout } from '../../../../libs/common/common.interface';
import { SIDER_KEYS } from '../../../../libs/common/common.resource';
import { LecturerSearchAttendee } from '../../../../libs/lecturer/lecturer.interface';
import {
  StudentRequestBody,
  StudentSearchAttendee
} from '../../../../libs/student/student.interface';
import ThesisAdminService from '../../../../libs/thesis/admin.service';
import { ThesisRequestBody } from '../../../../libs/thesis/thesis.interface';
import { THESIS_PATH_ROOT, ThesisAttendeeTarget } from '../../../../libs/thesis/thesis.resource';
import { UserType } from '../../../../libs/user/user.resource';

interface PageProps extends CommonPageProps {
  currentStudent: StudentRequestBody;
  params: PageParams;
}

interface PageParams extends ParsedUrlQuery {
  id?: string;
}

const Edit: NextPageWithLayout<PageProps> = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [contentLoading, setContentLoading] = useState<boolean>(true);
  const [initLecturerAttendees, setInitLecturerAttendees] = useState<LecturerSearchAttendee[]>([]);
  const [initStudentAttendees, setInitStudentAttendees] = useState<StudentSearchAttendee[]>([]);
  const [initStudentSelectedKeys, setInitStudentSelectedKeys] = useState<string[]>([]);
  const [initLecturerSelectedKeys, setInitLecturerSelectedKeys] = useState<string[]>([]);
  const [thesis, setThesis] = useState<ThesisRequestBody>(undefined);
  const thesisId: number = parseInt(params.id as string);
  const [form] = Form.useForm();
  const adminService = ThesisAdminService.getInstance();

  const handleSubmitButton = async (formValues: ThesisRequestBody) => {
    setLoading(true);

    try {
      const { data } = await adminService.updateById(
        thesisId,
        adminService.formatThesisRequestBody(formValues)
      );
      await adminService.redirectService.redirectTo(`${THESIS_PATH_ROOT}/${data.id}`);
    } catch (error) {
      await adminService.requestErrorHandler(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const thesisForEdit = await adminService.getInitialForEdit(thesisId);
        setInitLecturerAttendees(thesisForEdit.lecturerAttendees);
        setInitStudentAttendees(thesisForEdit.studentAttendees);

        const currentThesis = adminService.convertToFormValue(thesisForEdit);
        setThesis(currentThesis);
        setInitLecturerSelectedKeys(currentThesis.attendees.lecturers);
        setInitStudentSelectedKeys(currentThesis.attendees.students);
        form.setFieldsValue(currentThesis);
        setContentLoading(false);
      } catch (error) {
        await adminService.requestErrorHandler(error);
      }
    })();
  }, []);

  return (
    <Card title={ThesisTerminology.THESIS_26} loading={contentLoading}>
      <Form form={form} requiredMark={true} layout="vertical" onFinish={handleSubmitButton}>
        <Space size={100} align="start">
          <ThesisFormItem initThesis={thesis} />
          <Space direction="vertical">
            <ThesisAttendeesSelectFormItem
              attendeeTarget={ThesisAttendeeTarget.LECTURER}
              initAttendees={initLecturerAttendees}
              initSelectedKey={initLecturerSelectedKeys}
            />
            <ThesisAttendeesSelectFormItem
              attendeeTarget={ThesisAttendeeTarget.STUDENT}
              initAttendees={initStudentAttendees}
              initSelectedKey={initStudentSelectedKeys}
            />
            <Space size="large">
              <Button htmlType="submit" type="primary" size="large" loading={loading}>
                Xác nhận
              </Button>
              <Button type="primary" danger size="large" onClick={router.back} disabled={loading}>
                Hủy
              </Button>
            </Space>
          </Space>
        </Space>
      </Form>
    </Card>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<CommonPageProps, PageParams> = async ({ params }) => {
  return {
    props: {
      params,
      title: ThesisTerminology.THESIS_26,
      selectedMenu: SIDER_KEYS.THESIS,
      breadcrumbs: [
        { text: ThesisTerminology.THESIS_3, href: THESIS_PATH_ROOT },
        { text: ThesisTerminology.THESIS_4, href: `${THESIS_PATH_ROOT}/${params.id}` },
        { text: ThesisTerminology.THESIS_26 }
      ],
      isAdminCheck: true,
      allowUserTypes: [UserType.LECTURER]
    }
  };
};

Edit.Layout = MainLayout;

export default Edit;
