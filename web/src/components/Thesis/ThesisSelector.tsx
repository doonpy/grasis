import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { sortByNumber } from '../../libs/common/common.helper';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import { ThesisForListView } from '../../libs/thesis/thesis.type';

interface ComponentProps {
  thesisId: number;
  setThesisId: React.Dispatch<number>;
}

const ThesisSelector: React.FC<ComponentProps> = ({ thesisId, setThesisId }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const [keyword, setKeyword] = useState<string>('');
  const thesisService = ThesisService.getInstance();
  const { data, isLoading } = thesisService.useTheses(
    pagination.current,
    pagination.pageSize,
    keyword,
    keyword !== '' && thesisId === 0
  );
  const [theses, setTheses] = useState<ThesisForListView[]>(data ? data.theses : []);

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const handleChange = (value: number) => {
    setThesisId(value);
  };

  const handlePopupScroll = (event: any) => {
    const element = event.target;
    if (element.scrollHeight === element.clientHeight + element.scrollTop) {
      setPagination({ ...pagination, current: pagination.current + 1 });
    }
  };

  const handleFilter = (input: string, option: any) => {
    if (!option) {
      return false;
    }

    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  useEffect(() => {
    if (data) {
      const currentThesisIds = theses.map(({ id }) => id);
      setTheses([...theses, ...data.theses.filter(({ id }) => !currentThesisIds.includes(id))]);
    }
  }, [data]);

  return (
    <Select
      onSearch={handleSearch}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      filterSort={(a, b) => sortByNumber(a.value, b.value)}
      placeholder={ThesisTerminology.THESIS_50}
      showSearch={true}
      filterOption={handleFilter}
      value={thesisId}
      notFoundContent={isLoading ? <Spin size="small" /> : null}
      style={{ width: '100%' }}>
      <Select.Option key={-1} value={0}>
        ---------------
      </Select.Option>
      {theses.map((thesis, index) => (
        <Select.Option key={index} value={thesis.id}>
          {thesis.subject}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ThesisSelector;
