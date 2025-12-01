import React, { useState } from 'react';
import type { FilterOptions, Priority, TaskCategory, Task } from '../types/task.types';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import { PlusIcon, TasksIcon, CheckCircleIcon, ClockIcon, EditIcon, TrashIcon, FilterIcon, CloseIcon } from '../components/common/Icons';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';

const Tasks: React.FC = () => {
  const { tasks, toggleTaskComplete, deleteTask, addTask, updateTask } = useTasks();
  const { addNotification } = useNotifications();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filter, setFilter] = useState<FilterOptions>({
    dateRange: 'all',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Priority filter
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    // Category filter
    if (filter.category && task.category !== filter.category) {
      return false;
    }
    // Completion filter
    if (filter.completed !== undefined && task.completed !== filter.completed) {
      return false;
    }
    return true;
  });

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toggleTaskComplete(taskId);
      addNotification({
        type: task.completed ? 'info' : 'success',
        title: task.completed ? 'Task Reopened' : 'Task Completed!',
        message: `You ${task.completed ? 'reopened' : 'completed'} "${task.title}"`,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      deleteTask(taskId);
      addNotification({
        type: 'info',
        title: 'Task Deleted',
        message: `"${task.title}" has been deleted`,
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const formatDate = (date: Date) => {
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <Layout>
      {/* Mobile Header */}
      <MobilePageHeader userName="Student" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header Section - Side by side on all screens */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white">My Tasks</h1>
            <p className="text-sm text-neutral-dark dark:text-neutral-gray">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            </p>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FilterIcon size={16} />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button 
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon size={16} />
              <span>New Task</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Collapsible */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-primary-navy dark:text-white">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-neutral-dark hover:text-primary-navy dark:text-neutral-gray dark:hover:text-white"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                />
              </div>

              {/* Priority Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Priority
                </label>
                <select
                  value={filter.priority || ''}
                  onChange={(e) => setFilter({ ...filter, priority: e.target.value as Priority || undefined })}
                  className="input"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Category
                </label>
                <select
                  value={filter.category || ''}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value as TaskCategory || undefined })}
                  className="input"
                >
                  <option value="">All Categories</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Status
                </label>
                <select
                  value={filter.completed === undefined ? '' : filter.completed ? 'completed' : 'pending'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilter({
                      ...filter,
                      completed: value === '' ? undefined : value === 'completed',
                    });
                  }}
                  className="input"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilter({ dateRange: 'all' });
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </Card>
            </div>
          )}

          {/* Tasks List */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {filteredTasks.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <TasksIcon size={64} className="text-neutral-gray" />
                </div>
                <h3 className="text-xl font-bold text-primary-navy dark:text-white mb-2">No tasks found</h3>
                <p className="text-neutral-dark dark:text-neutral-gray mb-6">
                  {searchQuery || filter.priority || filter.category
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started'}
                </p>
                <Button 
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusIcon size={18} className="mr-2" />
                  Create Task
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`p-6 transition-all ${
                      task.completed ? 'opacity-60' : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="w-5 h-5 mt-1 text-primary-navy border-neutral-gray rounded focus:ring-primary-navy"
                        />
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              task.completed
                                ? 'line-through text-neutral-dark'
                                : 'text-neutral-darker dark:text-white'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <p className="text-sm text-neutral-dark dark:text-neutral-gray mb-3">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="inline-flex items-center text-neutral-dark dark:text-neutral-gray">
                              <TasksIcon size={14} className="mr-1" />
                              {task.category}
                            </span>
                            <span className="inline-flex items-center text-neutral-dark dark:text-neutral-gray">
                              <ClockIcon size={14} className="mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
                            {task.completed && (
                              <span className="inline-flex items-center text-status-success">
                                <CheckCircleIcon size={16} className="mr-1" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <Badge priority={task.priority} />
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="p-2 hover:bg-neutral-gray dark:hover:bg-gray-700 rounded-lg transition-colors text-neutral-darker dark:text-white hover:text-primary-navy"
                          >
                            <EditIcon size={18} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-neutral-darker dark:text-white hover:text-status-danger"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
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

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onSubmit={(taskData: TaskFormData) => {
            updateTask(selectedTask.id, taskData);
            addNotification({
              type: 'success',
              title: 'Task Updated!',
              message: `"${taskData.title}" has been updated`,
            });
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </Layout>
  );
};

export default Tasks;
