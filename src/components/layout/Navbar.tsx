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
    <header className="bg-[#0B1120] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-40 sticky top-[31px]">
      {/* Brand & Project Identity */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-md bg-blue-600 flex items-center justify-center border border-blue-400/50 shadow-sm shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              Apex
            </span>
            <span className="text-slate-300 text-xs font-normal">/</span>
            <span className="text-white text-xs font-bold uppercase tracking-wider">
              Operations Console
            </span>
            <span className="hidden xl:inline text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-white border border-slate-700">
              Gujarat Police Concept
            </span>
          </div>
          <p className="text-[12px] text-slate-200 tracking-tight hidden sm:block">
            Statewide Video Surveillance, Intelligence & Forensic Platform
          </p>
        </div>
      </div>

      {/* Center Controls: Live Clock, Feed Control, Presentation Mode */}
      <div className="hidden lg:flex items-center space-x-3">
        {/* Live Clock */}
        <div className="flex items-center space-x-1.5 bg-[#182238] border border-slate-600 px-2.5 py-1 rounded text-xs text-white font-bold shadow-xs">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-white font-bold">{timeStr}</span>
        </div>

        {/* Live Feed Ticker Pause */}
        <button
          onClick={toggleFeedPause}
          title={isFeedPaused ? 'Resume simulated alert ticker' : 'Freeze simulated alert feed for presentation'}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs border transition-colors font-bold ${
            isFeedPaused
              ? 'bg-amber-950 text-amber-200 border-amber-500'
              : 'bg-[#182238] text-emerald-300 border-slate-600 hover:bg-[#1E293B]'
          }`}
        >
          {isFeedPaused ? (
            <>
              <Play className="w-3 h-3 fill-amber-300" />
              <span>FEED PAUSED</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-emerald-300" />
              <span className="text-emerald-300">FEED STREAMING</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-1" />
            </>
          )}
        </button>

        {/* Presentation Kiosk Carousel */}
        <button
          onClick={togglePresentationMode}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs border transition-colors font-bold ${
            isPresentationMode
              ? 'bg-blue-900/90 text-white border-blue-400'
              : 'bg-[#182238] text-white border-slate-600 hover:bg-[#1E293B]'
          }`}
          title="Start 6-step automated kiosk presentation"
        >
          <MonitorPlay className="w-3.5 h-3.5 text-blue-300" />
          <span className="text-white font-bold">{isPresentationMode ? 'Kiosk Tour Active' : 'Presentation Tour'}</span>
        </button>

        {/* Theme Switcher Toggle (White Theme / Dark Theme) */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-bold border border-slate-600 bg-[#182238] text-white hover:bg-[#1E293B] transition-colors shadow-xs"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'White/Light'} Theme`}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white font-bold">White Theme</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-white font-bold">Dark Theme</span>
            </>
          )}
        </button>
      </div>

      {/* Right Controls: Active Alerts Counter & Role Switcher */}
      <div className="flex items-center space-x-3">
        {/* Active Alert Counter Pill */}
        <div
          onClick={() => setCurrentScreen('alerts')}
          className="cursor-pointer flex items-center space-x-1.5 bg-[#182238] hover:bg-[#1E293B] border border-slate-600 px-2.5 py-1 rounded text-xs text-white shadow-xs"
          title="Click to view live incidents"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-white">{STATEWIDE_METRICS.activeAlerts}</span>
          <span className="text-[10px] text-slate-200 uppercase font-bold hidden sm:inline">Active Alerts</span>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown((p) => !p)}
            className={`flex items-center space-x-2 px-2.5 py-1 rounded border text-xs transition-colors ${roleConfig.badgeColor} hover:brightness-110`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <div className="text-left hidden sm:block">
              <div className="font-bold leading-none text-white">{roleConfig.title}</div>
              <div className="text-[10px] text-slate-200 mt-0.5">{roleConfig.badge}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] text-white uppercase tracking-wider font-bold">
                Simulated Operational Persona
              </div>
              {(Object.keys(DEMO_ROLES) as UserRole[]).map((rKey) => {
                const config = DEMO_ROLES[rKey];
                const isCurrent = role === rKey;
                return (
                  <button
                    key={rKey}
                    onClick={() => handleSelectRole(rKey)}
                    className={`w-full text-left px-3 py-2.5 hover:bg-slate-800 transition-colors flex items-start space-x-2.5 ${
                      isCurrent ? 'bg-slate-800/80 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        rKey === 'operator' ? 'bg-blue-400' : rKey === 'sp' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>{config.title}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-blue-900 text-white px-1 rounded border border-blue-500">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-200 mt-0.5">{config.primaryFocus}</div>
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
