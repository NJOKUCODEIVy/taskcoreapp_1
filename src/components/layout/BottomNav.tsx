import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardIcon, TasksIcon, NotificationIcon, SettingsIcon, PomodoroIcon, MoodIcon } from '../common/Icons';

const BottomNav: React.FC = () => {
  const location = useLocation();

  // Show only essential items on mobile (5 max for bottom nav)
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/tasks', label: 'Tasks', icon: TasksIcon },
    { path: '/pomodoro', label: 'Pomodoro', icon: PomodoroIcon },
    { path: '/mood', label: 'Mood', icon: MoodIcon },
    { path: '/notifications', label: 'Notifications', icon: NotificationIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-gray dark:border-neutral-dark shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? 'text-primary-navy dark:text-white' 
                  : 'text-neutral-dark dark:text-neutral-gray hover:text-primary-navy dark:hover:text-white'
              }`}
            >
              <Icon size={24} className={active ? 'text-primary-navy dark:text-white' : ''} />
              <span className={`text-xs mt-1 font-medium ${active ? 'text-primary-navy dark:text-white' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
