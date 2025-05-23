import React from 'react';
import SearchButton from './SearchButton';
import SearchField from './SearchField';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  loading,
  onSearch,
  placeholder = '输入插件名称或关键词',
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium mb-1">搜索插件</label>
      <div className="flex">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder={placeholder}
        />
        <SearchButton
          onClick={onSearch}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SearchInput;