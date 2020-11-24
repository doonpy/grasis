import Icon from '@ant-design/icons';
import { Button, Drawer, Form, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import EditIcon from '../../../../assets/svg/regular/edit.svg';
import { CommonTerminology } from '../../../../assets/terminology/common.terminology';
import { DefenseTerminology } from '../../../../assets/terminology/defense.terminology';
import { NOT_SELECT_ID } from '../../../../libs/common/common.resource';
import { CouncilForView } from '../../../../libs/council/council.type';
import DefenseAdminService from '../../../../libs/defense/admin.service';
import { COUNCIL_ID_FIELD } from '../../../../libs/defense/defense.resource';
import { DefenseForView, DefenseRequestBody } from '../../../../libs/defense/defense.type';
import LoginUser from '../../../../libs/user/instance/LoginUser';
import CouncilSelectInThesis from '../../../Council/CouncilSelectInThesis';
import StateEditBaseItem from '../StateEditBaseItem';

interface ComponentProps {
  thesisId: number;
  defense: DefenseForView;
  validDateRange: [string | Moment, string | Moment];
  thesisCreatorId: number;
  defaultCouncil: CouncilForView | null;
}

const DefenseEdit: React.FC<ComponentProps> = ({
  thesisId,
  defense,
  validDateRange,
  thesisCreatorId,
  defaultCouncil
}) => {
  const adminService = DefenseAdminService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = useForm();
  const onClickEditButton = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFormSubmit = async (formValues: DefenseRequestBody) => {
    setLoading(true);
    try {
      await adminService.updateById(defense.id, formValues);
      message.success(DefenseTerminology.DEFENSE_6);
      setLoading(false);
      setVisible(false);
    } catch (error) {
      setLoading(false);
      await adminService.requestErrorHandler(error);
    }
  };

  useEffect(() => {
    if (!visible) {
      defense.time = moment(defense.time);
      if (defense.councilId === null) {
        defense.councilId = NOT_SELECT_ID;
      }

      form.setFieldsValue(defense);
    }
  }, [defense]);

  if (!loginUser.isAdmin() || loginUser.getId() !== thesisCreatorId) {
    return <></>;
  }

  return (
    <>
      <Drawer
        title={DefenseTerminology.DEFENSE_5}
        width={720}
        onClose={handleCancel}
        visible={visible}>
        <Form form={form} requiredMark={true} layout="vertical" onFinish={onFormSubmit}>
          <StateEditBaseItem validDateRange={validDateRange} />
          <CouncilSelectInThesis
            thesisId={thesisId}
            fieldName={COUNCIL_ID_FIELD}
            defaultValue={
              defaultCouncil ? { name: defaultCouncil.name, id: defaultCouncil.id } : null
            }
            label={DefenseTerminology.DEFENSE_2}
            emptyValue={true}
          />
          <Space size="middle">
            <Button loading={loading} onClick={handleOk} type="primary">
              {CommonTerminology.COMMON_9}
            </Button>
            <Button loading={loading} onClick={handleCancel} type="primary" danger>
              {CommonTerminology.COMMON_10}
            </Button>
          </Space>
        </Form>
      </Drawer>
      <Button type="primary" icon={<Icon component={EditIcon} />} onClick={onClickEditButton}>
        {CommonTerminology.COMMON_12}
      </Button>
    </>
  );
};

export default DefenseEdit;
