import React from 'react';

interface MobilePageHeaderProps {
  userName?: string;
}

const MobilePageHeader: React.FC<MobilePageHeaderProps> = ({ userName = 'Student' }) => {
  return (
    <div className="lg:hidden bg-white dark:bg-neutral-900 border-b border-neutral-gray dark:border-neutral-dark sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex items-center">
          <img src="/logo.png" alt="TaskCore" className="h-10" />
        </div>

        {/* Profile - Right */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-neutral-darker dark:text-white">{userName}</span>
          <div className="w-9 h-9 bg-accent-sky rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePageHeader;
