import React, { useState } from 'react';
import { RoleProvider } from './context/RoleContext';
import { AppProvider, useApp } from './context/AppContext';
import { TopBanner } from './components/layout/TopBanner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PresentationBar } from './components/layout/PresentationBar';

// All 12 Screen views
import { DashboardPage } from './pages/DashboardPage';
import { AlertInvestigationPage } from './pages/AlertInvestigationPage';
import { TrackingPage } from './pages/TrackingPage';
import { CameraRegistryPage } from './pages/CameraRegistryPage';
import { AiAnalyticsPage } from './pages/AiAnalyticsPage';
import { GisTopologyPage } from './pages/GisTopologyPage';
import { HealthDashboardPage } from './pages/HealthDashboardPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { IntegrationBoardPage } from './pages/IntegrationBoardPage';
import { SecurityPrivacyPage } from './pages/SecurityPrivacyPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';

const MainLayout: React.FC = () => {
  const { currentScreen } = useApp();
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardPage />;
      case 'alerts':
        return <AlertInvestigationPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'cameras':
        return <CameraRegistryPage />;
      case 'analytics':
        return <AiAnalyticsPage />;
      case 'topology':
        return <GisTopologyPage />;
      case 'health':
        return <HealthDashboardPage />;
      case 'audit':
        return <AuditTrailPage />;
      case 'integration':
        return <IntegrationBoardPage />;
      case 'security':
        return <SecurityPrivacyPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Permanent Authoritative Warning Banner */}
      <TopBanner />

      {/* 2. Ops Room Navigation Bar */}
      <Navbar />

      {/* 3. Main Workspace Shell: Sidebar + Active Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Categorized Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpenMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/80 md:hidden flex"
            onClick={() => setIsSidebarOpenMobile(false)}
          >
            <div className="w-64 bg-[#0B1120] h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Primary Page Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#080D1A] relative">
          {renderActiveScreen()}
        </main>
      </div>

      {/* 4. Presentation Mode Tour Controls (Floating Pill) */}
      <PresentationBar />
    </div>
  );
};

export function App() {
  return (
    <RoleProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </RoleProvider>
  );
}

export default App;
