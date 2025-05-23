import React from 'react';

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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-l px-3 py-2"
          placeholder={placeholder}
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
        >
          搜索
        </button>
      </div>
    </div>
  );
};

export default SearchInput;