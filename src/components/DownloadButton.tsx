import React from 'react';

interface DownloadButtonProps {
  count: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  isDownloading?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  count,
  onClick,
  disabled = false,
  className = '',
  isDownloading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      {!isDownloading && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )}
      {isDownloading ? `下载中 (${count})` : `批量下载 (${count})`}
    </button>
  );
};

export default DownloadButton;