import { useContext } from 'react';
import { StudyScheduleContext } from '../context/StudyScheduleContext';

export const useStudySchedule = () => {
  const context = useContext(StudyScheduleContext);
  if (!context) {
    throw new Error('useStudySchedule must be used within StudyScheduleProvider');
  }
  return context;
};

