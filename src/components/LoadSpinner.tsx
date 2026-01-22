import React from 'react';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'primary' | 'white' | 'dark';

interface LoadingSpinnerProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'white',
  fullScreen = true,
  text = 'Chargement...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const borderSizes = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4',
    xl: 'border-4',
  };

  const variantClasses = {
    primary: 'border-t-blue-500',
    white: 'border-t-white',
    dark: 'border-t-gray-800',
  };

  const spinner = (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Anneau de fond */}
      <div
        className={`
          absolute inset-0
          rounded-full
          border
          ${borderSizes[size]}
          opacity-20
        `}
      />

      {/* Anneau animé */}
      <div
        className={`
          absolute inset-0
          rounded-full
          border
          ${borderSizes[size]}
          border-transparent
          animate-spin motion-reduce:animate-none
          ${variantClasses[variant]}
        `}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`
          fixed inset-0 z-50
          bg-black/80 backdrop-blur-sm
          flex items-center justify-center
          ${className}
        `}
      >
        <div className="flex flex-col items-center space-y-4">
          {spinner}
          {text && (
            <p className="text-white font-medium animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {spinner}
      {text && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
