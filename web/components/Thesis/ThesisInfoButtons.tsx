import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import ListAltIcon from '../../assets/svg/regular/list-alt.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import ThesisAdminService from '../../libs/thesis/admin.service';
import { ThesisStatus } from '../../libs/thesis/thesis.resource';
import { TOPIC_PATH_ROOT } from '../../libs/topic/topic.resource';
import LoginUser from '../../libs/user/instance/LoginUser';
const { confirm } = Modal;

interface ComponentProps {
  thesisId: number;
  status: ThesisStatus;
}

const ThesisInfoButtons: React.FC<ComponentProps> = ({ thesisId, status }) => {
  const [switchButtonLoading, setSwitchButtonLoading] = useState<boolean>(false);
  const [thesisStatus, setThesisStatus] = useState<ThesisStatus>(status);
  const loginUser = LoginUser.getInstance();
  const adminService = ThesisAdminService.getInstance();
  const buttonList: React.FC[] = [
    () => (
      <Button
        type="primary"
        icon={<Icon component={ListAltIcon} />}
        loading={switchButtonLoading}
        onClick={onClickTopicsButton}>
        {ThesisTerminology.THESIS_42}
      </Button>
    )
  ];

  const onClickTopicsButton = async () => {
    await adminService.redirectService.redirectTo(
      adminService.replaceParams(TOPIC_PATH_ROOT, [thesisId])
    );
  };

  const showStatusConfirm = () => {
    confirm({
      title:
        thesisStatus === ThesisStatus.INACTIVE
          ? ThesisTerminology.THESIS_38
          : ThesisTerminology.THESIS_39,
      icon: <ExclamationCircleOutlined />,
      content:
        thesisStatus === ThesisStatus.INACTIVE
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
          const { data } = await adminService.switchStatus(thesisId);
          setThesisStatus(data.currentStatus);
          if (thesisStatus === ThesisStatus.INACTIVE) {
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
    if (thesisStatus === ThesisStatus.ACTIVE) {
      buttonList.push(() => (
        <Button
          type="primary"
          icon={<Icon component={MinusCircleIcon} />}
          danger
          loading={switchButtonLoading}
          onClick={showStatusConfirm}>
          {ThesisTerminology.THESIS_28}
        </Button>
      ));
    }

    if (thesisStatus === ThesisStatus.INACTIVE) {
      buttonList.push(() => (
        <Button
          type="primary"
          icon={<Icon component={CheckCircleIcon} />}
          loading={switchButtonLoading}
          onClick={showStatusConfirm}>
          {ThesisTerminology.THESIS_29}
        </Button>
      ));
    }
  }

  useEffect(() => {
    setThesisStatus(status);
  }, [status]);

  return (
    <Space size="middle">
      {buttonList.map((ButtonItem, index) => (
        <ButtonItem key={index} />
      ))}
    </Space>
  );
};

export default ThesisInfoButtons;
