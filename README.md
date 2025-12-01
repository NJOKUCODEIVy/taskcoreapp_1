# 🎯 TaskCore - Student Task Management System

**TaskCore** is an open-source, community-driven task management application designed to help students stay organized, productive, and on top of their academic workload.

> 🌟 **Open Source Project** - Built by the community, for the community. Contributions welcome!

## ✨ Features

### 📋 Core Task Management
- **Create, Edit, Delete Tasks** - Full CRUD operations for task management
- **Priority System** - High, Medium, Low priority levels with color-coded badges
- **Category Organization** - Mathematics, Science, English, History, Computer Science, and Other
- **Due Date Tracking** - Never miss a deadline with visual indicators
- **Task Completion** - Mark tasks as complete with progress tracking
- **Advanced Filtering** - Search by title, filter by priority, category, and status

### 🍅 Pomodoro Timer
- **Focus Sessions** - 25-minute focus blocks with 5-minute breaks
- **Task-Linked Notes** - Take notes during study sessions, automatically tagged with task and category
- **Export Options** - Copy notes to clipboard or export as .txt file
- **Auto-Switching** - Automatically transitions between focus and break phases

### 📊 Mood & Productivity Tracker
- **Daily Check-ins** - Track your mood, energy level, and stress level daily
- **Pattern Analysis** - View insights from your last 7 days of data
- **Personalized Recommendations** - Get study recommendations based on your mood patterns
- **Visual Interface** - Easy-to-use emoji-based selection system

### 🧠 Smart Reminders
- **Contextual Notifications** - Intelligent reminders that adapt to your schedule
- **Free Time Suggestions** - "You have 20 free minutes — want to revise Chapter 3?"
- **Early Start Reminders** - "Your assignment is due in 3 days — if you start today you only need 30 minutes"
- **Energy-Aware** - Estimates study time based on your energy levels
- **Deadline Warnings** - Automatic reminders at 3 days, 1 day, and due date

### 📅 Study-Time Auto Generator
- **Class Schedule** - Input all your classes with days and times
- **Sleep Schedule** - Set your bedtime and wake time
- **Free Periods** - Define your available study time slots
- **Automatic Block Generation** - Automatically creates study blocks based on:
  - Your available free time
  - Task priorities
  - Due dates
  - Conflicts with classes and sleep
- **Smart Scheduling** - Assigns high-priority tasks first, creates 30-120 minute blocks

### 🌙 Dark Mode
- **Full Dark Mode Support** - Beautiful dark theme throughout the app
- **Theme Toggle** - Easy switch between light and dark modes
- **Persistent Preference** - Your theme choice is saved automatically

### 📱 Responsive Design
- **Mobile-First** - Fully optimized for mobile devices
- **Tablet Support** - Great experience on tablets
- **Desktop Layout** - Sidebar navigation and spacious layouts on desktop
- **Bottom Navigation** - Quick access on mobile devices

