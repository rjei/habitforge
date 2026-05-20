import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HabitForgeProvider } from './context/HabitForgeContext';
import MainLayout from './components/MainLayout';
import ShrineView from './views/ShrineView';
import GrimoireView from './views/GrimoireView';
import LeaderboardView from './views/LeaderboardView';
import SageView from './views/SageView';

function App() {
  return (
    <HabitForgeProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Layout wrapper containing Left Sidebar and Persistent Header */}
          <Route path="/" element={<MainLayout />}>
            {/* View 1: SHRINE (Quest Hub / Dashboard) */}
            <Route index element={<ShrineView />} />
            
            {/* View 2: THE GRIMOIRE (Habit Management) */}
            <Route path="grimoire" element={<GrimoireView />} />
            
            {/* View 3: HALL OF FAME (Leaderboard) */}
            <Route path="leaderboard" element={<LeaderboardView />} />
            
            {/* View 4: SAGE'S SANCTUM (AI Coach) */}
            <Route path="sage" element={<SageView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HabitForgeProvider>
  );
}

export default App;
