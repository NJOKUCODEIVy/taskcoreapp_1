import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MobilePageHeader from '../components/layout/MobilePageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useMood } from '../hooks/useMood';
import type { MoodLevel, EnergyLevel, StressLevel } from '../context/MoodContext';

import { ChartIcon } from '../components/common/Icons';

const MoodTracker: React.FC = () => {
  const { todayEntry, addMoodEntry, getMoodPattern } = useMood();
  const [mood, setMood] = useState<MoodLevel>((todayEntry?.mood as MoodLevel) || 'okay');
  const [energy, setEnergy] = useState<EnergyLevel>((todayEntry?.energy as EnergyLevel) || 'medium');
  const [stress, setStress] = useState<StressLevel>((todayEntry?.stress as StressLevel) || 'medium');
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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <div className="bg-primary-navy p-6 lg:p-8 rounded-2xl text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Mood & Productivity Tracker
            </h1>
            <p className="text-blue-100 text-base lg:text-lg">
              Track your daily mood to get personalized study recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Check-in */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 lg:p-8">
              <div>
                <h2 className="text-2xl font-bold text-primary-navy dark:text-white mb-8 flex items-center">
                  <span className="mr-3 text-3xl">📊</span>
                  Daily Check-in
                </h2>

                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-status-success rounded-full mb-6 animate-bounce">
                      <span className="text-5xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary-navy dark:text-white mb-3">
                      Check-in Complete! 🎉
                    </h3>
                    <p className="text-neutral-dark dark:text-neutral-gray mb-6 text-lg">
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
                      className="hover:scale-105 transition-transform"
                    >
                      Update Entry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Mood */}
                    <div>
                      <label className="flex text-base font-semibold text-neutral-darker dark:text-white mb-4 items-center">
                        <span className="mr-2 text-xl">😊</span>
                        How are you feeling today?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {moodOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setMood(option.value)}
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center ${
                              mood === option.value
                                ? 'border-primary-navy dark:border-white bg-primary-navy dark:bg-primary-navy/80 text-white shadow-lg scale-105'
                                : 'border-neutral-gray dark:border-neutral-dark hover:border-primary-navy dark:hover:border-white bg-white dark:bg-neutral-800'
                            }`}
                          >
                            <div className={`text-3xl mb-2 transition-transform ${mood === option.value ? 'scale-110' : ''} flex justify-center`}>
                              {option.emoji}
                            </div>
                            <div className={`text-xs font-semibold ${
                              mood === option.value
                                ? 'text-white'
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
                      <label className="block text-base font-semibold text-neutral-darker dark:text-white mb-4 items-center">
                        <span className="mr-2 text-xl">⚡</span>
                        Energy Level
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {energyOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setEnergy(option.value)}
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center ${
                              energy === option.value
                                ? 'border-primary-navy dark:border-white bg-primary-navy dark:bg-primary-navy/80 text-white shadow-lg scale-105'
                                : 'border-neutral-gray dark:border-neutral-dark hover:border-primary-navy dark:hover:border-white bg-white dark:bg-neutral-800'
                            }`}
                          >
                            <div className={`text-3xl mb-2 transition-transform ${energy === option.value ? 'scale-110' : ''} flex justify-center`}>
                              {option.emoji}
                            </div>
                            <div className={`text-xs font-semibold ${
                              energy === option.value
                                ? 'text-white'
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
                      <label className="flex text-base font-semibold text-neutral-darker dark:text-white mb-4 items-center">
                        <span className="mr-2 text-xl">😌</span>
                        Stress Level
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {stressOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setStress(option.value)}
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center ${
                              stress === option.value
                                ? 'border-primary-navy dark:border-white bg-primary-navy dark:bg-primary-navy/80 text-white shadow-lg scale-105'
                                : 'border-neutral-gray dark:border-neutral-dark hover:border-primary-navy dark:hover:border-white bg-white dark:bg-neutral-800'
                            }`}
                          >
                            <div className={`text-3xl mb-2 transition-transform ${stress === option.value ? 'scale-110' : ''} flex justify-center`}>
                              {option.emoji}
                            </div>
                            <div className={`text-xs font-semibold ${
                              stress === option.value
                                ? 'text-white'
                                : 'text-neutral-dark dark:text-neutral-gray'
                            }`}>
                              {option.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={handleSubmit}
                      className="py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                    >
                      Save Check-in
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            <Card className="p-6 lg:p-8 border-2 border-primary-navy/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-navy rounded-lg">
                  <ChartIcon size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-primary-navy dark:text-white">
                  Insights
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-neutral-dark dark:text-neutral-gray mb-4">
                    Based on your last 7 days:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-dark dark:text-neutral-gray">Mood</span>
                        <span className="text-lg font-bold text-primary-navy dark:text-white">
                          {pattern.averageMood.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="w-full bg-neutral-gray dark:bg-neutral-dark rounded-full h-2">
                        <div 
                          className="bg-primary-navy h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(pattern.averageMood / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-dark dark:text-neutral-gray">Energy</span>
                        <span className="text-lg font-bold text-primary-navy dark:text-white">
                          {pattern.averageEnergy.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="w-full bg-neutral-gray dark:bg-neutral-dark rounded-full h-2">
                        <div 
                          className="bg-accent-sky h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(pattern.averageEnergy / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-dark dark:text-neutral-gray">Stress</span>
                        <span className="text-lg font-bold text-primary-navy dark:text-white">
                          {pattern.averageStress.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="w-full bg-neutral-gray dark:bg-neutral-dark rounded-full h-2">
                        <div 
                          className="bg-status-warning h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(pattern.averageStress / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t-2 border-primary-navy/20 dark:border-white/20">
                  <div className="flex items-start space-x-2 mb-3">
                    <span className="text-xl">💡</span>
                    <p className="text-sm font-semibold text-neutral-darker dark:text-white">
                      Recommendation:
                    </p>
                  </div>
                  <p className="text-sm text-neutral-dark dark:text-neutral-gray leading-relaxed bg-white dark:bg-neutral-800 p-3 rounded-lg">
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

