import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardIcon, TasksIcon, NotificationIcon, SettingsIcon, LogoutIcon, PomodoroIcon, MoodIcon, CalendarIcon } from '../common/Icons';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/tasks', label: 'Tasks', icon: TasksIcon },
    { path: '/pomodoro', label: 'Pomodoro', icon: PomodoroIcon },
    { path: '/study-time', label: 'Study Time', icon: CalendarIcon },
    { path: '/mood', label: 'Mood Tracker', icon: MoodIcon },
    { path: '/notifications', label: 'Notifications', icon: NotificationIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-gray dark:border-neutral-dark flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-gray dark:border-neutral-dark">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img src="/icon.png" alt="TaskCore" className="h-10 w-10" />
            <span className="text-xl font-bold text-primary-navy dark:text-white">TaskCore</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-navy text-white'
                    : 'text-neutral-darker dark:text-neutral-gray hover:bg-neutral-gray dark:hover:bg-neutral-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-gray dark:border-neutral-dark">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-accent-sky rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-darker dark:text-white">Student</p>
              <p className="text-xs text-neutral-dark dark:text-neutral-gray">student@email.com</p>
            </div>
          </div>
          <button
            onClick={() => {
              // TODO: Add logout logic
              window.location.href = '/login';
            }}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-status-danger hover:bg-red-50 transition-colors"
          >
            <LogoutIcon size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
