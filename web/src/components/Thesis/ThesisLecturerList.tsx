import { Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useEffect, useState } from 'react';

import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import SearchBox from '../Common/SearchBox';
import { ThesisLecturerTableColumns } from './ThesisLecturerTableColumns';

interface ComponentPros {
  thesisId: number;
  canFetch: boolean;
}

const ThesisLecturerList: React.FC<ComponentPros> = ({ thesisId, canFetch }) => {
  const thesisService = ThesisService.getInstance();
  const [keyword, setKeyword] = useState<string>('');
  const onSearch = (value: string) => {
    setKeyword(value);
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const { data, isLoading } = thesisService.useThesisLecturers(
    thesisId,
    pagination.current,
    pagination.pageSize,
    keyword,
    canFetch
  );

  useEffect(() => {
    if (data) {
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  const handleTableChange = (paginationValues: PaginationProps) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  return (
    <Table
      bordered
      columns={ThesisLecturerTableColumns}
      dataSource={data && data.lecturers}
      loading={isLoading}
      pagination={pagination}
      size="middle"
      onChange={handleTableChange}
      title={() => <SearchBox onSearch={onSearch} disabled={isLoading} />}
    />
  );
};

export default ThesisLecturerList;
