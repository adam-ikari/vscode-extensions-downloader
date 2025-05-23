import React from 'react';

interface SearchButtonProps {
  loading: boolean;
  onClick: () => void;
  className?: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  loading,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400 ${className}`}
    >
      搜索
    </button>
  );
};

export default SearchButton;