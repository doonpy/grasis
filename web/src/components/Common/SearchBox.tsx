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
}

const SearchBox: React.FC<ComponentProps> = ({ onSearch }) => {
  return <Search size="large" placeholder="Tìm kiếm..." onSearch={onSearch} enterButton />;
};

export default SearchBox;
