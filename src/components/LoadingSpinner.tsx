import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`loading-overlay ${className}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;