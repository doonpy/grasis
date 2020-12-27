import Icon from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useEffect, useState } from 'react';

import PlusIcon from '../../assets/svg/regular/plus.svg';
import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import CouncilAdminService from '../../libs/council/admin.service';
import { CouncilForView } from '../../libs/council/council.type';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import LoginUser from '../../libs/user/instance/LoginUser';
import SearchBox from '../Common/SearchBox';
import CouncilForm from './CouncilForm';
import CouncilItemAction from './CouncilItemAction';
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
  const { data, isLoading } = councilService.useCouncils(
    thesis.id,
    pagination.current,
    pagination.pageSize,
    keyword,
    canFetch
  );
  const [councils, setCouncils] = useState<CouncilForView[]>(data ? data.councils : []);
  useEffect(() => {
    if (data) {
      setCouncils(data.councils);
    }
  }, [data]);

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

  const actionColumn = CouncilTableColumns.find(({ key }) => key === 'action');
  if (actionColumn) {
    actionColumn.render = (value: CouncilForView) => (
      <CouncilItemAction council={value} councils={councils} setCouncils={setCouncils} />
    );
  }

  return (
    <Table
      title={() => (
        <Space size="middle">
          {loginUser.isAdmin() && thesis.creatorId === loginUser.getId() && (
            <>
              <CouncilForm
                thesisId={thesis.id}
                visible={visible}
                setVisible={setVisible}
                councils={councils}
                setCouncils={setCouncils}
              />
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
      dataSource={councils}
      loading={isLoading}
      pagination={pagination}
      size="middle"
      onChange={handleTableChange}
    />
  );
};

export default CouncilList;
