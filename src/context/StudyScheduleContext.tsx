import React, { createContext, useState, useEffect } from 'react';

export interface ClassSchedule {
  id: string;
  name: string;
  day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface SleepSchedule {
  bedtime: string; // HH:MM format
  wakeTime: string; // HH:MM format
}

export interface FreePeriod {
  id: string;
  day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  label?: string;
}

export interface StudyBlock {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  taskId?: string; // Linked to a task if applicable
  taskTitle?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface StudyScheduleContextType {
  classes: ClassSchedule[];
  sleepSchedule: SleepSchedule | null;
  freePeriods: FreePeriod[];
  studyBlocks: StudyBlock[];
  addClass: (classSchedule: Omit<ClassSchedule, 'id'>) => void;
  updateClass: (id: string, classSchedule: Partial<ClassSchedule>) => void;
  removeClass: (id: string) => void;
  setSleepSchedule: (schedule: SleepSchedule) => void;
  addFreePeriod: (period: Omit<FreePeriod, 'id'>) => void;
  updateFreePeriod: (id: string, period: Partial<FreePeriod>) => void;
  removeFreePeriod: (id: string) => void;
  generateStudyBlocks: (tasks: Array<{ id: string; title: string; priority: string; dueDate: Date; completed: boolean }>) => StudyBlock[];
  clearStudyBlocks: () => void;
}

export const StudyScheduleContext = createContext<StudyScheduleContextType | undefined>(undefined);

export const StudyScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem('taskcore_classes');
    return saved ? JSON.parse(saved) : [];
  });

  const [sleepSchedule, setSleepScheduleState] = useState<SleepSchedule | null>(() => {
    const saved = localStorage.getItem('taskcore_sleep_schedule');
    return saved ? JSON.parse(saved) : null;
  });

  const [freePeriods, setFreePeriods] = useState<FreePeriod[]>(() => {
    const saved = localStorage.getItem('taskcore_free_periods');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>(() => {
    const saved = localStorage.getItem('taskcore_study_blocks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('taskcore_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    if (sleepSchedule) {
      localStorage.setItem('taskcore_sleep_schedule', JSON.stringify(sleepSchedule));
    }
  }, [sleepSchedule]);

  useEffect(() => {
    localStorage.setItem('taskcore_free_periods', JSON.stringify(freePeriods));
  }, [freePeriods]);

  useEffect(() => {
    localStorage.setItem('taskcore_study_blocks', JSON.stringify(studyBlocks));
  }, [studyBlocks]);

  const addClass = (classSchedule: Omit<ClassSchedule, 'id'>) => {
    const newClass: ClassSchedule = {
      ...classSchedule,
      id: Date.now().toString(),
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<ClassSchedule>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const removeClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const setSleepSchedule = (schedule: SleepSchedule) => {
    setSleepScheduleState(schedule);
  };

  const addFreePeriod = (period: Omit<FreePeriod, 'id'>) => {
    const newPeriod: FreePeriod = {
      ...period,
      id: Date.now().toString(),
    };
    setFreePeriods((prev) => [...prev, newPeriod]);
  };

  const updateFreePeriod = (id: string, updates: Partial<FreePeriod>) => {
    setFreePeriods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeFreePeriod = (id: string) => {
    setFreePeriods((prev) => prev.filter((p) => p.id !== id));
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const generateStudyBlocks = (
    tasks: Array<{ id: string; title: string; priority: string; dueDate: Date; completed: boolean }>
  ): StudyBlock[] => {
    const blocks: StudyBlock[] = [];
    const pendingTasks = tasks.filter(t => !t.completed).sort((a, b) => {
      // Sort by priority and due date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b.priority as keyof typeof priorityOrder] || 1) -
                           (priorityOrder[a.priority as keyof typeof priorityOrder] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Get all available time slots (free periods minus classes and sleep)
    const availableSlots: Array<{ day: number; start: number; end: number }> = [];

    // Start with free periods
    freePeriods.forEach((period) => {
      const start = timeToMinutes(period.startTime);
      const end = timeToMinutes(period.endTime);
      availableSlots.push({ day: period.day, start, end });
    });

    // Remove class times - create new array to avoid mutation issues
    let filteredSlots: Array<{ day: number; start: number; end: number }> = [];
    
    availableSlots.forEach((slot) => {
      const overlappingClasses = classes.filter(
        (classItem) =>
          classItem.day === slot.day &&
          timeToMinutes(classItem.startTime) < slot.end &&
          timeToMinutes(classItem.endTime) > slot.start
      );

      if (overlappingClasses.length === 0) {
        filteredSlots.push({ ...slot });
      } else {
        // Split slot around classes
        let currentStart = slot.start;
        overlappingClasses
          .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
          .forEach((classItem) => {
            const classStart = timeToMinutes(classItem.startTime);
            const classEnd = timeToMinutes(classItem.endTime);
            
            if (currentStart < classStart) {
              // Add slot before class
              filteredSlots.push({ day: slot.day, start: currentStart, end: classStart });
            }
            currentStart = Math.max(currentStart, classEnd);
          });
        
        // Add remaining slot after last class
        if (currentStart < slot.end) {
          filteredSlots.push({ day: slot.day, start: currentStart, end: slot.end });
        }
      }
    });
    
    availableSlots = filteredSlots;

    // Remove sleep times
    if (sleepSchedule) {
      const bedtime = timeToMinutes(sleepSchedule.bedtime);
      const wakeTime = timeToMinutes(sleepSchedule.wakeTime);
      
      const filteredAfterSleep: Array<{ day: number; start: number; end: number }> = [];
      
      availableSlots.forEach((slot) => {
        if (bedtime < wakeTime) {
          // Normal sleep schedule (e.g., 22:00 to 7:00)
          // Remove slots that are during sleep hours
          if (slot.start >= bedtime || slot.end <= wakeTime) {
            // Slot is during sleep, skip it
            return;
          }
          // Slot overlaps with sleep, trim it
          let newStart = slot.start;
          let newEnd = slot.end;
          if (newStart < bedtime) newEnd = Math.min(newEnd, bedtime);
          if (newEnd > wakeTime) newStart = Math.max(newStart, wakeTime);
          
          if (newEnd > newStart && newEnd - newStart >= 30) {
            filteredAfterSleep.push({ day: slot.day, start: newStart, end: newEnd });
          }
        } else {
          // Sleep spans midnight (e.g., 23:00 to 6:00)
          // Only keep slots that are between wakeTime and bedtime
          if (slot.start >= wakeTime && slot.end <= bedtime) {
            filteredAfterSleep.push({ ...slot });
          } else if (slot.start < wakeTime && slot.end > wakeTime) {
            // Slot starts before wake, ends after wake
            filteredAfterSleep.push({ day: slot.day, start: wakeTime, end: slot.end });
          } else if (slot.start < bedtime && slot.end > bedtime) {
            // Slot starts before bed, ends after bed
            filteredAfterSleep.push({ day: slot.day, start: slot.start, end: bedtime });
          }
        }
      });
      
      availableSlots = filteredAfterSleep;
    }

    // Filter out slots that are too short (< 30 minutes)
    const validSlots = availableSlots.filter(
      (slot) => slot.end - slot.start >= 30
    );

    // Assign tasks to time slots
    let taskIndex = 0;
    validSlots.forEach((slot) => {
      const duration = slot.end - slot.start;
      const studyDuration = Math.min(duration, 120); // Max 2 hours per block

      if (taskIndex < pendingTasks.length && studyDuration >= 30) {
        const task = pendingTasks[taskIndex];
        blocks.push({
          id: Date.now().toString() + Math.random(),
          day: slot.day,
          startTime: minutesToTime(slot.start),
          endTime: minutesToTime(slot.start + studyDuration),
          duration: studyDuration,
          taskId: task.id,
          taskTitle: task.title,
          priority: task.priority as 'high' | 'medium' | 'low',
        });
        taskIndex++;
      }
    });

    setStudyBlocks(blocks);
    return blocks;
  };

  const clearStudyBlocks = () => {
    setStudyBlocks([]);
  };

  return (
    <StudyScheduleContext.Provider
      value={{
        classes,
        sleepSchedule,
        freePeriods,
        studyBlocks,
        addClass,
        updateClass,
        removeClass,
        setSleepSchedule,
        addFreePeriod,
        updateFreePeriod,
        removeFreePeriod,
        generateStudyBlocks,
        clearStudyBlocks,
      }}
    >
      {children}
    </StudyScheduleContext.Provider>
  );
};

