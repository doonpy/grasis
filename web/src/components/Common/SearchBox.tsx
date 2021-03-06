import { Input } from 'antd';
import React from 'react';

const { Search } = Input;

interface ComponentProps {
  onSearch: (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  disabled?: boolean;
}

const SearchBox: React.FC<ComponentProps> = ({ onSearch, disabled }) => {
  return (
    <Search
      size="middle"
      placeholder="Tìm kiếm..."
      onSearch={onSearch}
      enterButton
      disabled={disabled}
      style={{ width: 400 }}
    />
  );
};

export default SearchBox;
