import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { sortByNumber } from '../../libs/common/common.helper';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import TopicService from '../../libs/topic/topic.service';
import { Topic } from '../../libs/topic/topic.type';

interface ComponentProps {
  thesisId: number;
  topicId: number;
  setTopicId: React.Dispatch<number>;
}

const TopicSelector: React.FC<ComponentProps> = ({ thesisId, topicId, setTopicId }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const [keyword, setKeyword] = useState<string>('');
  const topicService = TopicService.getInstance();
  const { data, isLoading } = topicService.useTopics(
    thesisId,
    pagination.current,
    pagination.pageSize,
    keyword,
    keyword !== '' && topicId === 0
  );
  const [topics, setTopics] = useState<Topic[]>(data ? data.topics : []);

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const handleChange = (value: number) => {
    setTopicId(value);
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
      const currentTopicIds = topics.map(({ id }) => id);
      setTopics([...topics, ...data.topics.filter(({ id }) => !currentTopicIds.includes(id))]);
    }
  }, [data]);

  return (
    <Select
      disabled={!thesisId}
      onSearch={handleSearch}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      filterSort={(a, b) => sortByNumber(a.value, b.value)}
      placeholder={TopicTerminology.TOPIC_69}
      showSearch={true}
      filterOption={handleFilter}
      value={topicId}
      notFoundContent={isLoading ? <Spin size="small" /> : null}
      style={{ width: '100%' }}>
      <Select.Option key={-1} value={0}>
        ---------------
      </Select.Option>
      {topics.map((thesis, index) => (
        <Select.Option key={index} value={thesis.id}>
          {thesis.subject}
        </Select.Option>
      ))}
    </Select>
  );
};

export default TopicSelector;
