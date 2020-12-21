import Icon, { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import ThesisAdminService from '../../libs/thesis/admin.service';
import { THESIS_PATH_ROOT, ThesisPath, ThesisStatus } from '../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import LoginUser from '../../libs/user/instance/LoginUser';
const { confirm } = Modal;

interface ComponentProps {
  thesis: ThesisForView;
  setThesis: React.Dispatch<ThesisForView>;
}

const ThesisInfoButtons: React.FC<ComponentProps> = ({ thesis, setThesis }) => {
  const [switchButtonLoading, setSwitchButtonLoading] = useState<boolean>(false);
  const loginUser = LoginUser.getInstance();
  const adminService = ThesisAdminService.getInstance();
  const buttonList: React.FC[] = [];

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
          await adminService.deleteById(thesis.id);
          await adminService.redirectService.redirectTo(THESIS_PATH_ROOT);
        } catch (error) {
          await adminService.requestErrorHandler(error);
        }
      }
    });
  };

  const showStatusConfirm = () => {
    confirm({
      title:
        thesis.status === ThesisStatus.INACTIVE
          ? ThesisTerminology.THESIS_38
          : ThesisTerminology.THESIS_39,
      icon: <ExclamationCircleOutlined />,
      content:
        thesis.status === ThesisStatus.INACTIVE
          ? ThesisTerminology.THESIS_41
          : ThesisTerminology.THESIS_40,
      okText: ThesisTerminology.THESIS_23,
      cancelText: ThesisTerminology.THESIS_24,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          if (switchButtonLoading) {
            adminService.apiService.cancelPreviousRequest();
          }

          setSwitchButtonLoading(true);
          const { data } = await adminService.switchStatus(thesis.id);
          setThesis(data.thesis);
          if (thesis.status === ThesisStatus.INACTIVE) {
            message.success(ThesisTerminology.THESIS_43);
          } else {
            message.success(ThesisTerminology.THESIS_44);
          }
        } catch (error) {
          await adminService.requestErrorHandler(error);
        }
        setSwitchButtonLoading(false);
      }
    });
  };

  if (loginUser.isAdmin()) {
    if (thesis.status === ThesisStatus.ACTIVE) {
      buttonList.push(() => (
        <Button
          type="primary"
          icon={<Icon component={MinusCircleIcon} />}
          loading={switchButtonLoading}
          onClick={showStatusConfirm}>
          {ThesisTerminology.THESIS_28}
        </Button>
      ));
    }

    if (thesis.status === ThesisStatus.INACTIVE) {
      buttonList.push(
        () => (
          <Link href={adminService.replaceParams(ThesisPath.EDIT, [thesis.id])}>
            <Button type="primary" icon={<EditOutlined />}>
              {ThesisTerminology.THESIS_26}
            </Button>
          </Link>
        ),
        () => (
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
            {ThesisTerminology.THESIS_49}
          </Button>
        ),
        () => (
          <Button
            type="primary"
            icon={<Icon component={CheckCircleIcon} />}
            loading={switchButtonLoading}
            onClick={showStatusConfirm}>
            {ThesisTerminology.THESIS_29}
          </Button>
        )
      );
    }
  }

  return (
    <Space size="middle">
      {buttonList.map((ButtonItem, index) => (
        <ButtonItem key={index} />
      ))}
    </Space>
  );
};

export default ThesisInfoButtons;
