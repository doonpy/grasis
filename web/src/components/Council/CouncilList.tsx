import Icon from '@ant-design/icons';
import { Button, Empty, Space, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useState } from 'react';

import PlusIcon from '../../assets/svg/regular/plus.svg';
import { CommonTerminology } from '../../assets/terminology/common.terminology';
import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import CouncilAdminService from '../../libs/council/admin.service';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import SearchBox from '../Common/SearchBox';
import CouncilForm from './CouncilForm';
import { CouncilTableColumns } from './CouncilTableColumns';

interface ComponentProps {
  thesis: ThesisForView;
  canFetch: boolean;
}

const CouncilList: React.FC<ComponentProps> = ({ thesis, canFetch }) => {
  const loginUser = LoginUser.getInstance();
  const councilService = CouncilAdminService.getInstance();
  const [keyword, setKeyword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });

  const { data: councilData, isLoading } = councilService.useCouncils(
    thesis.id,
    pagination.current,
    pagination.pageSize,
    keyword,
    canFetch
  );

  if (!councilData) {
    return <Empty description={CommonTerminology.COMMON_11} />;
  }

  const handleTableChange = (paginationValues: PaginationProps) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  const onSearch = (value: string) => {
    setKeyword(value);
  };

  const onClickAddButton = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  return (
    <Table
      title={() => (
        <Space size="middle">
          {loginUser.isAdmin() && thesis.creatorId === loginUser.getId() && (
            <>
              <CouncilForm thesisId={thesis.id} visible={visible} setVisible={setVisible} />
              <Button
                type="primary"
                icon={<Icon component={PlusIcon} />}
                onClick={onClickAddButton}>
                {CouncilTerminology.COUNCIL_6}
              </Button>
            </>
          )}
          <SearchBox onSearch={onSearch} disabled={isLoading} />
        </Space>
      )}
      bordered
      columns={CouncilTableColumns}
      dataSource={councilData && councilData.councils}
      loading={isLoading}
      pagination={pagination}
      size="middle"
      onChange={handleTableChange}
    />
  );
};

export default CouncilList;
