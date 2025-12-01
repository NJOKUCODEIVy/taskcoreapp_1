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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <div className="bg-primary-navy p-6 lg:p-8 rounded-2xl text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Pomodoro Focus Timer
            </h1>
            <p className="text-blue-100 text-base lg:text-lg">
              Stay focused with 25-minute work sessions and 5-minute breaks
            </p>
          </div>
        </div>

        {/* Pomodoro Timer */}
        <PomodoroTimer tasks={tasks} />
      </div>
    </Layout>
  );
};

export default Pomodoro;

