import 'moment/locale/vi';

import { Form, Transfer } from 'antd';
import { TransferItem } from 'antd/lib/transfer';
import React, { useState } from 'react';

const ThesisStudentFormItem: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const lecturers: TransferItem[] = [
    { key: '0', title: '1asdasdasd ada sdas dasd asd a' },
    { key: '1', title: '2' },
    { key: '2', title: '3' }
  ];

  const handleChange = (targetKeys: string[]) => {
    setSelectedStudents(targetKeys);
  };

  return (
    <div>
      <Form.Item name="students" label="Sinh viên">
        <Transfer
          dataSource={lecturers}
          showSearch
          targetKeys={selectedStudents}
          onChange={handleChange}
          render={(item) => item.title}
          listStyle={{
            width: 300,
            height: 300
          }}
        />
      </Form.Item>
    </div>
  );
};

export default ThesisStudentFormItem;
