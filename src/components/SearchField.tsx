import React from 'react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = '输入插件名称或关键词',
  className = ''
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`flex-1 border rounded-l px-3 py-2 ${className}`}
      placeholder={placeholder}
    />
  );
};

export default SearchField;