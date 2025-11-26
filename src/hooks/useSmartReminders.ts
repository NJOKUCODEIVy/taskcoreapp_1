import { useEffect } from 'react';
import { useTasks } from './useTasks';
import { useNotifications } from './useNotifications';
import { useMood } from './useMood';

export const useSmartReminders = () => {
  const { tasks } = useTasks();
  const { addNotification } = useNotifications();
  const { getMoodPattern } = useMood();

  useEffect(() => {
    const checkSmartReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Only check at specific intervals (every 30 minutes)
      if (currentMinute !== 0 && currentMinute !== 30) {
        return;
      }

      const pendingTasks = tasks.filter(t => !t.completed);
      if (pendingTasks.length === 0) return;

      // Check for free time opportunities (between 9 AM and 9 PM)
      if (currentHour >= 9 && currentHour < 21) {
        // Find tasks that can be done in short bursts
        const quickTasks = pendingTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilDue > 0 && daysUntilDue <= 7;
        });

        if (quickTasks.length > 0 && Math.random() > 0.7) {
          // 30% chance to suggest a quick task
          const task = quickTasks[Math.floor(Math.random() * quickTasks.length)];
          const taskTitle = task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title;
          
          addNotification({
            type: 'reminder',
            title: 'Free Time Opportunity',
            message: `You have 20 free minutes — want to revise "${taskTitle}"?`,
            taskId: task.id,
          });
          return;
        }
      }

      // Check for upcoming deadlines with smart suggestions
      pendingTasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue === 3 && !task.completed) {
          // Suggest starting early
          const moodPattern = getMoodPattern();
          const estimatedMinutes = moodPattern.averageEnergy >= 3 ? 30 : 45;
          
          addNotification({
            type: 'reminder',
            title: 'Smart Reminder',
            message: `"${task.title}" is due in 3 days — if you start today you only need ${estimatedMinutes} minutes.`,
            taskId: task.id,
          });
        } else if (daysUntilDue === 1 && !task.completed) {
          // Urgent reminder
          addNotification({
            type: 'warning',
            title: 'Due Tomorrow',
            message: `"${task.title}" is due tomorrow. Consider starting now!`,
            taskId: task.id,
          });
        } else if (daysUntilDue === 0 && !task.completed) {
          // Due today
          addNotification({
            type: 'warning',
            title: 'Due Today!',
            message: `"${task.title}" is due today. Don't forget to complete it!`,
            taskId: task.id,
          });
        }
      });
    };

    // Check immediately
    checkSmartReminders();

    // Set up interval to check every 30 minutes
    const interval = setInterval(checkSmartReminders, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, addNotification, getMoodPattern]);
};

