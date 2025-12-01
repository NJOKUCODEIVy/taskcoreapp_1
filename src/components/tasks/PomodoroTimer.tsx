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

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-navy/10 dark:bg-primary-navy/40 rounded-lg">
            <TasksIcon size={20} className="text-primary-navy dark:text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-navy dark:text-white">
              Pomodoro Focus
            </h2>
            <p className="text-xs text-neutral-dark dark:text-neutral-gray">
              25 min focus • 5 min break
            </p>
          </div>
        </div>
      </div>

      {/* Task selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray">
          Link to task / course
        </label>
        <select
          value={selectedTaskId}
          onChange={e => {
            setSelectedTaskId(e.target.value);
            handleReset();
          }}
          className="input"
        >
          <option value="">Select a task to focus on</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.title} · {task.category}
            </option>
          ))}
        </select>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-dark dark:text-neutral-gray mb-1">
            {phase === 'focus' ? 'Focus session' : 'Break'}
          </p>
          <p className="text-3xl font-bold text-primary-navy dark:text-white">
            {formatTime(secondsLeft)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleStartPause}
            disabled={!selectedTaskId}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Notes area */}
      <div className="space-y-2 pt-2 border-t border-neutral-gray dark:border-neutral-dark">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-darker dark:text-white">
            Session notes
          </p>
          {currentTask && (
            <span className="text-xs text-neutral-dark dark:text-neutral-gray">
              Tagged: {currentTask.title} · {currentTask.category}
            </span>
          )}
        </div>
        <textarea
          rows={4}
          className="input resize-none"
          placeholder="Write quick notes while you study. They stay linked to this task."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(notes)}
            disabled={!notes.trim()}
          >
            Copy notes
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExportNotes}
            disabled={!notes.trim()}
          >
            Export (.txt)
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PomodoroTimer;


