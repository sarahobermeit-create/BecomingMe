import React, { useState } from 'react';
import { LifeProvider } from './context/LifeContext';
import { TabType } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { RoutinesModule } from './components/modules/RoutinesModule';
import { MealLogsModule } from './components/modules/MealLogsModule';
import { WaterTrackerModule } from './components/modules/WaterTrackerModule';
import { BudgetModule } from './components/modules/BudgetModule';
import { BooksModule } from './components/modules/BooksModule';
import { MoodModule } from './components/modules/MoodModule';
import { JunkJournalModule } from './components/modules/JunkJournalModule';
import { HobbiesModule } from './components/modules/HobbiesModule';
import { ExerciseModule } from './components/modules/ExerciseModule';
import { IdeasModule } from './components/modules/IdeasModule';
import { CalendarModule } from './components/modules/CalendarModule';
import { VictorianAtmosphere } from './components/common/VictorianAtmosphere';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard setActiveTab={setActiveTab} />;
      case 'routines':
        return <RoutinesModule />;
      case 'meals':
        return <MealLogsModule />;
      case 'water':
        return <WaterTrackerModule />;
      case 'budget':
        return <BudgetModule />;
      case 'books':
        return <BooksModule />;
      case 'mood':
        return <MoodModule />;
      case 'journal':
        return <JunkJournalModule />;
      case 'hobbies':
        return <HobbiesModule />;
      case 'exercise':
        return <ExerciseModule />;
      case 'ideas':
        return <IdeasModule />;
      case 'calendar':
        return <CalendarModule />;
      default:
        return <OverviewDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070e0a] text-slate-100 flex flex-col font-sans selection:bg-emerald-700/30 selection:text-emerald-200 relative">
      {/* Full-screen Victorian Library Wallpaper when on Library tab */}
      {activeTab === 'books' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('./victorian-library.jpg')` }}
          />
          {/* Atmospheric subtle vignette letting the Victorian library shine through vividly */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070e0a]/35 via-[#070e0a]/45 to-[#070e0a]/60" />
          {/* Active burning fireplace embers & rain streaming down the glass */}
          <VictorianAtmosphere />
        </div>
      )}

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LifeProvider>
      <MainLayout />
    </LifeProvider>
  );
}
