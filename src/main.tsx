import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // ADD THIS
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { MoodProvider } from './context/MoodContext';
import { StudyScheduleProvider } from './context/StudyScheduleContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* ADD THIS - Should be the outermost provider */}
      <ThemeProvider>
        <NotificationProvider>
          <MoodProvider>
            <StudyScheduleProvider>
              <TaskProvider>
                <App />
              </TaskProvider>
            </StudyScheduleProvider>
          </MoodProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider> {/* CLOSE HERE */}
  </React.StrictMode>,
);
