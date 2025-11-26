import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useMood, type MoodLevel, type EnergyLevel, type StressLevel } from '../hooks/useMood';
import { ChartIcon } from '../components/common/Icons';

const MoodTracker: React.FC = () => {
  const { todayEntry, recentEntries, addMoodEntry, getMoodPattern } = useMood();
  const [mood, setMood] = useState<MoodLevel>(todayEntry?.mood || 'okay');
  const [energy, setEnergy] = useState<EnergyLevel>(todayEntry?.energy || 'medium');
  const [stress, setStress] = useState<StressLevel>(todayEntry?.stress || 'medium');
  const [submitted, setSubmitted] = useState(!!todayEntry);

  const pattern = getMoodPattern();

  const handleSubmit = () => {
    addMoodEntry(mood, energy, stress);
    setSubmitted(true);
  };

  const moodOptions: { value: MoodLevel; label: string; emoji: string }[] = [
    { value: 'excellent', label: 'Excellent', emoji: '😄' },
    { value: 'good', label: 'Good', emoji: '🙂' },
    { value: 'okay', label: 'Okay', emoji: '😐' },
    { value: 'poor', label: 'Poor', emoji: '😔' },
    { value: 'terrible', label: 'Terrible', emoji: '😢' },
  ];

  const energyOptions: { value: EnergyLevel; label: string; emoji: string }[] = [
    { value: 'very-high', label: 'Very High', emoji: '⚡' },
    { value: 'high', label: 'High', emoji: '🔋' },
    { value: 'medium', label: 'Medium', emoji: '🔌' },
    { value: 'low', label: 'Low', emoji: '🔋' },
    { value: 'very-low', label: 'Very Low', emoji: '💤' },
  ];

  const stressOptions: { value: StressLevel; label: string; emoji: string }[] = [
    { value: 'none', label: 'None', emoji: '😌' },
    { value: 'low', label: 'Low', emoji: '😊' },
    { value: 'medium', label: 'Medium', emoji: '😐' },
    { value: 'high', label: 'High', emoji: '😰' },
    { value: 'very-high', label: 'Very High', emoji: '😱' },
  ];

  return (
    <Layout>
      <MobilePageHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary-navy dark:text-white mb-1 lg:mb-2">
            Mood & Productivity Tracker
          </h1>
          <p className="text-sm lg:text-base text-neutral-dark dark:text-neutral-gray">
            Track your daily mood to get personalized study recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Check-in */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary-navy dark:text-white mb-6">
                Daily Check-in
              </h2>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-primary-navy dark:text-white mb-2">
                    Check-in Complete!
                  </h3>
                  <p className="text-neutral-dark dark:text-neutral-gray mb-4">
                    Your mood has been recorded for today.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMood(todayEntry?.mood || 'okay');
                      setEnergy(todayEntry?.energy || 'medium');
                      setStress(todayEntry?.stress || 'medium');
                      setSubmitted(false);
                    }}
                  >
                    Update Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-3">
                      How are you feeling today?
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {moodOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setMood(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            mood === option.value
                              ? 'border-primary-navy bg-primary-navy/10 dark:bg-primary-navy/40 dark:border-white'
                              : 'border-neutral-gray dark:border-neutral-dark hover:border-primary-navy dark:hover:border-white'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className={`text-xs font-medium ${
                            mood === option.value
                              ? 'text-primary-navy dark:text-white'
                              : 'text-neutral-dark dark:text-neutral-gray'
                          }`}>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-3">
                      Energy Level
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {energyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setEnergy(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            energy === option.value
                              ? 'border-primary-navy bg-primary-navy/10 dark:bg-primary-navy/40 dark:border-white'
                              : 'border-neutral-gray dark:border-neutral-dark hover:border-primary-navy dark:hover:border-white'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className={`text-xs font-medium ${
                            energy === option.value
                              ? 'text-primary-navy dark:text-white'
                              : 'text-neutral-dark dark:text-neutral-gray'
                          }`}>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stress Level */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-darker dark:text-neutral-gray mb-3">
                      Stress Level
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {stressOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStress(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            stress === option.value
                              ? 'border-primary-navy bg-primary-navy/10 dark:bg-primary-navy/40 dark:border-white'
                              : 'border-neutral-gray dark:border-neutral-dark hover:border-primary-navy dark:hover:border-white'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className={`text-xs font-medium ${
                            stress === option.value
                              ? 'text-primary-navy dark:text-white'
                              : 'text-neutral-dark dark:text-neutral-gray'
                          }`}>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button variant="primary" fullWidth onClick={handleSubmit}>
                    Save Check-in
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Recommendations */}
          <div>
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ChartIcon size={20} className="text-primary-navy dark:text-white" />
                <h2 className="text-lg font-bold text-primary-navy dark:text-white">
                  Insights
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray mb-2">
                    Based on your last 7 days:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-neutral-dark dark:text-neutral-gray">Mood: </span>
                      <span className="font-medium text-primary-navy dark:text-white">
                        {pattern.averageMood.toFixed(1)}/5
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-dark dark:text-neutral-gray">Energy: </span>
                      <span className="font-medium text-primary-navy dark:text-white">
                        {pattern.averageEnergy.toFixed(1)}/5
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-dark dark:text-neutral-gray">Stress: </span>
                      <span className="font-medium text-primary-navy dark:text-white">
                        {pattern.averageStress.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-gray dark:border-neutral-dark">
                  <p className="text-sm font-medium text-neutral-darker dark:text-white mb-2">
                    Recommendation:
                  </p>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray">
                    {pattern.recommendation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoodTracker;

