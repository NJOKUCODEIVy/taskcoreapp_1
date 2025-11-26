import React, { createContext, useState, useEffect } from 'react';
import type { Task, TaskFormData } from '../types/task.types';

interface TaskContextType {
  tasks: Task[];
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage
    const saved = localStorage.getItem('taskcore_tasks');
    if (saved) {
      return JSON.parse(saved).map((task: Task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        reminderTime: task.reminderTime ? new Date(task.reminderTime) : undefined,
      }));
    }
    return [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskcore_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      dueDate: new Date(data.dueDate),
      reminderTime: data.reminderTime ? new Date(data.reminderTime) : undefined,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, taskData: TaskFormData) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: taskData.title,
              description: taskData.description,
              priority: taskData.priority,
              category: taskData.category,
              dueDate: new Date(taskData.dueDate),
              reminderTime: taskData.reminderTime ? new Date(taskData.reminderTime) : undefined,
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
