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
          label="Total Cameras"
          value={STATEWIDE_METRICS.totalCameras}
          subtext="Across 26 State Departments"
          targetTag="Statewide Infrastructure"
          icon={CameraIcon}
          color="blue"
        />

        <StatCard
          label="Cameras Online"
          value={STATEWIDE_METRICS.camerasOnlinePercent}
          subtext={`${STATEWIDE_METRICS.camerasOnlineCount} Simulated Nodes Active`}
          trend="+0.4%"
          trendPositive={true}
          targetTag="Target / simulated"
          icon={Activity}
          color="emerald"
        />

        <StatCard
          label="Active Alerts"
          value={STATEWIDE_METRICS.activeAlerts}
          subtext="Live Queue Under Operational Triage"
          trend={isFeedPaused ? 'Paused' : 'Streaming'}
          trendPositive={!isFeedPaused}
          targetTag="Live Incident Queue"
          icon={Zap}
          color="rose"
        />

        <StatCard
          label="Alert Response"
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
      <div className="bg-surface border border-border rounded-sm p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xs bg-bg border border-border text-accent">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-text-muted font-semibold">Active Console Profile:</span>
              <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold border border-border bg-bg text-text">
                {roleConfig.title} ({roleConfig.badge})
              </span>
              <span className="text-text-muted hidden sm:inline">• {roleConfig.districtFocus}</span>
            </div>
            <div className="text-[11px] text-text-muted mt-0.5 font-sans">
              <strong className="text-text">Operational Focus:</strong> {roleConfig.primaryFocus}
            </div>
          </div>
        </div>

        {/* Dynamic Role-Specific Fast Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {role === 'operator' && (
            <>
              <button
                onClick={() => setCurrentScreen('alerts')}
                className="px-2.5 py-1 rounded-xs bg-alert text-text border border-alert hover:opacity-90 transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>Triage Queue (45)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentScreen('cameras')}
                className="px-2.5 py-1 rounded-xs bg-bg text-text-muted border border-border hover:bg-surface transition-colors text-[11px] flex items-center space-x-1"
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
                className="px-2.5 py-1 rounded-xs bg-accent text-bg border border-accent hover:opacity-90 transition-colors text-[11px] flex items-center space-x-1 font-bold"
              >
                <span>Authorize Interception (SIM-VH-0238)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentScreen('health')}
                className="px-2.5 py-1 rounded-xs bg-bg text-text-muted border border-border hover:bg-surface transition-colors text-[11px] flex items-center space-x-1"
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
                className="px-2.5 py-1 rounded-xs bg-surface text-text border border-border hover:bg-bg transition-colors text-[11px] flex items-center space-x-1"
              >
                <span>26-Dept Federation</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setCurrentScreen('audit')}
                className="px-2.5 py-1 rounded-xs bg-bg text-accent border border-border hover:bg-surface transition-colors text-[11px] flex items-center space-x-1"
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
              <h2 className="text-xs font-bold text-text tracking-tight">
                Statewide GIS Sensor Network
              </h2>
              <span className="text-[11px] bg-bg border border-border px-2 py-0.5 rounded-xs text-text-muted">
                Representative simulated camera locations
              </span>
            </div>
            <div className="text-[11px] text-text-muted hidden sm:block">
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
        <div className="lg:col-span-4 bg-surface border border-border rounded-sm overflow-hidden flex flex-col h-[620px]">
          {/* Header */}
          <div className="p-3 bg-bg border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-alert" />
              <h3 className="text-xs font-bold tracking-tight text-text">
                Live Incident Center
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFeedPause}
                className={`px-2 py-0.5 rounded-xs text-[11px] border transition-colors flex items-center space-x-1 ${
                  isFeedPaused
                    ? 'bg-alert text-text border-alert'
                    : 'bg-bg text-text-muted border-border hover:text-text'
                }`}
                title="Pause live alert ticker for speaking"
              >
                {isFeedPaused ? (
                  <>
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Pause Live Feed</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-2.5 h-2.5 text-accent" />
                    <span>Pause Live Feed</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alert Queue List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {alerts.slice(0, 30).map((alert, idx) => {
              const borderClass =
                alert.severity === 'CRITICAL'
                  ? 'border-l-4 border-l-alert border-border'
                  : 'border-l-4 border-l-accent border-border';

              return (
                <div
                  key={`${alert.id}-${idx}`}
                  onClick={() => handleAlertClick(alert)}
                  className={`p-2.5 rounded-xs bg-bg hover:bg-surface border transition-all cursor-pointer ${borderClass}`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-text">{alert.id}</span>
                      <StatusPill status={alert.severity} size="sm" />
                    </div>
                    <span className="text-text-muted">{alert.timestamp}</span>
                  </div>

                  <div className="text-xs font-semibold text-text mt-0.5">
                    {alert.title}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
                    <span className="truncate max-w-[200px]">{alert.district} • {alert.locationName}</span>
                    <span className="text-accent font-bold text-[10px]">{alert.confidence}% conf</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-bg border-t border-border flex items-center justify-between text-xs">
            <span className="text-[10px] text-text-muted">
              Showing active simulated queue
            </span>
            <button
              onClick={() => setCurrentScreen('alerts')}
              className="text-accent hover:underline text-xs font-bold flex items-center space-x-1"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Inspection Slide-over Drawer */}
      {inspectDrawerCamera && (
        <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-xs flex justify-end">
          <div className="bg-surface border-l border-border w-full max-w-md h-full overflow-y-auto p-5 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="text-xs text-accent font-bold">{inspectDrawerCamera.id}</div>
                  <h3 className="text-sm font-bold text-text">{inspectDrawerCamera.name}</h3>
                </div>
                <button
                  onClick={() => setInspectDrawerCamera(null)}
                  className="p-1 rounded-xs hover:bg-bg text-text-muted hover:text-text"
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
              <div className="bg-bg border border-border rounded-xs p-3.5 space-y-2 text-xs">
                <div className="text-[10px] text-text-muted font-semibold border-b border-border pb-1 flex items-center justify-between">
                  <span>Hardware & Network Specs</span>
                  <StatusPill status={inspectDrawerCamera.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">District:</span>
                  <span className="text-text">{inspectDrawerCamera.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Department:</span>
                  <span className="text-text">{inspectDrawerCamera.dept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Vendor OEM:</span>
                  <span className="text-text">{inspectDrawerCamera.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Resolution:</span>
                  <span className="text-text">{inspectDrawerCamera.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">VLAN IP:</span>
                  <span className="text-text-muted">{inspectDrawerCamera.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Firmware:</span>
                  <span className="text-text-muted">{inspectDrawerCamera.firmware}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">30-Day Uptime:</span>
                  <span className="text-accent font-bold">{inspectDrawerCamera.uptime30d}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Last Heartbeat:</span>
                  <span className="text-text-muted">{inspectDrawerCamera.lastHeartbeat}</span>
                </div>
                {inspectDrawerCamera.failureReason && (
                  <div className="pt-2 border-t border-border text-alert text-xs">
                    <strong>Warning:</strong> {inspectDrawerCamera.failureReason}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-border">
              {(inspectDrawerCamera.status === 'degraded' || inspectDrawerCamera.status === 'offline') && (
                <button
                  onClick={() => handleCreateWorkOrder(inspectDrawerCamera)}
                  className="w-full py-2 px-3 bg-alert hover:opacity-90 text-text text-xs font-bold rounded-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Generate Simulated Work Order</span>
                </button>
              )}

              <button
                onClick={() => setInspectDrawerCamera(null)}
                className="w-full py-2 px-3 bg-bg hover:bg-surface text-text-muted text-xs rounded-xs border border-border transition-colors font-medium"
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
