import React from 'react';
import { MenuIcon, NotificationIcon } from '../common/Icons';

interface MobileHeaderProps {
  onMenuClick: () => void;
  notificationCount?: number;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, notificationCount = 0 }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-gray lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 text-neutral-darker hover:bg-neutral-gray rounded-lg transition-colors"
        >
          <MenuIcon size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="TaskCore" className="h-8 w-8" />
          <span className="text-lg font-bold text-primary-navy">TaskCore</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-neutral-darker hover:bg-neutral-gray rounded-lg transition-colors">
          <NotificationIcon size={24} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-status-danger text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
