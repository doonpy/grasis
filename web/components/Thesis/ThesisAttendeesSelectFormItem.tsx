import 'moment/locale/vi';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Form, Space, Spin, Transfer } from 'antd';
import { TransferDirection, TransferItem } from 'antd/lib/transfer';
import React, { useState } from 'react';

import ThesisTerminology from '../../assets/terminology/thesis.terminology';
import { getAvatarUrl } from '../../libs/avatar/avatar.service';
import CommonService from '../../libs/common/common.service';
import { LecturerSearchAttendee } from '../../libs/lecturer/lecturer.interface';
import { LecturerSearchType } from '../../libs/lecturer/lecturer.resource';
import LecturerService from '../../libs/lecturer/lecturer.service';
import { StudentSearchAttendee } from '../../libs/student/student.interface';
import { StudentSearchType } from '../../libs/student/student.resource';
import StudentService from '../../libs/student/student.service';
import { ThesisAttendeeTarget } from '../../libs/thesis/thesis.resource';
import LecturerSearchTypes from '../Lecturer/LecturerSearchTypes';
import StudentSearchTypes from '../Student/StudentSearchTypes';

interface ComponentProps {
  attendeeTarget: ThesisAttendeeTarget;
  initAttendees?: LecturerSearchAttendee[] | StudentSearchAttendee[];
  initSelectedKey?: string[];
}

const ThesisAttendeesSelectFormItem: React.FC<ComponentProps> = ({
  attendeeTarget,
  initAttendees = [],
  initSelectedKey = []
}) => {
  const terminology =
    attendeeTarget === ThesisAttendeeTarget.LECTURER
      ? ThesisTerminology.THESIS_1
      : ThesisTerminology.THESIS_2;
  const service = CommonService.getInstance();
  const studentService = StudentService.getInstance();
  const lecturerService = LecturerService.getInstance();
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>(initSelectedKey);
  const [searchTypes, setSearchTypes] = useState<(LecturerSearchType | StudentSearchType)[]>([
    LecturerSearchType.FULL_NAME
  ]);
  const [sourceAttendees, setSourceAttendees] = useState<TransferItem[]>(
    attendeeTarget === ThesisAttendeeTarget.LECTURER
      ? lecturerService.convertToTransferItem(initAttendees)
      : studentService.convertToTransferItem(initAttendees as StudentSearchAttendee[])
  );
  const [targetAttendees, setTargetAttendees] = useState<TransferItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const onMoveChange = (targetKeys: string[]) => {
    const selectedTransferItem: TransferItem[] = [];
    targetKeys.forEach((targetKey) => {
      const transferItem = sourceAttendees.find(({ key }) => key === targetKey);
      if (transferItem) {
        selectedTransferItem.push(transferItem);
      }
    });
    setTargetAttendees(selectedTransferItem);
    setSelectedAttendees(targetKeys);
  };

  const onSearchTypeChange = (checkedValue: LecturerSearchType[]) => {
    setSearchTypes(checkedValue);
  };

  const onKeywordChange = async (direction: TransferDirection, value: string) => {
    if (direction === 'right') {
      return;
    }

    try {
      if (isSearching) {
        await service.apiService.cancelPreviousRequest();
        setIsSearching(false);
      }

      setIsSearching(true);
      const {
        data: { result }
      } = await service.searchThesisAttendees(value, searchTypes, attendeeTarget);

      let transferItems: TransferItem[];
      if (attendeeTarget === ThesisAttendeeTarget.LECTURER) {
        transferItems = lecturerService.convertToTransferItem(result);
      } else {
        transferItems = studentService.convertToTransferItem(result as StudentSearchAttendee[]);
      }

      if (transferItems.length !== 0) {
        setSourceAttendees([...targetAttendees, ...transferItems]);
      }

      setIsSearching(false);
    } catch (error) {
      await service.requestErrorHandler(error);
    }
  };

  const renderFooter = ({ direction }) => {
    if (direction === 'left') {
      return (
        <Form.Item noStyle>
          {attendeeTarget === ThesisAttendeeTarget.LECTURER ? (
            <LecturerSearchTypes
              searchTypes={searchTypes as LecturerSearchType[]}
              onChange={onSearchTypeChange}
            />
          ) : (
            <StudentSearchTypes
              searchTypes={searchTypes as StudentSearchType[]}
              onChange={onSearchTypeChange}
            />
          )}
        </Form.Item>
      );
    } else {
      return <></>;
    }
  };

  const studentFilterTransferItem = (
    inputValue: string,
    { attendeeId, fullName, schoolYear, studentClass }: TransferItem
  ): boolean => {
    return (
      (searchTypes.includes(StudentSearchType.STUDENT_ID) &&
        attendeeId &&
        attendeeId.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) ||
      (searchTypes.includes(StudentSearchType.FULL_NAME) &&
        fullName &&
        fullName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) ||
      (searchTypes.includes(StudentSearchType.SCHOOL_YEAR) &&
        schoolYear &&
        schoolYear.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) ||
      (searchTypes.includes(StudentSearchType.STUDENT_CLASS) &&
        studentClass &&
        studentClass.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    );
  };

  const lecturerFilterTransferItem = (
    inputValue: string,
    { attendeeId, fullName }: TransferItem
  ): boolean => {
    return (
      (searchTypes.includes(LecturerSearchType.LECTURER_ID) &&
        attendeeId &&
        attendeeId.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) ||
      (searchTypes.includes(LecturerSearchType.FULL_NAME) &&
        fullName &&
        fullName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    );
  };

  const renderItem = ({ fullName, key, attendeeId }) => {
    const attendeeIdStr = attendeeId ? `(${attendeeId})` : '';

    return (
      <Space>
        <Avatar src={getAvatarUrl(key)} size="small" icon={<UserOutlined />}>
          {fullName[0]}
        </Avatar>
        {`${fullName || ''} ${attendeeIdStr}`}
      </Space>
    );
  };

  return (
    <Spin spinning={isSearching}>
      <Form.Item name={['attendees', terminology.FIELD_NAME]} label={terminology.LABEL}>
        <Transfer
          dataSource={sourceAttendees}
          showSearch
          oneWay
          targetKeys={selectedAttendees}
          onChange={onMoveChange}
          onSearch={onKeywordChange}
          filterOption={
            attendeeTarget === ThesisAttendeeTarget.LECTURER
              ? lecturerFilterTransferItem
              : studentFilterTransferItem
          }
          listStyle={{
            width: 300,
            height: 400
          }}
          render={renderItem}
          footer={renderFooter}
        />
      </Form.Item>
    </Spin>
  );
};

export default ThesisAttendeesSelectFormItem;