### 🔔 Notifications System
- **Browser Notifications** - Get notified even when the app is closed
- **In-App Notifications** - View all notifications in a dedicated page
- **Smart Reminders** - Contextual, helpful reminders
- **Task-Linked** - Notifications linked to specific tasks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd taskcore

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
taskcore/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Badge.tsx    # Priority badges
│   │   │   ├── Button.tsx   # Button component with variants
│   │   │   ├── Card.tsx     # Card container component
│   │   │   ├── Input.tsx    # Form input component
│   │   │   ├── Modal.tsx    # Modal dialog component
│   │   │   ├── Icons.tsx    # SVG icon components
│   │   │   └── index.ts     # Component exports
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.tsx   # Desktop header navigation
│   │   │   ├── Sidebar.tsx   # Desktop sidebar navigation
│   │   │   ├── BottomNav.tsx # Mobile bottom navigation
│   │   │   ├── Layout.tsx   # Main layout wrapper
│   │   │   ├── MobilePageHeader.tsx # Mobile page headers
│   │   │   └── index.ts     # Component exports
│   │   └── tasks/          # Task-specific components
│   │       ├── CreateTaskModal.tsx  # Task creation form
│   │       ├── EditTaskModal.tsx    # Task editing form
│   │       ├── TaskCard.tsx         # Individual task display
│   │       ├── PomodoroTimer.tsx    # Pomodoro timer component
│   │       └── index.ts             # Component exports
│   ├── pages/              # Route pages
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Tasks.tsx       # Task management page
│   │   ├── Notifications.tsx # Notifications center
│   │   ├── Settings.tsx    # Settings page
│   │   ├── Pomodoro.tsx   # Pomodoro timer page
│   │   ├── MoodTracker.tsx # Mood tracking page
│   │   └── StudyTimeGenerator.tsx # Study schedule generator
│   ├── context/            # State management (React Context)
│   │   ├── TaskContext.tsx         # Task state management
│   │   ├── NotificationContext.tsx # Notification state
│   │   ├── ThemeContext.tsx        # Theme/dark mode state
│   │   ├── MoodContext.tsx         # Mood tracking state
│   │   └── StudyScheduleContext.tsx # Study schedule state
│   ├── hooks/              # Custom React hooks
│   │   ├── useTasks.ts           # Task operations hook
│   │   ├── useNotifications.ts   # Notification operations hook
│   │   ├── useTheme.ts           # Theme operations hook
│   │   ├── useMood.ts            # Mood operations hook
│   │   ├── useStudySchedule.ts   # Study schedule operations hook
│   │   └── useSmartReminders.ts # Smart reminder system hook
│   ├── types/              # TypeScript type definitions
│   │   ├── task.types.ts   # Task-related types
│   │   ├── auth.types.ts   # Authentication types
│   │   └── index.ts        # Type exports
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles + Tailwind imports
├── public/                 # Static assets
│   ├── logo.png            # Full TaskCore logo
│   └── icon.png            # TaskCore icon
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── IMPLEMENTATION.md       # Implementation details
├── IMPLEMENTATION_GUIDE.md # Development guide
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # TypeScript app config
├── tsconfig.node.json      # TypeScript node config
└── vite.config.ts          # Vite build configuration
```

## 🎨 Design System

### Color Palette
- **Primary Navy**: `#1E2A78` - Main brand color
- **Accent Sky**: `#5BBDF5` - Accent color for highlights
- **High Priority**: `#EF4444` - Red for urgent tasks
- **Medium Priority**: `#F59E0B` - Yellow for medium priority
- **Low Priority**: `#10B981` - Green for low priority
- **Success**: `#10B981` - Success states
- **Warning**: `#F59E0B` - Warning states
- **Danger**: `#EF4444` - Error/danger states

### Dark Mode
- Full dark mode support with automatic theme switching
- Dark backgrounds: `neutral-900`, `neutral-800`
- Light text on dark backgrounds
- Consistent color scheme across all components

## 🛠️ Technologies

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 3 with custom theme
- **Build Tool**: Vite 7
- **Routing**: React Router v6
- **State Management**: React Context API
- **Storage**: LocalStorage (persistent across sessions)
- **Icons**: Custom SVG icons

## 📱 Available Routes

- `/` - Redirects to login
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - Main dashboard with stats and overview
- `/tasks` - Task management page with filtering
- `/notifications` - View all notifications
- `/settings` - User settings and preferences
- `/pomodoro` - Pomodoro timer with notes
- `/mood` - Mood & productivity tracker
- `/study-time` - Study-time auto generator

## 💡 Key Features Explained

### Pomodoro Timer
Access the Pomodoro timer from the sidebar. Select a task to focus on, start the timer, and take notes during your study session. Notes are automatically tagged with the task title and category, and can be exported for use in other apps.

### Mood Tracker
Complete daily check-ins to track your mood, energy, and stress levels. The app analyzes your patterns over the last 7 days and provides personalized study recommendations based on your current state.

