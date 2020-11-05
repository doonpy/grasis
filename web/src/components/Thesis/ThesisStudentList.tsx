import { Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useEffect, useState } from 'react';

import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import SearchBox from '../Common/SearchBox';
import { ThesisStudentTableColumns } from './ThesisStudentTableColumns';

interface ComponentPros {
  thesisId: number;
}

const ThesisStudentList: React.FC<ComponentPros> = ({ thesisId }) => {
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
  const { data, isLoading } = thesisService.useThesisStudents(
    thesisId,
    pagination.current,
    pagination.pageSize,
    keyword
  );
  const handleTableChange = (paginationValues: PaginationProps) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  useEffect(() => {
    if (data) {
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  return (
    <Table
      bordered
      columns={ThesisStudentTableColumns}
      dataSource={data && data.students}
      loading={isLoading}
      pagination={pagination}
      size="middle"
      onChange={handleTableChange}
      title={() => <SearchBox onSearch={onSearch} />}
    />
  );
};

export default ThesisStudentList;
