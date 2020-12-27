import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import EditIcon from '../../assets/svg/regular/edit.svg';
import TrashAltIcon from '../../assets/svg/regular/trash-alt.svg';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import CouncilAdminService from '../../libs/council/admin.service';
import { CouncilForView } from '../../libs/council/council.type';
import CouncilForm from './CouncilForm';
const { confirm } = Modal;

interface ComponentProps {
  council: CouncilForView;
  councils: CouncilForView[];
  setCouncils: React.Dispatch<CouncilForView[]>;
}

const CouncilItemAction: React.FC<ComponentProps> = ({ council, councils, setCouncils }) => {
  const router = useRouter();
  const councilService = CouncilAdminService.getInstance();
  const thesisId = parseInt(router.query.thesisId as string);
  const [visible, setVisible] = useState<boolean>(false);

  const handleDeleteButton = async () => {
    confirm({
      title: CouncilTerminology.COUNCIL_15,
      icon: <ExclamationCircleOutlined />,
      content: CouncilTerminology.COUNCIL_16,
      okText: CommonTerminology.COMMON_9,
      cancelText: CommonTerminology.COMMON_10,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await councilService.deleteById(council.id);
          setCouncils(councils.filter(({ id }) => id !== council.id));
          message.success(CouncilTerminology.COUNCIL_14);
        } catch (error) {
          await councilService.requestErrorHandler(error);
        }
      }
    });
  };

  const onClickEditButton = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  return (
    <Space>
      <CouncilForm
        thesisId={thesisId}
        council={council}
        visible={visible}
        setVisible={setVisible}
        councils={councils}
        setCouncils={setCouncils}
      />
      <Button
        shape="circle"
        type="primary"
        icon={<Icon component={EditIcon} />}
        onClick={onClickEditButton}
      />
      <Button
        shape="circle"
        type="primary"
        icon={<Icon component={TrashAltIcon} />}
        danger
        onClick={handleDeleteButton}
      />
    </Space>
  );
};

export default CouncilItemAction;
