'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
  centered?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  message,
  centered = false
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const spinner = (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite] ${getSizeClasses()} ${className}`} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  const content = (
    <div className={`flex items-center space-x-2 ${centered ? 'justify-center' : ''}`}>
      {spinner}
      {message && (
        <span className={`text-gray-600 ${getTextSize()}`}>
          {message}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {content}
      </div>
    );
  }

  return content;
}