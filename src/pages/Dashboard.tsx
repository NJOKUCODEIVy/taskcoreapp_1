import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Badge from '../components/common/Badge';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  LogOut,
  LayoutDashboard,
  Timer,
  BookOpen,
  Smile,
  Bell,
  Settings,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { useSmartReminders } from '../hooks/useSmartReminders';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { tasks, addTask, toggleTaskComplete } = useTasks();
  const { addNotification } = useNotifications();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enable smart reminders
  useSmartReminders();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

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
  const stats = [
    { 
      label: 'Total Tasks', 
      value: tasks.length, 
      icon: ClipboardList, 
      color: 'text-primary',
      onClick: () => navigate('/tasks')
    },
    { 
      label: 'Completed', 
      value: tasks.filter(t => t.completed).length, 
      icon: CheckCircle2, 
      color: 'text-success',
      onClick: () => navigate('/tasks')
    },
    { 
      label: 'Pending', 
      value: tasks.filter(t => !t.completed).length, 
      icon: Clock, 
      color: 'text-warning',
      onClick: () => navigate('/tasks')
    },
    { 
      label: 'Overdue', 
      value: tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return !t.completed && dueDate < new Date();
      }).length, 
      icon: AlertTriangle, 
      color: 'text-destructive',
      onClick: () => navigate('/tasks')
    },
  ];

  // Get upcoming tasks (not completed, sorted by due date)
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const completionPercentage = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0;

  const formatDueDate = (date: Date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) return 'Today';
    if (dueDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true, onClick: () => navigate('/dashboard') },
    { label: 'Tasks', icon: ClipboardList, onClick: () => navigate('/tasks') },
    { label: 'Pomodoro', icon: Timer, onClick: () => navigate('/pomodoro') },
    { label: 'Study Time', icon: BookOpen, onClick: () => navigate('/study-time') },
    { label: 'Mood Tracker', icon: Smile, onClick: () => navigate('/mood-tracker') },
    { label: 'Notifications', icon: Bell, onClick: () => navigate('/notifications') },
    { label: 'Settings', icon: Settings, onClick: () => navigate('/settings') },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">TaskCore</span>
            <button 
              className="ml-auto lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                item.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate">{profile?.email || user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">TaskCore</h1>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

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

        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
              Welcome back, {profile?.full_name || 'User'}!
            </h1>
            <p className="text-muted-foreground mb-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <Button 
            className="gap-2 hidden sm:flex"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>

        {/* Mobile Create Task Button */}
        <div className="sm:hidden mb-6">
          <Button 
            className="w-full gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card 
              key={stat.label} 
              className="shadow-card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={stat.onClick}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="mt-3 text-muted-foreground font-medium">{stat.label}</p>
                {stat.label === 'Completed' && tasks.length > 0 && (
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Tasks - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Upcoming Tasks</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/tasks')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {upcomingTasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                      No upcoming tasks
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        onClick={() => navigate('/tasks')}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleTaskComplete(task.id);
                              }}
                              className="h-5 w-5 rounded border-muted-foreground/30 accent-primary"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Due: {formatDueDate(task.dueDate)}
                            </p>
                          </div>
                        </div>
                        <Badge priority={task.priority} />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start gap-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="w-5 h-5" />
                    New Task
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/tasks')}
                  >
                    <ClipboardList className="w-5 h-5" />
                    View All Tasks
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/pomodoro')}
                  >
                    <Timer className="w-5 h-5" />
                    Start Pomodoro
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => navigate('/study-time')}
                  >
                    <BookOpen className="w-5 h-5" />
                    Track Study Time
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;