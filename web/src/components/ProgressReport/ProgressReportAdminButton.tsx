import Icon from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useState } from 'react';

import EditIcon from '../../assets/svg/regular/edit.svg';
import { ProgressReportTerminology } from '../../assets/terminology/progress-report.terminology';
import { ProgressReportForView } from '../../libs/progress-report/progress-report.interface';
import ProgressReportEditModal from './ProgressReportEditModal';

interface ComponentProps {
  progressReport: ProgressReportForView;
}

const ProgressReportAdminButton: React.FC<ComponentProps> = ({ progressReport }) => {
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const onClickEditButton = () => {
    if (!editModalVisible) {
      setEditModalVisible(true);
    }
  };

  return (
    <Space>
      <ProgressReportEditModal
        progressReport={progressReport}
        visible={editModalVisible}
        setVisible={setEditModalVisible}
      />
      <Button type="primary" icon={<Icon component={EditIcon} />} onClick={onClickEditButton}>
        {ProgressReportTerminology.PR_8}
      </Button>
    </Space>
  );
};

export default ProgressReportAdminButton;