### Smart Reminders
The smart reminder system runs in the background and sends contextual notifications:
- Suggests quick study sessions during free time
- Reminds you to start assignments early
- Warns about upcoming deadlines
- Adapts suggestions based on your energy levels

### Study-Time Generator
Input your class schedule, sleep schedule, and free periods. The app automatically generates study blocks by:
1. Finding available time slots (free periods minus classes and sleep)
2. Sorting tasks by priority and due date
3. Assigning tasks to time slots
4. Creating study blocks of appropriate duration (30-120 minutes)

## 🔧 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 📝 Data Persistence

All data is stored in browser LocalStorage:
- Tasks: `taskcore_tasks`
- Notifications: `taskcore_notifications`
- Theme: `theme`
- Mood Entries: `taskcore_mood_entries`
- Study Schedule: `taskcore_classes`, `taskcore_sleep_schedule`, `taskcore_free_periods`, `taskcore_study_blocks`

## 🎓 For Students

TaskCore is designed specifically for students with:
- Academic-focused categories (Mathematics, Science, English, etc.)
- Study session tracking with Pomodoro technique
- Mood-based productivity insights
- Automatic study schedule generation
- Smart reminders that understand student life
- Clean, distraction-free interface

## 🤝 Contributing

TaskCore is a **community-oriented open-source project**. We welcome contributions from developers, students, and anyone interested in improving the application!

Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated. This project thrives on community participation.

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub
   # Then clone your fork
   git clone https://github.com/your-username/taskcore.git
   cd taskcore
   ```

2. **Create a Branch**
   ```bash
   # Create a new branch for your feature or fix
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow the existing code style and conventions
   - Write clear, descriptive commit messages
   - Add comments for complex logic
   - Ensure TypeScript types are properly defined
   - Test your changes thoroughly

4. **Follow Code Style Guidelines**
   - Use TypeScript for all new code
   - Follow React best practices
   - Use Tailwind CSS for styling
   - Maintain dark mode support for new components
   - Keep components small and focused
   - Use meaningful variable and function names

5. **Test Your Changes**
   ```bash
   # Run the development server
   npm run dev
   
   # Check for linting errors
   npm run lint
   
   # Verify TypeScript types
   npm run type-check
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: Description of your changes"
   ```

7. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub with:
   - A clear title and description
   - Reference to any related issues
   - Screenshots (if UI changes)

### Contribution Guidelines

- **Bug Fixes**: Include a description of the bug and how your fix addresses it
- **New Features**: Explain the feature and why it would be useful
- **Documentation**: Help improve README, code comments, or guides
- **Code Quality**: Follow existing patterns and maintain consistency
- **Testing**: Test your changes across different browsers and devices
- **Accessibility**: Ensure new features are accessible and keyboard-navigable

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- ♿ Accessibility improvements
- 🌐 Internationalization
- 🧪 Test coverage

### Questions?

If you have questions or need help, please open an issue on GitHub.

Thank you for contributing to TaskCore! 🎉

## 📄 License

This project is **open source** and licensed under the **MIT License**.

As an open-source project, TaskCore is:
- ✅ Free to use for personal and commercial purposes
- ✅ Open for community contributions
- ✅ Available for modification and distribution
- ✅ Community-maintained and community-driven

### MIT License

```
MIT License

Copyright (c) 2025 TaskCore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### What This Means

- ✅ **Commercial use** - You can use this project commercially
- ✅ **Modification** - You can modify the code
- ✅ **Distribution** - You can distribute the code
- ✅ **Private use** - You can use it privately
- ✅ **Patent use** - You can use any patents
- ❌ **Liability** - The authors are not liable
- ❌ **Warranty** - No warranty is provided

For more information, see the [MIT License](https://opensource.org/licenses/MIT) page.

## 🙏 Acknowledgments

Built with ❤️ for students who want to stay organized and productive.

---

**TaskCore** - Your personal academic assistant 🎓
