import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'svg' | 'brand';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'icon',
  className = '',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
  };

  const imageSrc =
    variant === 'svg'
      ? '/logo.svg'
      : variant === 'brand'
      ? '/logo-brand.jpg'
      : '/logo-icon.jpg';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeClasses[size]} overflow-hidden shadow-sm flex-shrink-0 bg-gradient-to-tr from-emerald-600 to-indigo-600 p-[1px]`}
      >
        <img
          src={imageSrc}
          alt="PokeDress Logo"
          className="w-full h-full object-cover rounded-[inherit]"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight">
            Poke<span className="text-purple-600">Dress</span>
          </span>
        </div>
      )}
    </div>
  );
};
