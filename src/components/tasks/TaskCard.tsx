import React from 'react';
import type { Task } from '../../types/task.types';
import Badge from '../common/Badge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`card p-6 transition-all ${
        task.completed ? 'opacity-60 bg-neutral-gray/50' : 'hover:shadow-lg'
      } ${isOverdue ? 'border-l-4 border-status-danger' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="w-5 h-5 mt-1 text-primary-navy border-neutral-gray rounded focus:ring-primary-navy cursor-pointer"
          />

          {/* Task Content */}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold mb-2 ${
                task.completed ? 'line-through text-neutral-dark' : 'text-neutral-darker'
              }`}
            >
              {task.title}
            </h3>
            <p className="text-sm text-neutral-dark mb-3">{task.description}</p>

            {/* Task Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center text-neutral-dark">
                📚 {task.category}
              </span>
              <span
                className={`inline-flex items-center ${
                  isOverdue ? 'text-status-danger font-medium' : 'text-neutral-dark'
                }`}
              >
                📅 {formatDate(new Date(task.dueDate))}
                {isOverdue && ' (Overdue)'}
              </span>
              {task.completed && (
                <span className="inline-flex items-center text-status-success font-medium">
                  ✅ Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 ml-4">
          <Badge priority={task.priority} />
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 hover:bg-accent-sky/10 text-accent-sky rounded-lg transition-colors"
              title="Edit task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 hover:bg-status-danger/10 text-status-danger rounded-lg transition-colors"
              title="Delete task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
