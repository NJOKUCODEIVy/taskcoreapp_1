import React, { useState, useEffect } from 'react';
import type { TaskFormData, Task } from '../../types/task.types';
import Button from '../common/Button';
import { CloseIcon } from '../common/Icons';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSubmit: (data: TaskFormData) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSubmit }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Other',
    dueDate: '',
    reminderTime: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  // Populate form with task data when modal opens
  useEffect(() => {
    if (isOpen && task) {
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toISOString().split('T')[0];
      
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: formattedDate,
        reminderTime: task.reminderTime ? new Date(task.reminderTime).toISOString().slice(0, 16) : '',
      });
    }
  }, [isOpen, task]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Other',
      dueDate: '',
      reminderTime: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-gray dark:border-gray-700">
            <h2 className="text-2xl font-bold text-primary-navy dark:text-white">Edit Task</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-neutral-gray dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <CloseIcon size={24} className="text-neutral-dark dark:text-neutral-gray" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className={`input ${errors.title ? 'border-status-danger' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-status-danger">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your task"
                rows={4}
                className={`input resize-none ${errors.description ? 'border-status-danger' : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-status-danger">{errors.description}</p>
              )}
            </div>

            {/* Priority and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="input"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Due Date and Reminder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`input ${errors.dueDate ? 'border-status-danger' : ''}`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-status-danger">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                  Reminder Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
              >
                Update Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;