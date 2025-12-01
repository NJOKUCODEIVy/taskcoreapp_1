import React from 'react';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import PomodoroTimer from '../components/tasks/PomodoroTimer';
import { useTasks } from '../hooks/useTasks';

const Pomodoro: React.FC = () => {
  const { tasks } = useTasks();

  return (
    <Layout>
      <MobilePageHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white mb-1 lg:mb-2">
            Pomodoro Focus
          </h1>
          <p className="text-sm lg:text-base text-neutral-dark dark:text-neutral-gray">
            Stay focused with 25-minute work sessions and 5-minute breaks
          </p>
        </div>

        {/* Pomodoro Timer */}
        <PomodoroTimer tasks={tasks} />
      </div>
    </Layout>
  );
};

export default Pomodoro;

