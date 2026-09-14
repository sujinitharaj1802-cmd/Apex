import React, { useState } from 'react';
import { TrackingReplayMap } from '../components/map/TrackingReplayMap';
import { TRACKING_SCENARIOS } from '../services/mockDataService';
import { TrackingScenario, TrackingWaypoint } from '../types';
import { Navigation, Clock, Gauge, Layers, ShieldAlert, ArrowRight } from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TrackingScenario>(TRACKING_SCENARIOS[0]);
  const [activeWaypoint, setActiveWaypoint] = useState<TrackingWaypoint>(selectedScenario.waypoints[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const handleScenarioChange = (scenarioId: string) => {
    const sc = TRACKING_SCENARIOS.find((s) => s.id === scenarioId) || TRACKING_SCENARIOS[0];
    setSelectedScenario(sc);
    setActiveWaypoint(sc.waypoints[0]);
    setActiveStepIndex(0);
  };

  const handleWaypointChange = (wp: TrackingWaypoint, index: number) => {
    setActiveWaypoint(wp);
    setActiveStepIndex(index);
  };

  const stats = selectedScenario.summaryStats;

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-text">Cross-District Vehicle Tracking & Trajectory Reconstruction</h1>
          </div>
          <p className="text-xs text-text-muted font-mono">
            Seamless multi-camera vehicle tracking across municipal and district police boundaries
          </p>
        </div>

        {/* Target Vehicle Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-text-muted">Target Vehicle:</span>
          <select
            value={selectedScenario.id}
            onChange={(e) => handleScenarioChange(e.target.value)}
            aria-label="Select target vehicle scenario"
            className="bg-surface border border-border text-text text-xs font-mono py-1.5 px-3 rounded focus:outline-none focus:border-blue-500"
          >
            {TRACKING_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.targetLabel} ({sc.waypoints.length} Observations)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Core Architectural Value Banner */}
      <div className="bg-surface border border-border rounded-lg p-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5 text-text-muted font-sans">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong className="text-text">The Federation Advantage:</strong> Before Apex, Ahmedabad, Vadodara, Bharuch, and Surat ran isolated VMS silos. Target <strong className="text-amber-400 font-bold">{selectedScenario.plateOrId}</strong> can now be seamlessly reconstructed along the state transit corridor in under 30 seconds.
          </span>
        </div>
      </div>

      {/* Main Tracking Canvas: Map (8 cols) + Trajectory Chronology Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Map Replay Component */}
        <div className="lg:col-span-8 space-y-3">
          <TrackingReplayMap
            scenario={selectedScenario}
            onWaypointChange={handleWaypointChange}
          />

          {/* Requested Bottom Summary Strip */}
          <div className="bg-surface border border-border rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-text-muted">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>
                <strong className="text-text">{stats.observationsCount}</strong> camera observations
              </span>
              <span className="text-slate-600">•</span>
              <span>
                <strong className="text-text">{stats.locationsCount}</strong> locations
              </span>
              <span className="text-slate-600">•</span>
              <span>
                <strong className="text-text">{stats.districtsCount}</strong> districts
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-bold">
                {stats.durationMinutes} min simulated journey
              </span>
            </div>

            <div className="text-[11px] text-text-muted">
              Corridor: <strong className="text-text">Ahmedabad ➔ Vadodara ➔ Bharuch ➔ Surat</strong>
            </div>
          </div>
        </div>

        {/* Right: Chronological Observation Trail */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-[545px]">
          {/* Header */}
          <div className="p-3 bg-bg border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-text uppercase font-bold">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Chronological Observations</span>
            </div>
            <span className="text-[10px] font-mono bg-surface text-text-muted px-2 py-0.5 rounded border border-border">
              {selectedScenario.waypoints.length} Optical Fixes
            </span>
          </div>

          {/* Waypoint Chronology List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {selectedScenario.waypoints.map((wp, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;

              return (
                <div
                  key={wp.cameraId}
                  className={`p-3 rounded border transition-all ${
                    isCurrent
                      ? 'bg-blue-950/40 border-blue-500 shadow ring-1 ring-blue-500/50'
                      : isPast
                      ? 'bg-surface/40 border-border text-text-muted'
                      : 'bg-bg border-slate-900 opacity-60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${
                          isCurrent
                            ? 'bg-blue-600 text-text'
                            : isPast
                            ? 'bg-slate-800 text-emerald-400 border border-border'
                            : 'bg-surface text-slate-500'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <strong className={isCurrent ? 'text-text' : 'text-text-muted'}>{wp.cameraId}</strong>
                    </div>

                    <span className="text-slate-400">{wp.timestamp}</span>
                  </div>

                  <div className="text-xs font-semibold text-text pl-7">
                    {wp.locationName}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pl-7 mt-1 text-text-muted">
                    <span>District: <strong className="text-text-muted">{wp.district}</strong></span>
                    <span className="text-emerald-400 font-bold">{wp.confidence}% conf</span>
                  </div>

                  {wp.speedKmh && (
                    <div className="text-[10px] font-mono pl-7 mt-0.5 text-blue-300 flex items-center space-x-1">
                      <Gauge className="w-3 h-3" />
                      <span>Speed: {wp.speedKmh} km/h (Corridor Sensor)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Fix Coordinate Lock */}
          <div className="p-3 bg-bg border-t border-border text-xs font-mono space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active Geolocation Lock:</div>
            <div className="text-text font-bold">
              Lat {activeWaypoint.lat.toFixed(4)}, Lng {activeWaypoint.lng.toFixed(4)}
            </div>
            <div className="text-[10px] text-slate-400">
              Corridor handoff status: <strong className="text-emerald-400">Automated Handoff Verified</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
