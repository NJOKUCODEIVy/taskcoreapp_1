import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-gray/30 dark:bg-neutral-900">
      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <BottomNav />
    </div>
  );
};

export default Layout;
