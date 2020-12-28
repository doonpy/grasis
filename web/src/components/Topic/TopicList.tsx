import { Empty, Space, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useEffect, useState } from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import { ThesisForView } from '../../libs/thesis/thesis.type';
import TopicService from '../../libs/topic/topic.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import SearchBox from '../Common/SearchBox';
import TopicCreateAndUpdate from './TopicCreateAndUpdate';
import { TopicTableColumns } from './TopicTableColumns';

interface ComponentProps {
  thesis: ThesisForView;
  canFetch: boolean;
}

const TopicList: React.FC<ComponentProps> = ({ thesis, canFetch }) => {
  const loginUser = LoginUser.getInstance();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const [keyword, setKeyword] = useState<string>('');
  const topicService = TopicService.getInstance();
  const { data, isLoading } = topicService.useTopics(
    thesis.id,
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

  if (!data) {
    return <Empty description={TopicTerminology.TOPIC_63} />;
  }

  const handleTableChange = (paginationValues: PaginationProps) => {
    setPagination({ ...pagination, ...paginationValues });
  };

  const onSearch = (value: string) => {
    setKeyword(value);
  };

  return (
    <Table
      title={() => (
        <Space size="middle">
          {loginUser.isLecturer() && thesis.state === ThesisState.LECTURER_TOPIC_REGISTER && (
            <TopicCreateAndUpdate thesisId={thesis.id} />
          )}
          <SearchBox onSearch={onSearch} disabled={isLoading} />
        </Space>
      )}
      bordered
      columns={TopicTableColumns}
      dataSource={data.topics}
      loading={isLoading}
      pagination={pagination}
      size="middle"
      onChange={handleTableChange}
    />
  );
};

export default TopicList;
