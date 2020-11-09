import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Comment, List, message, Modal, Space, Tag, Tooltip } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import React, { useEffect, useState } from 'react';

import TrashAltIcon from '../../assets/svg/regular/trash-alt.svg';
import { CommentTerminology } from '../../assets/terminology/comment.terminology';
import { CommentMode } from '../../libs/comment/comment.resource';
import CommentService from '../../libs/comment/comment.service';
import { DEFAULT_PAGE_SIZE } from '../../libs/common/common.resource';
import { ThesisState } from '../../libs/thesis/thesis.resource';
import LoginUser from '../../libs/user/instance/LoginUser';
import AvatarForComment from '../Avatar/AvatarForComment';
import DateData from '../Common/DateData';
import TextData from '../Common/TextData';
const { confirm } = Modal;

interface ComponentProps {
  topicId: number;
  state: ThesisState;
}

export const CommentList: React.FC<ComponentProps> = ({ topicId, state }) => {
  const commentService = CommentService.getInstance();
  const loginUser = LoginUser.getInstance();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE - 10,
    total: 0,
    showSizeChanger: false,
    size: 'small',
    onChange: (page) => {
      setPagination({ ...pagination, current: page });
    }
  });

  const { data, isLoading } = commentService.useComments(
    topicId,
    state,
    pagination.current,
    pagination.pageSize
  );

  const onClickDeleteButton = async (commentId: number) => {
    confirm({
      title: CommentTerminology.COMMENT_8,
      content: CommentTerminology.COMMENT_9,
      icon: <ExclamationCircleOutlined />,
      okText: CommentTerminology.COMMENT_2,
      cancelText: CommentTerminology.COMMENT_10,
      cancelButtonProps: { type: 'primary', danger: true },
      async onOk() {
        try {
          await commentService.deleteById(commentId);
          message.success(CommentTerminology.COMMENT_11);
        } catch (error) {
          await commentService.requestErrorHandler(error);
        }
      }
    });
  };

  useEffect(() => {
    if (data) {
      setPagination({ ...pagination, total: data.total });
    }
  }, [data]);

  return (
    <List
      loading={isLoading}
      itemLayout="horizontal"
      pagination={pagination}
      dataSource={data && data.comments}
      renderItem={({
        id: commentId,
        content,
        mode,
        createdAt,
        creatorInfo: { id, firstname, lastname }
      }) => {
        const fullName = `${lastname || ''} ${firstname || ''}`;

        return (
          <List.Item>
            <Comment
              author={<a>{fullName}</a>}
              avatar={<AvatarForComment id={id} firstname={firstname} lastname={lastname} />}
              content={<TextData text={content} isParagraph={true} />}
              datetime={
                <Space>
                  <DateData date={createdAt} isRelative={true} />
                  {mode === CommentMode.PRIVATE && (
                    <Tag color="red">{CommentTerminology.COMMENT_5}</Tag>
                  )}
                  {id === loginUser.getId() && (
                    <Tooltip title={CommentTerminology.COMMENT_7}>
                      <Button
                        type="link"
                        danger
                        size="small"
                        icon={
                          <Icon
                            component={TrashAltIcon}
                            onClick={() => onClickDeleteButton(commentId)}
                          />
                        }
                      />
                    </Tooltip>
                  )}
                </Space>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default CommentList;
