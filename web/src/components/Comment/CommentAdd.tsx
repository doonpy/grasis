import { Button, Comment, Form, Input, message, Select, Space } from 'antd';
import React, { ChangeEvent, useState } from 'react';

import { CommentTerminology } from '../../assets/terminology/comment.terminology';
import { CommentMode } from '../../libs/comment/comment.resource';
import CommentService from '../../libs/comment/comment.service';
import { ReportModule } from '../../libs/common/common.resource';
import LoginUser from '../../libs/user/instance/LoginUser';
import AvatarForComment from '../Avatar/AvatarForComment';

interface ComponentProps {
  topicId: number;
  module: ReportModule;
}

const CommentAdd: React.FC<ComponentProps> = ({ topicId, module }) => {
  const loginUser = LoginUser.getInstance();
  const commentService = CommentService.getInstance();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<CommentMode>(CommentMode.PUBLIC);
  const [content, setContent] = useState<string>('');

  const onModeChange = (value: CommentMode) => {
    setMode(value);
  };

  const onContentChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(value);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await commentService.addComment(topicId, mode, module, content);
      setContent('');
      message.success(CommentTerminology.COMMENT_6);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await commentService.requestErrorHandler(error);
    }
  };

  return (
    <Comment
      avatar={
        <AvatarForComment
          id={loginUser.getId()}
          firstname={loginUser.getFirstname()}
          lastname={loginUser.getLastname()}
        />
      }
      content={
        <>
          <Form.Item>
            <Input.TextArea
              rows={4}
              placeholder={CommentTerminology.COMMENT_3}
              value={content}
              onChange={onContentChange}
            />
          </Form.Item>
          <Space size="middle">
            {!loginUser.isStudent() && (
              <Select
                defaultValue={CommentMode.PUBLIC}
                style={{ width: 120 }}
                onChange={onModeChange}>
                <Select.Option value={CommentMode.PUBLIC}>
                  {CommentTerminology.COMMENT_4}
                </Select.Option>
                <Select.Option value={CommentMode.PRIVATE}>
                  {CommentTerminology.COMMENT_5}
                </Select.Option>
              </Select>
            )}
            <Button
              disabled={content.length === 0}
              loading={loading}
              type="primary"
              onClick={onSubmit}>
              {CommentTerminology.COMMENT_2}
            </Button>
          </Space>
        </>
      }
    />
  );
};

export default CommentAdd;
