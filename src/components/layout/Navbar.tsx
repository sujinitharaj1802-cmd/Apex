import React, { useState, useEffect } from 'react';
import { Shield, Clock, UserCheck, Play, Pause, MonitorPlay, ChevronDown, Sun, Moon } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEMO_ROLES, STATEWIDE_METRICS } from '../../services/mockDataService';

export const Navbar: React.FC = () => {
  const { role, setRole, roleConfig } = useRole();
  const { isFeedPaused, toggleFeedPause, isPresentationMode, togglePresentationMode, alerts, setCurrentScreen, theme, toggleTheme } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlertsCount = alerts.filter((a) => a.status === 'Detected' || a.status === 'AI Analysis' || a.status === 'Acknowledged').length;

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleDropdown(false);
    // Role affects initial priority view
    if (newRole === 'operator') setCurrentScreen('dashboard');
    else if (newRole === 'sp') setCurrentScreen('alerts');
    else if (newRole === 'admin') setCurrentScreen('dashboard');
  };

  return (
    <header className="bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between z-40 sticky top-[31px]">
      {/* Brand & Project Identity */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center border border-accent text-bg shrink-0">
          <Shield className="w-5 h-5 text-bg" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-text">
              Apex
            </span>
            <span className="text-text-muted text-xs font-normal">/</span>
            <span className="text-text text-xs font-bold tracking-tight">
              Operations Console
            </span>
            <span className="hidden xl:inline text-[11px] px-2 py-0.5 rounded-xs bg-bg text-text-muted border border-border">
              Gujarat Police Concept
            </span>
          </div>
          <p className="text-xs text-text-muted tracking-tight hidden sm:block">
            Statewide Video Surveillance, Intelligence & Forensic Platform
          </p>
        </div>
      </div>

      {/* Center Controls: Live Clock, Feed Control, Presentation Mode */}
      <div className="hidden lg:flex items-center space-x-3">
        {/* Live Clock */}
        <div className="flex items-center space-x-1.5 bg-bg border border-border px-2.5 py-1 rounded-xs text-xs text-text font-bold">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span className="text-text font-bold">{timeStr}</span>
        </div>

        {/* Live Feed Ticker Pause */}
        <button
          onClick={toggleFeedPause}
          title={isFeedPaused ? 'Resume simulated alert ticker' : 'Freeze simulated alert feed for presentation'}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xs text-xs border transition-colors font-bold ${
            isFeedPaused
              ? 'bg-alert text-text border-alert'
              : 'bg-bg text-accent border-border hover:bg-surface'
          }`}
        >
          {isFeedPaused ? (
            <>
              <Play className="w-3 h-3 fill-text" />
              <span>Feed Paused</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-accent" />
              <span className="text-accent">Feed Streaming</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block ml-1" />
            </>
          )}
        </button>

        {/* Presentation Kiosk Carousel */}
        <button
          onClick={togglePresentationMode}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xs text-xs border transition-colors font-bold ${
            isPresentationMode
              ? 'bg-accent text-bg border-accent'
              : 'bg-bg text-text border-border hover:bg-surface'
          }`}
          title="Start 6-step automated kiosk presentation"
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          <span className="font-bold">{isPresentationMode ? 'Kiosk Tour Active' : 'Presentation Tour'}</span>
        </button>

        {/* Theme Switcher Toggle (White Theme / Dark Theme) */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xs text-xs font-bold border border-border bg-bg text-text hover:bg-surface transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'White/Light'} Theme`}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-text font-bold">White Theme</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-accent" />
              <span className="text-text font-bold">Dark Theme</span>
            </>
          )}
        </button>
      </div>

      {/* Right Controls: Active Alerts Counter & Role Switcher */}
      <div className="flex items-center space-x-3">
        {/* Active Alert Counter Pill */}
        <div
          onClick={() => setCurrentScreen('alerts')}
          className="cursor-pointer flex items-center space-x-1.5 bg-bg hover:bg-surface border border-border px-2.5 py-1 rounded-xs text-xs text-text"
          title="Click to view live incidents"
        >
          <span className="w-2 h-2 rounded-full bg-alert animate-pulse" />
          <span className="font-bold text-text">{STATEWIDE_METRICS.activeAlerts}</span>
          <span className="text-[11px] text-text-muted font-bold hidden sm:inline">Active Alerts</span>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown((p) => !p)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-xs border border-border bg-bg text-text text-xs hover:bg-surface transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-accent" />
            <div className="text-left hidden sm:block">
              <div className="font-bold leading-none text-text">{roleConfig.title}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{roleConfig.badge}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-sm shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-border text-[11px] text-text-muted tracking-tight font-bold">
                Simulated Operational Persona
              </div>
              {(Object.keys(DEMO_ROLES) as UserRole[]).map((rKey) => {
                const config = DEMO_ROLES[rKey];
                const isCurrent = role === rKey;
                return (
                  <button
                    key={rKey}
                    onClick={() => handleSelectRole(rKey)}
                    className={`w-full text-left px-3 py-2.5 hover:bg-bg transition-colors flex items-start space-x-2.5 ${
                      isCurrent ? 'bg-bg border-l-2 border-accent' : ''
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-accent" />
                    <div>
                      <div className="text-xs font-bold text-text flex items-center space-x-1.5">
                        <span>{config.title}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-accent text-bg px-1 rounded-xs font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5">{config.primaryFocus}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
