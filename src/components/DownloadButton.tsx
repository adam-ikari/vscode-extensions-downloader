import React from 'react';

interface DownloadButtonProps {
  count: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  count,
  onClick,
  disabled = false,
  className = '',
  loading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {loading ? '下载中...' : `批量下载 (${count})`}
    </button>
  );
};

export default DownloadButton;