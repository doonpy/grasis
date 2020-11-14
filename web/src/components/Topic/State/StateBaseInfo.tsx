import { Col, Descriptions, Row, Space } from 'antd';
import React, { ReactElement } from 'react';

import { CommonTerminology } from '../../../assets/terminology/common.terminology';
import { TopicTerminology } from '../../../assets/terminology/topic.terminology';
import { ReportModule } from '../../../libs/common/common.resource';
import { TopicStateBaseForView } from '../../../libs/topic/topic-state/topic-state.type';
import LoginUser from '../../../libs/user/instance/LoginUser';
import CommentAdd from '../../Comment/CommentAdd';
import CommentList from '../../Comment/CommentList';
import DateData from '../../Common/DateData';
import TextData from '../../Common/TextData';
import ReportFileView from '../../ReportFile/ReportFileView';
import StudentFastView from '../../Student/StudentFastView';

interface ExtendInfo {
  label: string;
  element: ReactElement;
}

interface ComponentProps {
  stateInfo: TopicStateBaseForView;
  adminButton: ReactElement;
  extra?: React.ReactNode;
  module: ReportModule;
  extendInfo?: ExtendInfo[];
}

const StateBaseInfo: React.FC<ComponentProps> = ({
  stateInfo,
  adminButton,
  module,
  extendInfo = [],
  extra
}) => {
  const loginUser = LoginUser.getInstance();

  return (
    <Row gutter={24}>
      <Col span={14}>
        <Descriptions bordered title={adminButton} extra={extra}>
          <Descriptions.Item label={<b>{TopicTerminology.TOPIC_58}</b>} span={3}>
            <Space direction="vertical">
              {stateInfo.reporters.map((reporter, index) => (
                <StudentFastView key={index} student={reporter} />
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={<b>{TopicTerminology.TOPIC_55}</b>} span={3}>
            <DateData date={stateInfo.time} />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{TopicTerminology.TOPIC_56}</b>} span={3}>
            <TextData text={stateInfo.place} />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{CommonTerminology.COMMON_1}</b>} span={3}>
            <DateData date={stateInfo.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{CommonTerminology.COMMON_2}</b>} span={3}>
            <DateData date={stateInfo.updatedAt} isRelative={true} />
          </Descriptions.Item>
          <Descriptions.Item label={<b>{TopicTerminology.TOPIC_57}</b>} span={3}>
            <TextData text={stateInfo.note} isParagraph={true} />
          </Descriptions.Item>
          {extendInfo.map(({ label, element }, key) => (
            <Descriptions.Item key={key} label={<b>{label}</b>} span={3}>
              {element}
            </Descriptions.Item>
          ))}
          <Descriptions.Item label={<b>{TopicTerminology.TOPIC_60}</b>} span={3}>
            <ReportFileView
              topicId={stateInfo.id}
              module={module}
              canAction={loginUser.isStudent()}
            />
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={9} offset={1}>
        <CommentAdd topicId={stateInfo.id} module={module} />
        <CommentList topicId={stateInfo.id} module={module} />
      </Col>
    </Row>
  );
};

export default StateBaseInfo;
