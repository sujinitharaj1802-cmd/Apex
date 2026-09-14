import React, { useState } from 'react';
import { GujaratMap } from '../components/map/GujaratMap';
import { StatCard } from '../components/common/StatCard';
import { StatusPill } from '../components/common/StatusPill';
import { MockFeedPreview } from '../components/common/MockFeedPreview';
import { useApp } from '../context/AppContext';
import { Camera, Alert } from '../types';
import { STATEWIDE_METRICS } from '../services/mockDataService';
import {
  Camera as CameraIcon,
  Activity,
  Zap,
  Clock,
  ArrowRight,
  Pause,
  Play,
  X,
  Wrench,
  AlertTriangle,
  Radio,
  Shield,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useRole } from '../context/RoleContext';

export const DashboardPage: React.FC = () => {
  const {
    cameras,
    alerts,
    isFeedPaused,
    toggleFeedPause,
    setSelectedAlert,
    selectedCamera,
    setSelectedCamera,
    setCurrentScreen,
    addWorkOrder,
  } = useApp();
  const { role, roleConfig } = useRole();

  const [inspectDrawerCamera, setInspectDrawerCamera] = useState<Camera | null>(null);

  const handleSelectCamera = (cam: Camera) => {
    setSelectedCamera(cam);
    setInspectDrawerCamera(cam);
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setCurrentScreen('alerts');
  };

  const handleOpenAlertById = (alertId: string) => {
    const found = alerts.find((a) => a.id === alertId);
    if (found) {
      setSelectedAlert(found);
      setCurrentScreen('alerts');
    }
  };

  const handleCreateWorkOrder = async (cam: Camera) => {
    await addWorkOrder({
      cameraId: cam.id,
      district: cam.district,
      issue: cam.failureReason || 'Diagnostic ping anomaly flagged from Command Center.',
      priority: cam.status === 'offline' ? 'Critical' : 'High',
      status: 'Open',
      technicianVendor: cam.vendor + ' Gujarat Support Team',
    });
    alert(`Simulated Work Order generated for ${cam.id}. Added to Health & O&M queue.`);
  };

  return (
    <div className="space-y-4 p-4 max-w-[1750px] mx-auto font-sans">
      {/* 4 Core KPIs as explicitly specified */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="TOTAL CAMERAS"
          value={STATEWIDE_METRICS.totalCameras}
          subtext="Across 26 State Departments"
          targetTag="Statewide Infrastructure"
          icon={CameraIcon}
          color="blue"
        />

        <StatCard
          label="CAMERAS ONLINE"
          value={STATEWIDE_METRICS.camerasOnlinePercent}
          subtext={`${STATEWIDE_METRICS.camerasOnlineCount} Simulated Nodes Active`}
          trend="+0.4%"
          trendPositive={true}
          targetTag="Target / simulated"
          icon={Activity}
          color="emerald"
        />

        <StatCard
          label="ACTIVE ALERTS"
          value={STATEWIDE_METRICS.activeAlerts}
          subtext="Live Queue Under Operational Triage"
          trend={isFeedPaused ? 'Paused' : 'Streaming'}
          trendPositive={!isFeedPaused}
          targetTag="Live Incident Queue"
          icon={Zap}
          color="rose"
        />

        <StatCard
          label="ALERT RESPONSE"
          value={STATEWIDE_METRICS.avgResponseTime}
          subtext="Simulated Edge-to-Console Latency"
          trend="-6 sec"
          trendPositive={true}
          targetTag="Target / simulated"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Active Role Command Context Strip */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-blue-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Console Profile:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleConfig.badgeColor}`}>
                {roleConfig.title} ({roleConfig.badge})
              </span>
              <span className="text-slate-500 hidden sm:inline">• {roleConfig.districtFocus}</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-sans">
              <strong>Operational Focus:</strong> {roleConfig.primaryFocus}
            </div>
          </div>
        </div>

        {/* Dynamic Role-Specific Fast Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {role === 'operator' && (
            <>
              <button
                onClick={() => setCurrentScreen('alerts')}
                className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>Triage Queue (45)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentScreen('cameras')}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>Camera Catalog</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </>
          )}

          {role === 'sp' && (
            <>
              <button
                onClick={() => setCurrentScreen('tracking')}
                className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>Authorize Interception (SIM-VH-0238)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentScreen('health')}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>O&M SLA Queue</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => setCurrentScreen('integration')}
                className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>26-Dept Federation</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentScreen('audit')}
                className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>Verify SHA-256 Ledger</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Single Pane of Glass: Map (Left/Center) + Live Incident Center (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT / CENTER: Statewide GIS network */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Statewide GIS Sensor Network
              </h2>
              <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                Representative simulated camera locations
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Click marker for telemetry • 80,000+ total fleet represented
            </div>
          </div>

          <GujaratMap
            cameras={cameras}
            selectedCamera={selectedCamera}
            onSelectCamera={handleSelectCamera}
            onOpenAlert={handleOpenAlertById}
            heightClass="h-[580px]"
          />
        </div>

        {/* RIGHT: Live incident queue */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[620px] shadow-lg">
          {/* Header */}
          <div className="p-3 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                LIVE INCIDENT CENTER
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFeedPause}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors flex items-center space-x-1 ${
                  isFeedPaused
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Pause live alert ticker for speaking"
              >
                {isFeedPaused ? (
                  <>
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>PAUSE LIVE FEED</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-2.5 h-2.5" />
                    <span>PAUSE LIVE FEED</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alert Queue List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {alerts.slice(0, 30).map((alert) => {
              const borderClass =
                alert.severity === 'CRITICAL'
                  ? 'border-l-4 border-l-red-500 border-slate-800'
                  : alert.severity === 'HIGH'
                  ? 'border-l-4 border-l-orange-500 border-slate-800'
                  : alert.severity === 'MEDIUM'
                  ? 'border-l-4 border-l-amber-500 border-slate-800'
                  : 'border-l-4 border-l-slate-500 border-slate-800';

              return (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`p-2.5 rounded bg-slate-900/60 hover:bg-slate-800/80 border transition-all cursor-pointer ${borderClass}`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{alert.id}</span>
                      <StatusPill status={alert.severity} size="sm" />
                    </div>
                    <span className="text-slate-400">{alert.timestamp}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-100 mt-0.5">
                    {alert.title}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1.5">
                    <span className="truncate max-w-[200px]">{alert.district} • {alert.locationName}</span>
                    <span className="text-slate-300 font-bold text-[10px]">{alert.confidence}% conf</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-slate-500">
              Showing active simulated queue
            </span>
            <button
              onClick={() => setCurrentScreen('alerts')}
              className="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center space-x-1"
            >
              <span>VIEW ALL ALERTS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Inspection Slide-over Drawer */}
      {inspectDrawerCamera && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="bg-[#0F172A] border-l border-slate-700 w-full max-w-md h-full overflow-y-auto p-5 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-blue-400 font-bold">{inspectDrawerCamera.id}</div>
                  <h3 className="text-sm font-bold text-white">{inspectDrawerCamera.name}</h3>
                </div>
                <button
                  onClick={() => setInspectDrawerCamera(null)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Camera Video Preview Box */}
              <MockFeedPreview
                cameraId={inspectDrawerCamera.id}
                locationName={inspectDrawerCamera.locationName}
                district={inspectDrawerCamera.district}
                isOffline={inspectDrawerCamera.status === 'offline'}
                isDegraded={inspectDrawerCamera.status === 'degraded'}
              />

              {/* Camera Details */}
              <div className="bg-[#0B1120] border border-slate-800 rounded p-3.5 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>Hardware & Network Specs</span>
                  <StatusPill status={inspectDrawerCamera.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">District:</span>
                  <span className="text-white">{inspectDrawerCamera.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-white">{inspectDrawerCamera.dept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor OEM:</span>
                  <span className="text-white">{inspectDrawerCamera.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution:</span>
                  <span className="text-white">{inspectDrawerCamera.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VLAN IP:</span>
                  <span className="text-slate-300">{inspectDrawerCamera.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Firmware:</span>
                  <span className="text-slate-300">{inspectDrawerCamera.firmware}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">30-Day Uptime:</span>
                  <span className="text-emerald-400 font-bold">{inspectDrawerCamera.uptime30d}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Heartbeat:</span>
                  <span className="text-slate-300">{inspectDrawerCamera.lastHeartbeat}</span>
                </div>
                {inspectDrawerCamera.failureReason && (
                  <div className="pt-2 border-t border-slate-800 text-amber-400 text-xs">
                    <strong>Warning:</strong> {inspectDrawerCamera.failureReason}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              {(inspectDrawerCamera.status === 'degraded' || inspectDrawerCamera.status === 'offline') && (
                <button
                  onClick={() => handleCreateWorkOrder(inspectDrawerCamera)}
                  className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Generate Simulated Work Order</span>
                </button>
              )}

              <button
                onClick={() => setInspectDrawerCamera(null)}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-xs rounded transition-colors"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
