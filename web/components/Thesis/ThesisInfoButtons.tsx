import Icon from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import CheckCircleIcon from '../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../assets/svg/regular/minus-circle.svg';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import ThesisAdminService from '../../libs/thesis/admin.service';
import { ThesisStatus } from '../../libs/thesis/thesis.resource';
import LoginUser from '../../libs/user/instance/LoginUser';

interface ComponentProps {
  thesisId: number;
  status: ThesisStatus;
}

const ThesisInfoButtons: React.FC<ComponentProps> = ({ thesisId, status }) => {
  const [switchButtonLoading, setSwitchButtonLoading] = useState<boolean>(false);
  const [thesisStatus, setThesisStatus] = useState<ThesisStatus>(status);
  const loginUser = LoginUser.getInstance();
  const buttonList: React.FC[] = [];
  const adminService = ThesisAdminService.getInstance();

  const onSwitchStatus = async () => {
    try {
      if (switchButtonLoading) {
        adminService.apiService.cancelPreviousRequest();
      }

      setSwitchButtonLoading(true);
      const { data } = await adminService.switchStatus(thesisId);
      setThesisStatus(data.currentStatus);
    } catch (error) {
      await adminService.requestErrorHandler(error);
    }
    setSwitchButtonLoading(false);
  };

  if (loginUser.isAdmin()) {
    if (thesisStatus === ThesisStatus.ACTIVE) {
      buttonList.push(() => (
        <Button
          type="primary"
          icon={<Icon component={MinusCircleIcon} />}
          danger
          loading={switchButtonLoading}
          onClick={onSwitchStatus}>
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
          onClick={onSwitchStatus}>
          {ThesisTerminology.THESIS_29}
        </Button>
      ));
    }
  }

  useEffect(() => {
    setThesisStatus(status);
  }, [status]);

  return (
    <Space>
      {buttonList.map((ButtonItem, index) => (
        <ButtonItem key={index} />
      ))}
    </Space>
  );
};

export default ThesisInfoButtons;