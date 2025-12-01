import React, { createContext, useState, useEffect } from 'react';

export type MoodLevel = 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
export type EnergyLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
export type StressLevel = 'none' | 'low' | 'medium' | 'high' | 'very-high';

export interface MoodEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  mood: MoodLevel;
  energy: EnergyLevel;
  stress: StressLevel;
  timestamp: string;
}

interface MoodContextType {
  todayEntry: MoodEntry | null;
  recentEntries: MoodEntry[];
  addMoodEntry: (mood: MoodLevel, energy: EnergyLevel, stress: StressLevel) => void;
  getMoodPattern: () => {
    averageMood: number;
    averageEnergy: number;
    averageStress: number;
    recommendation: string;
  };
}

export const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('taskcore_mood_entries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('taskcore_mood_entries', JSON.stringify(entries));
  }, [entries]);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today) || null;

  const recentEntries = entries
    .filter(e => {
      const entryDate = new Date(e.date);
      const daysDiff = Math.floor((Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7; // Last 7 days
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const addMoodEntry = (mood: MoodLevel, energy: EnergyLevel, stress: StressLevel) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: today,
      mood,
      energy,
      stress,
      timestamp: new Date().toISOString(),
    };

    setEntries((prev) => {
      // Remove existing entry for today if any
      const filtered = prev.filter(e => e.date !== today);
      return [newEntry, ...filtered];
    });
  };

  const getMoodPattern = () => {
    if (recentEntries.length === 0) {
      return {
        averageMood: 3,
        averageEnergy: 3,
        averageStress: 2,
        recommendation: 'Start tracking your mood to get personalized recommendations!',
      };
    }

    const moodValues: Record<MoodLevel, number> = {
      'excellent': 5,
      'good': 4,
      'okay': 3,
      'poor': 2,
      'terrible': 1,
    };

    const energyValues: Record<EnergyLevel, number> = {
      'very-high': 5,
      'high': 4,
      'medium': 3,
      'low': 2,
      'very-low': 1,
    };

    const stressValues: Record<StressLevel, number> = {
      'none': 1,
      'low': 2,
      'medium': 3,
      'high': 4,
      'very-high': 5,
    };

    const avgMood = recentEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / recentEntries.length;
    const avgEnergy = recentEntries.reduce((sum, e) => sum + energyValues[e.energy], 0) / recentEntries.length;
    const avgStress = recentEntries.reduce((sum, e) => sum + stressValues[e.stress], 0) / recentEntries.length;

    let recommendation = '';
    if (avgMood >= 4 && avgEnergy >= 4 && avgStress <= 2) {
      recommendation = 'You\'re doing great! This is a perfect time to tackle challenging tasks.';
    } else if (avgMood >= 3.5 && avgEnergy >= 3 && avgStress <= 3) {
      recommendation = 'You\'re in good shape. Focus on medium-priority tasks today.';
    } else if (avgStress >= 4 || avgMood <= 2) {
      recommendation = 'You seem stressed or down. Consider lighter tasks and take breaks.';
    } else if (avgEnergy <= 2) {
      recommendation = 'Low energy detected. Try shorter study sessions with more breaks.';
    } else {
      recommendation = 'Mix of easy and moderate tasks would work well for you today.';
    }

    return {
      averageMood: Math.round(avgMood * 10) / 10,
      averageEnergy: Math.round(avgEnergy * 10) / 10,
      averageStress: Math.round(avgStress * 10) / 10,
      recommendation,
    };
  };

  return (
    <MoodContext.Provider
      value={{
        todayEntry,
        recentEntries,
        addMoodEntry,
        getMoodPattern,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

