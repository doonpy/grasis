import { Alert, Col, Descriptions, Row, Space } from 'antd';
import React, { ReactElement } from 'react';

import { CommonTerminology } from '../../../assets/terminology/common.terminology';
import { TopicTerminology } from '../../../assets/terminology/topic.terminology';
import { ReportModule } from '../../../libs/common/common.resource';
import { TopicStateBaseForView } from '../../../libs/topic/topic-state/topic-state.type';
import UploadService from '../../../libs/upload/upload.service';
import CommentList from '../../Comment/CommentList';
import DateData from '../../Common/DateData';
import TextData from '../../Common/TextData';
import StudentFastView from '../../Student/StudentFastView';
import UploadViewReport from '../../Upload/UploadViewReport';

interface ExtendInfo {
  label: string;
  element: ReactElement;
}

interface ComponentProps {
  stateInfo: TopicStateBaseForView;
  buttons: ReactElement;
  extra?: React.ReactNode;
  module: ReportModule;
  extendInfo?: ExtendInfo[];
  canFetch: boolean;
  canUpload: boolean;
  canDelete: boolean;
}

const StateBaseInfo: React.FC<ComponentProps> = ({
  stateInfo,
  buttons,
  module,
  extendInfo = [],
  canFetch,
  canUpload,
  canDelete
}) => {
  const uploadService = UploadService.getInstance();

  return (
    <Row gutter={24}>
      <Col span={14}>
        <Descriptions bordered title={buttons}>
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
            <Alert message={uploadService.getUploadReportMessage(module)} type="info" showIcon />
            <UploadViewReport
              topicId={stateInfo.id}
              module={module}
              canUpload={canUpload}
              canDelete={canDelete}
              canFetch={canFetch}
            />
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={9} offset={1}>
        <CommentList topicId={stateInfo.id} module={module} />
      </Col>
    </Row>
  );
};

export default StateBaseInfo;
