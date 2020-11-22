import { Form, Select, Spin, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useState } from 'react';

import { CouncilTerminology } from '../../assets/terminology/council.terminology';
import { NOT_SELECT_ID } from '../../libs/common/common.resource';
import CouncilService from '../../libs/council/council.service';
import { CouncilSearchInThesisByName } from '../../libs/defense/defense.type';
import TextData from '../Common/TextData';

interface ComponentProps {
  thesisId: number;
  defaultValue: CouncilSearchInThesisByName | null;
  fieldName: string;
  label: string;
  emptyValue?: boolean;
  rules?: Rule[];
}

const CouncilSelectInThesis: React.FC<ComponentProps> = ({
  thesisId,
  defaultValue,
  fieldName,
  label,
  emptyValue,
  rules
}) => {
  const [councils, setCouncils] = useState<CouncilSearchInThesisByName[]>(
    defaultValue ? [defaultValue] : []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const councilService = CouncilService.getInstance();

  const onSearch = async (value: string) => {
    try {
      setLoading(true);
      const result = await councilService.searchInThesisByName(value, thesisId);
      setCouncils(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await councilService.requestErrorHandler(error);
    }
  };

  return (
    <Form.Item label={<b>{label}</b>} name={fieldName} rules={rules}>
      <Select
        defaultActiveFirstOption={false}
        showSearch={true}
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={onSearch}>
        {emptyValue && (
          <Select.Option key={NOT_SELECT_ID} value={NOT_SELECT_ID}>
            <Typography.Text type="secondary">{CouncilTerminology.COUNCIL_18}</Typography.Text>
          </Select.Option>
        )}
        {councils.map(({ id, name }, index) => (
          <Select.Option key={index} value={id}>
            <TextData text={name} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default CouncilSelectInThesis;
