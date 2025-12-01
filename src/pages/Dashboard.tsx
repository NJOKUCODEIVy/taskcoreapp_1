import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { TasksIcon, CheckCircleIcon, ClockIcon, AlertIcon, PlusIcon } from '../components/common/Icons';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { useSmartReminders } from '../hooks/useSmartReminders';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, addTask, toggleTaskComplete } = useTasks();
  const { addNotification } = useNotifications();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Enable smart reminders
  useSmartReminders();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Listen for task completion notifications
  useEffect(() => {
    const handleTaskCompleted = (event: any) => {
      addNotification(event.detail);
    };

    const handleTaskReminder = (event: any) => {
      addNotification(event.detail);
    };

    window.addEventListener('task-completed', handleTaskCompleted);
    window.addEventListener('task-reminder', handleTaskReminder);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('task-completed', handleTaskCompleted);
      window.removeEventListener('task-reminder', handleTaskReminder);
    };
  }, [addNotification]);

  // Calculate stats from real tasks
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return !t.completed && dueDate < new Date();
    }).length,
  };

  // Get upcoming tasks (not completed, sorted by due date)
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const formatDueDate = (date: Date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) return 'Today';
    if (dueDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      {/* Mobile Header */}
      <MobilePageHeader userName="Student" />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(taskData) => {
          addTask(taskData);
          addNotification({
            type: 'success',
            title: 'Task Created!',
            message: `"${taskData.title}" has been added to your tasks`,
          });
          setIsCreateModalOpen(false);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Welcome Section with Date/Time and Create Button */}
        <div className="mb-6 lg:mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white mb-1 lg:mb-2">
              Welcome back, Student!
            </h1>
            <p className="text-sm lg:text-base text-neutral-dark dark:text-neutral-gray mb-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs lg:text-sm text-neutral-dark dark:text-neutral-gray">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden lg:flex items-center"
          >
            <PlusIcon size={18} className="mr-2" />
            New Task
          </Button>
        </div>

        {/* Mobile Create Task Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center"
          >
            <PlusIcon size={18} className="mr-2" />
            Create New Task
          </Button>
        </div>

        {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          {/* Total Tasks */}
          <Card 
            className="p-4 lg:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105" 
            onClick={() => navigate('/tasks')}
          >
            <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-between mb-2 lg:mb-4">
              <div className="p-2 lg:p-3 bg-primary-navy/10 dark:bg-primary-navy/40 rounded-lg mb-2 lg:mb-0">
                <TasksIcon size={20} className="text-primary-navy dark:text-white lg:w-6 lg:h-6" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white">{stats.total}</span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-neutral-dark dark:text-neutral-gray text-center lg:text-left">Total Tasks</h3>
          </Card>

          {/* Completed */}
          <Card 
            className="p-4 lg:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105" 
            onClick={() => navigate('/tasks')}
          >
            <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-between mb-2 lg:mb-4">
              <div className="p-2 lg:p-3 bg-status-success/10 dark:bg-status-success/20 rounded-lg mb-2 lg:mb-0">
                <CheckCircleIcon size={20} className="text-status-success lg:w-6 lg:h-6" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-status-success">{stats.completed}</span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-neutral-dark dark:text-neutral-gray text-center lg:text-left">Completed</h3>
            <div className="hidden lg:block mt-2 w-full bg-neutral-gray dark:bg-neutral-dark rounded-full h-2">
              <div 
                className="bg-status-success h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </Card>

          {/* Pending */}
          <Card 
            className="p-4 lg:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105" 
            onClick={() => navigate('/tasks')}
          >
            <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-between mb-2 lg:mb-4">
              <div className="p-2 lg:p-3 bg-status-warning/10 dark:bg-status-warning/20 rounded-lg mb-2 lg:mb-0">
                <ClockIcon size={20} className="text-status-warning lg:w-6 lg:h-6" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-status-warning">{stats.pending}</span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-neutral-dark dark:text-neutral-gray text-center lg:text-left">Pending</h3>
          </Card>

          {/* Overdue */}
          <Card 
            className="p-4 lg:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105" 
            onClick={() => navigate('/tasks')}
          >
            <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-between mb-2 lg:mb-4">
              <div className="p-2 lg:p-3 bg-status-danger/10 dark:bg-status-danger/20 rounded-lg mb-2 lg:mb-0">
                <AlertIcon size={20} className="text-status-danger lg:w-6 lg:h-6" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-status-danger">{stats.overdue}</span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-neutral-dark dark:text-neutral-gray text-center lg:text-left">Overdue</h3>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Tasks - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-navy dark:text-white">Upcoming Tasks</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/tasks')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingTasks.length === 0 ? (
                  <p className="text-neutral-dark dark:text-neutral-gray text-center py-8">No upcoming tasks</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-neutral-gray/30 dark:bg-neutral-900/60 rounded-lg hover:bg-neutral-gray/50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                      onClick={() => navigate('/tasks')}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleTaskComplete(task.id);
                          }}
                          className="h-5 w-5 rounded border-neutral-dark"
                        />
                        <div className="flex-1">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-neutral-dark' : 'text-neutral-darker dark:text-white'}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                            Due: {formatDueDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                      <Badge priority={task.priority} />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary-navy dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusIcon size={18} className="mr-2" />
                  New Task
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => navigate('/tasks')}
                >
                  <TasksIcon size={18} className="mr-2" />
                  View All Tasks
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;