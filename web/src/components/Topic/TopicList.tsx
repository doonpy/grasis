import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Space, Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import Link from 'next/link';
import React, { useState } from 'react';

import { TopicTerminology } from '../../assets/terminology/topic.terminology';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import ThesisService from '../../libs/thesis/thesis.service';
import { TopicPath } from '../../libs/topic/topic.resource';
import TopicService from '../../libs/topic/topic.service';
import LoginUser from '../../libs/user/instance/LoginUser';
import SearchBox from '../Common/SearchBox';
import { TopicTableColumns } from './TopicTableColumns';

interface ComponentProps {
  thesisId: number;
  canFetch: boolean;
}

const TopicList: React.FC<ComponentProps> = ({ thesisId, canFetch }) => {
  const loginUser = LoginUser.getInstance();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: false
  });
  const [keyword, setKeyword] = useState<string>('');
  const topicService = TopicService.getInstance();
  const thesisService = ThesisService.getInstance();
  const { data: topicData, isLoading } = topicService.useTopics(
    thesisId,
    pagination.current,
    pagination.pageSize,
    keyword,
    canFetch
  );
  const { data: thesisData } = thesisService.useThesis(thesisId, canFetch);
  if (!topicData || !thesisData) {
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
          {loginUser.isLecturer() &&
            thesisData &&
            thesisData.thesis.state === ThesisState.LECTURER_TOPIC_REGISTER && (
              <Link href={topicService.replaceParams(TopicPath.CREATE, [thesisId])}>
                <Button type="primary" icon={<PlusOutlined />} disabled={isLoading}>
                  {TopicTerminology.TOPIC_1}
                </Button>
              </Link>
            )}
          <SearchBox onSearch={onSearch} disabled={isLoading} />
        </Space>
      )}
      bordered
      columns={TopicTableColumns}
      dataSource={topicData && topicData.topics}
      loading={isLoading}
      pagination={pagination}
      size="middle"
      onChange={handleTableChange}
    />
  );
};

export default TopicList;
