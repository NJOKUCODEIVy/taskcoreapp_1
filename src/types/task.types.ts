// TaskCore - Type Definitions

export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'History'
  | 'Computer Science'
  | 'Other';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: TaskCategory;
  dueDate: Date;
  reminderTime?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category: TaskCategory;
  dueDate: string;
  reminderTime?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  overdue: number;
}

export interface FilterOptions {
  priority?: Priority;
  category?: TaskCategory;
  completed?: boolean;
  dateRange?: 'today' | 'week' | 'overdue' | 'all';
}
