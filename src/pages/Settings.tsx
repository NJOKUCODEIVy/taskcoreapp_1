import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { UserIcon, MoonIcon, SunIcon } from '../components/common/Icons';
import { useTheme } from '../hooks/useTheme';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  const [profileData, setProfileData] = useState({
    name: 'Student Name',
    email: 'student@email.com',
    university: 'University Name',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add profile update logic
    alert('Profile updated successfully!');
  };

  return (
    <Layout>
      <MobilePageHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white mb-1 lg:mb-2">Settings</h1>
          <p className="text-sm lg:text-base text-neutral-dark dark:text-neutral-gray">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <UserIcon size={24} className="text-primary-navy dark:text-white" />
              <h2 className="text-xl font-bold text-primary-navy dark:text-white">Profile Settings</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={profileData.university}
                  onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                  className="input"
                />
              </div>

              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </form>
          </Card>

          {/* Appearance Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary-navy dark:text-white mb-6 flex items-center">
              <div className="p-2 bg-primary-navy/10 dark:bg-primary-navy/40 rounded-lg mr-3">
                {theme === 'dark' ? <MoonIcon size={20} className="text-primary-navy dark:text-white" /> : <SunIcon size={20} className="text-primary-navy dark:text-white" />}
              </div>
              Appearance
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-darker dark:text-white">Dark Mode</p>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                    Switch between light and dark theme
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-primary-navy' : 'bg-neutral-gray'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <svg className="w-6 h-6 text-primary-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-xl font-bold text-primary-navy dark:text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-darker dark:text-white">Email Notifications</p>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray">Receive task updates via email</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-primary-navy' : 'bg-neutral-gray'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-darker dark:text-white">Push Notifications</p>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray">Get browser notifications</p>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications ? 'bg-primary-navy' : 'bg-neutral-gray'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-darker dark:text-white">Task Reminders</p>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray">Remind me before deadlines</p>
                </div>
                <button
                  onClick={() => setTaskReminders(!taskReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    taskReminders ? 'bg-primary-navy' : 'bg-neutral-gray'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      taskReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
