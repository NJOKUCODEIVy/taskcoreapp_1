import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { TasksIcon } from '../common/Icons';
import type { Task } from '../../types/task.types';

interface PomodoroTimerProps {
  tasks: Task[];
}

type PomodoroPhase = 'focus' | 'break';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | ''>('');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [notes, setNotes] = useState<string>('');

  // Load notes from localStorage when task changes
  useEffect(() => {
    if (!selectedTaskId) {
      setNotes('');
      return;
    }
    const stored = localStorage.getItem(`pomodoro_notes_${selectedTaskId}`);
    setNotes(stored || '');
  }, [selectedTaskId]);

  // Persist notes
  useEffect(() => {
    if (!selectedTaskId) return;
    localStorage.setItem(`pomodoro_notes_${selectedTaskId}`, notes);
  }, [notes, selectedTaskId]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Auto-switch phase
          if (phase === 'focus') {
            setPhase('break');
            return BREAK_MINUTES * 60;
          } else {
            setPhase('focus');
            return FOCUS_MINUTES * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartPause = () => {
    if (!selectedTaskId) return;
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('focus');
    setSecondsLeft(FOCUS_MINUTES * 60);
  };

  const handleExportNotes = () => {
    if (!notes.trim()) return;
    const task = tasks.find(t => t.id === selectedTaskId);
    const title = task ? `${task.title} – Study notes` : 'Study notes';
    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentTask = tasks.find(t => t.id === selectedTaskId);
  const progress = phase === 'focus' 
    ? ((FOCUS_MINUTES * 60 - secondsLeft) / (FOCUS_MINUTES * 60)) * 100
    : ((BREAK_MINUTES * 60 - secondsLeft) / (BREAK_MINUTES * 60)) * 100;
  
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl transition-all duration-300 ${
            phase === 'focus'
              ? 'bg-primary-navy'
              : 'bg-status-success'
          }`}>
            <TasksIcon size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-primary-navy dark:text-white">
              Pomodoro Focus
            </h2>
            <p className="text-sm text-neutral-dark dark:text-neutral-gray">
              25 min focus • 5 min break
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          phase === 'focus'
            ? 'bg-primary-navy/20 text-primary-navy dark:bg-primary-navy/40 dark:text-white'
            : 'bg-status-success/20 text-status-success dark:bg-status-success/40 dark:text-status-success'
        }`}>
          {phase === 'focus' ? 'Focus' : 'Break'}
        </div>
      </div>

      {/* Task selector */}
      <div className="space-y-2 mb-8">
        <label className="block text-sm font-semibold text-neutral-darker dark:text-white mb-2">
          Link to task / course
        </label>
          <select
            value={selectedTaskId}
            onChange={e => {
              setSelectedTaskId(e.target.value);
              handleReset();
            }}
            className="input text-base py-3 cursor-pointer hover:border-primary-navy transition-colors"
          >
            <option value="">Select a task to focus on</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.title} · {task.category}
              </option>
            ))}
          </select>
        </div>
{/* Timer with circular progress */}
<div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-6">
  {/* Circular Progress Timer */}
  <div className="relative flex-shrink-0">
    <svg 
      className="transform -rotate-90 w-48 h-48 lg:w-64 lg:h-64"
      viewBox="0 0 200 200"
    >
      {/* Background circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        className="text-neutral-gray dark:text-neutral-dark"
      />
      {/* Progress circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className={`transition-all duration-1000 ${
          phase === 'focus'
            ? 'text-primary-navy dark:text-accent-sky'
            : 'text-status-success dark:text-status-success'
        }`}
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="text-xs uppercase tracking-wider text-neutral-dark dark:text-neutral-gray mb-1">
        {phase === 'focus' ? 'Focus Time' : 'Break Time'}
      </p>
      <p className={`text-5xl lg:text-6xl font-bold transition-colors duration-300 ${
        phase === 'focus'
          ? 'text-primary-navy dark:text-white'
          : 'text-status-success dark:text-status-success'
      }`}>
        {formatTime(secondsLeft)}
      </p>
      {isRunning && (
        <p className="text-xs text-neutral-dark dark:text-neutral-gray mt-2 animate-pulse">
          {phase === 'focus' ? 'Focused' : 'Relaxing'}
        </p>
      )}
    </div>
  </div>

          {/* Controls */}
          <div className="flex flex-col space-y-3 w-full lg:w-auto">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleStartPause}
              disabled={!selectedTaskId}
              className={`w-full lg:w-auto px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                isRunning 
                  ? 'hover:scale-105 shadow-lg' 
                  : 'hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="w-full lg:w-auto px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Current Task Display */}
        {currentTask && (
          <div className={`p-4 rounded-xl mb-6 transition-all duration-300 border-2 ${
            phase === 'focus'
              ? 'bg-primary-navy/10 dark:bg-primary-navy/30 border-primary-navy/20'
              : 'bg-status-success/10 dark:bg-status-success/20 border-status-success/20'
          }`}>
            <div>
              <p className="text-xs font-medium text-neutral-dark dark:text-neutral-gray mb-1">
                Current Task
              </p>
              <p className="text-base font-semibold text-primary-navy dark:text-white">
                {currentTask.title}
              </p>
              <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                {currentTask.category}
              </p>
            </div>
          </div>
        )}

        {/* Notes area */}
        <div className="space-y-3 pt-4 border-t-2 border-neutral-gray/50 dark:border-neutral-dark/50">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-neutral-darker dark:text-white">
              Session notes
            </p>
            {currentTask && (
              <span className="text-xs px-3 py-1 bg-primary-navy/10 dark:bg-primary-navy/30 text-primary-navy dark:text-white rounded-full">
                Tagged: {currentTask.title}
              </span>
            )}
          </div>
          <textarea
            rows={5}
            className="input resize-none text-base focus:ring-2 focus:ring-primary-navy transition-all"
            placeholder="Write quick notes while you study. They stay linked to this task."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard?.writeText(notes)}
              disabled={!notes.trim()}
              className="hover:scale-105 transition-transform"
            >
              Copy notes
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleExportNotes}
              disabled={!notes.trim()}
              className="hover:scale-105 transition-transform"
            >
              Export (.txt)
            </Button>
          </div>
        </div>
    </Card>
  );
};

export default PomodoroTimer;


