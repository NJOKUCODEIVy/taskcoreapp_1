import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useStudySchedule } from '../hooks/useStudySchedule';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { PlusIcon, TrashIcon, EditIcon, ClockIcon } from '../components/common/Icons';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StudyTimeGenerator: React.FC = () => {
  const {
    classes,
    sleepSchedule,
    freePeriods,
    studyBlocks,
    addClass,
    removeClass,
    setSleepSchedule,
    addFreePeriod,
    removeFreePeriod,
    generateStudyBlocks,
    clearStudyBlocks,
  } = useStudySchedule();

  const { tasks } = useTasks();
  const { addNotification } = useNotifications();

  const [showClassForm, setShowClassForm] = useState(false);
  const [showFreePeriodForm, setShowFreePeriodForm] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<string | null>(null);

  const [classForm, setClassForm] = useState({
    name: '',
    day: 1,
    startTime: '09:00',
    endTime: '10:30',
  });

  const [freePeriodForm, setFreePeriodForm] = useState({
    day: 1,
    startTime: '14:00',
    endTime: '16:00',
    label: '',
  });

  const [sleepForm, setSleepForm] = useState({
    bedtime: sleepSchedule?.bedtime || '22:00',
    wakeTime: sleepSchedule?.wakeTime || '07:00',
  });

  const handleAddClass = () => {
    if (classForm.name && classForm.startTime && classForm.endTime) {
      addClass(classForm);
      setClassForm({ name: '', day: 1, startTime: '09:00', endTime: '10:30' });
      setShowClassForm(false);
      addNotification({
        type: 'success',
        title: 'Class Added',
        message: `${classForm.name} has been added to your schedule`,
      });
    }
  };

  const handleAddFreePeriod = () => {
    if (freePeriodForm.startTime && freePeriodForm.endTime) {
      addFreePeriod(freePeriodForm);
      setFreePeriodForm({ day: 1, startTime: '14:00', endTime: '16:00', label: '' });
      setShowFreePeriodForm(false);
      addNotification({
        type: 'success',
        title: 'Free Period Added',
        message: 'Free period has been added to your schedule',
      });
    }
  };

  const handleSaveSleepSchedule = () => {
    setSleepSchedule(sleepForm);
    addNotification({
      type: 'success',
      title: 'Sleep Schedule Saved',
      message: 'Your sleep schedule has been updated',
    });
  };

  const handleGenerateStudyBlocks = () => {
    const pendingTasks = tasks.filter(t => !t.completed).map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      dueDate: t.dueDate,
      completed: t.completed,
    }));

    if (pendingTasks.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Tasks',
        message: 'You need pending tasks to generate study blocks',
      });
      return;
    }

    if (freePeriods.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Free Periods',
        message: 'Please add free periods to your schedule first',
      });
      return;
    }

    const blocks = generateStudyBlocks(pendingTasks);
    addNotification({
      type: 'success',
      title: 'Study Blocks Generated',
      message: `Generated ${blocks.length} study blocks based on your schedule`,
    });
  };

  return (
    <Layout>
      <MobilePageHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white mb-1 lg:mb-2">
            Study-Time Auto Generator
          </h1>
          <p className="text-sm lg:text-base text-neutral-dark dark:text-neutral-gray">
            Input your schedule and let the app automatically place study blocks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Schedule Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Schedule */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-navy dark:text-white">Class Schedule</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setShowClassForm(!showClassForm);
                    setEditingClass(null);
                    setClassForm({ name: '', day: 1, startTime: '09:00', endTime: '10:30' });
                  }}
                >
                  <PlusIcon size={16} className="mr-1" />
                  Add Class
                </Button>
              </div>

              {showClassForm && (
                <div className="mb-4 p-4 bg-neutral-gray/30 dark:bg-neutral-900/60 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Class name (e.g., Math 101)"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    className="input"
                  />
                  <select
                    value={classForm.day}
                    onChange={(e) => setClassForm({ ...classForm, day: Number(e.target.value) })}
                    className="input"
                  >
                    {DAYS.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-dark dark:text-neutral-gray mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={classForm.startTime}
                        onChange={(e) => setClassForm({ ...classForm, startTime: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-dark dark:text-neutral-gray mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={classForm.endTime}
                        onChange={(e) => setClassForm({ ...classForm, endTime: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="primary" size="sm" onClick={handleAddClass}>
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowClassForm(false);
                        setClassForm({ name: '', day: 1, startTime: '09:00', endTime: '10:30' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {classes.length === 0 ? (
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray text-center py-4">
                    No classes added yet
                  </p>
                ) : (
                  classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 bg-neutral-gray/30 dark:bg-neutral-900/60 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-neutral-darker dark:text-white">{classItem.name}</p>
                        <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                          {DAYS[classItem.day]} • {classItem.startTime} - {classItem.endTime}
                        </p>
                      </div>
                      <button
                        onClick={() => removeClass(classItem.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <TrashIcon size={18} className="text-status-danger" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Sleep Schedule */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary-navy dark:text-white mb-4">Sleep Schedule</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                      Bedtime
                    </label>
                    <input
                      type="time"
                      value={sleepForm.bedtime}
                      onChange={(e) => setSleepForm({ ...sleepForm, bedtime: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-2">
                      Wake Time
                    </label>
                    <input
                      type="time"
                      value={sleepForm.wakeTime}
                      onChange={(e) => setSleepForm({ ...sleepForm, wakeTime: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <Button variant="primary" onClick={handleSaveSleepSchedule}>
                  Save Sleep Schedule
                </Button>
                {sleepSchedule && (
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                    Current: {sleepSchedule.bedtime} - {sleepSchedule.wakeTime}
                  </p>
                )}
              </div>
            </Card>

            {/* Free Periods */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-navy dark:text-white">Free Periods</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setShowFreePeriodForm(!showFreePeriodForm);
                    setEditingPeriod(null);
                    setFreePeriodForm({ day: 1, startTime: '14:00', endTime: '16:00', label: '' });
                  }}
                >
                  <PlusIcon size={16} className="mr-1" />
                  Add Period
                </Button>
              </div>

              {showFreePeriodForm && (
                <div className="mb-4 p-4 bg-neutral-gray/30 dark:bg-neutral-900/60 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Label (optional, e.g., Lunch Break)"
                    value={freePeriodForm.label}
                    onChange={(e) => setFreePeriodForm({ ...freePeriodForm, label: e.target.value })}
                    className="input"
                  />
                  <select
                    value={freePeriodForm.day}
                    onChange={(e) => setFreePeriodForm({ ...freePeriodForm, day: Number(e.target.value) })}
                    className="input"
                  >
                    {DAYS.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-dark dark:text-neutral-gray mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={freePeriodForm.startTime}
                        onChange={(e) => setFreePeriodForm({ ...freePeriodForm, startTime: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-dark dark:text-neutral-gray mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={freePeriodForm.endTime}
                        onChange={(e) => setFreePeriodForm({ ...freePeriodForm, endTime: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="primary" size="sm" onClick={handleAddFreePeriod}>
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowFreePeriodForm(false);
                        setFreePeriodForm({ day: 1, startTime: '14:00', endTime: '16:00', label: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {freePeriods.length === 0 ? (
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray text-center py-4">
                    No free periods added yet
                  </p>
                ) : (
                  freePeriods.map((period) => (
                    <div
                      key={period.id}
                      className="flex items-center justify-between p-3 bg-neutral-gray/30 dark:bg-neutral-900/60 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-neutral-darker dark:text-white">
                          {period.label || 'Free Period'}
                        </p>
                        <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                          {DAYS[period.day]} • {period.startTime} - {period.endTime}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFreePeriod(period.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <TrashIcon size={18} className="text-status-danger" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Generated Study Blocks */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-navy dark:text-white">Study Blocks</h2>
                {studyBlocks.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearStudyBlocks}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-4 mb-4">
                <Button variant="primary" fullWidth onClick={handleGenerateStudyBlocks}>
                  <ClockIcon size={18} className="mr-2" />
                  Generate Study Blocks
                </Button>
                <p className="text-xs text-neutral-dark dark:text-neutral-gray">
                  Automatically creates study sessions based on your schedule and pending tasks
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {studyBlocks.length === 0 ? (
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray text-center py-4">
                    No study blocks generated yet. Click "Generate Study Blocks" to create them.
                  </p>
                ) : (
                  studyBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-3 bg-primary-navy/10 dark:bg-primary-navy/40 rounded-lg border-l-4 border-primary-navy"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-medium text-primary-navy dark:text-white">
                            {block.taskTitle || 'Study Session'}
                          </p>
                          <p className="text-xs text-neutral-dark dark:text-neutral-gray">
                            {DAYS[block.day]} • {block.startTime} - {block.endTime}
                          </p>
                        </div>
                        {block.priority && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            block.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            block.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {block.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-dark dark:text-neutral-gray">
                        Duration: {block.duration} minutes
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudyTimeGenerator;

