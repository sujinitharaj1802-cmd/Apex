import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusPill } from '../components/common/StatusPill';
import { MockFeedPreview } from '../components/common/MockFeedPreview';
import { EvidenceModal } from '../components/modals/EvidenceModal';
import { Alert, AlertStatus, AlertSeverity } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  Send,
  FileDown,
  Clock,
  Radio,
  Eye,
  Camera as CameraIcon,
  Layers,
  MapPin,
  Play,
  Pause,
} from 'lucide-react';
import { useRole } from '../context/RoleContext';

export const AlertInvestigationPage: React.FC = () => {
  const { alerts, selectedAlert, setSelectedAlert, updateAlertStatus, exportEvidence, isFeedPaused, toggleFeedPause } = useApp();
  const { roleConfig } = useRole();
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const activeAlert = selectedAlert || alerts[0] || null;

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusTransition = async (newStatus: AlertStatus) => {
    if (!activeAlert) return;
    await updateAlertStatus(activeAlert.id, newStatus);
    triggerToast(`Incident ${activeAlert.id} transitioned to "${newStatus}". Cryptographic SHA-256 audit entry registered.`);
  };

  const handleExportClick = () => {
    if (!activeAlert) return;
    setShowEvidenceModal(true);
  };

  const handleExportFinished = async () => {
    if (activeAlert) {
      await exportEvidence(activeAlert);
    }
  };

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-red-400" />
            <h1 className="text-lg font-bold text-white">Live Incident Center & Forensic Investigation</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Triaging console for simulated ANPR hits, facial watchlist alerts, perimeter incursions, and crowd anomalies
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Pause / Resume Feed Toggle */}
          <button
            onClick={toggleFeedPause}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center space-x-1.5 ${
              isFeedPaused
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isFeedPaused ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>RESUME FEED</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                <span>PAUSE LIVE FEED</span>
              </>
            )}
          </button>

          {activeAlert && (
            <button
              onClick={handleExportClick}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>EXPORT EVIDENCE PACKAGE</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Investigation Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Incident Queue (4 cols) */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[700px]">
          {/* Queue Filter */}
          <div className="p-2.5 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Severity</span>
            <div className="flex items-center space-x-1">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    severityFilter === sev
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Queue */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-slate-300 text-xs font-semibold">No alerts matching "{severityFilter}"</span>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  All alerts in this severity category have been resolved or filtered out.
                </p>
                <button
                  onClick={() => setSeverityFilter('ALL')}
                  className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono text-xs rounded border border-slate-700 transition-colors"
                >
                  Reset Filter to ALL
                </button>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isSelected = activeAlert?.id === alert.id;
                const borderClass =
                  alert.severity === 'CRITICAL'
                    ? 'border-l-4 border-l-red-500'
                    : alert.severity === 'HIGH'
                    ? 'border-l-4 border-l-orange-500'
                    : alert.severity === 'MEDIUM'
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-slate-500';

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-3 rounded border transition-all cursor-pointer ${borderClass} ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{alert.id}</span>
                        <StatusPill status={alert.severity} size="sm" />
                      </div>
                      <span>{alert.timestamp}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-100">{alert.title}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                      <span>{alert.district} • {alert.locationName}</span>
                      <span className="text-emerald-400 font-bold">{alert.confidence}% conf</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2 bg-[#0B1120] border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
            {filteredAlerts.length} Simulated Alerts in Queue
          </div>
        </div>

        {/* Right: Active Incident Workspace (8 cols) */}
        {activeAlert ? (
          <div className="lg:col-span-8 space-y-4">
            {/* 1. INCIDENT SUMMARY */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <div className="text-[10px] text-slate-200 uppercase tracking-wider font-bold">
                    INCIDENT SUMMARY • APEX DISPATCH PROTOCOL
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5 flex items-center space-x-2">
                    <span>{activeAlert.id}: {activeAlert.title}</span>
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <StatusPill status={activeAlert.severity} size="md" />
                  <StatusPill status={activeAlert.status} size="md" />
                </div>
              </div>

              {/* Summary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800">
                  <span className="text-slate-200 text-[10px] uppercase font-bold block">ALERT TYPE</span>
                  <strong className="text-white">{activeAlert.type}</strong>
                </div>
                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800">
                  <span className="text-slate-200 text-[10px] uppercase font-bold block">JURISDICTION</span>
                  <strong className="text-white">{activeAlert.district}</strong>
                </div>
                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800">
                  <span className="text-slate-200 text-[10px] uppercase font-bold block">SOURCE CAMERA</span>
                  <strong className="text-white font-bold">{activeAlert.cameraId}</strong>
                </div>
                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800">
                  <span className="text-slate-200 text-[10px] uppercase font-bold block">CONFIDENCE</span>
                  <strong className="text-emerald-400 font-bold">{activeAlert.confidence}% Synthetic</strong>
                </div>
              </div>

              {/* Triage Action Progression */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-slate-200">
                  Console Operator: <strong className="text-white">{roleConfig.badge}</strong>
                </div>

                <div className="flex items-center space-x-2">
                  {activeAlert.status === 'Detected' && (
                    <button
                      onClick={() => handleStatusTransition('Acknowledged')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded flex items-center space-x-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge Incident</span>
                    </button>
                  )}

                  {(activeAlert.status === 'Detected' || activeAlert.status === 'AI Analysis' || activeAlert.status === 'Acknowledged') && (
                    <button
                      onClick={() => handleStatusTransition('Dispatched')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded flex items-center space-x-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Patrol Unit</span>
                    </button>
                  )}

                  {activeAlert.status === 'Dispatched' && (
                    <button
                      onClick={() => handleStatusTransition('Resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded flex items-center space-x-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Incident Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. SIMULATED CAMERA VIEW & TARGET SIGNATURE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Surveillance Frame */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  SIMULATED CAMERA VIEW
                </div>
                <MockFeedPreview
                  cameraId={activeAlert.cameraId}
                  locationName={activeAlert.locationName}
                  district={activeAlert.district}
                  boundingBoxLabel={
                    activeAlert.details.plateNumber ||
                    activeAlert.details.targetId ||
                    activeAlert.type
                  }
                  aspectRatio="square"
                />
              </div>

              {/* Target Signature Details */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-3 font-mono text-xs flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="text-[10px] text-slate-500 uppercase font-bold border-b border-slate-800 pb-1">
                    TARGET TELEMETRY PROFILE
                  </div>

                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location Point:</span>
                      <strong className="text-white text-right">{activeAlert.locationName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timestamp:</span>
                      <strong>{activeAlert.timestamp} IST</strong>
                    </div>

                    {activeAlert.details.plateNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Synthetic Plate:</span>
                        <strong className="text-amber-400 font-bold">{activeAlert.details.plateNumber}</strong>
                      </div>
                    )}
                    {activeAlert.details.vehicleModel && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vehicle Profile:</span>
                        <strong>{activeAlert.details.vehicleModel}</strong>
                      </div>
                    )}
                    {activeAlert.details.speedEstimate && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Estimated Speed:</span>
                        <strong className="text-blue-400">{activeAlert.details.speedEstimate}</strong>
                      </div>
                    )}
                    {activeAlert.details.targetId && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Watchlist Index:</span>
                        <strong className="text-red-400 font-bold">{activeAlert.details.targetId}</strong>
                      </div>
                    )}
                    {activeAlert.details.watchlistCategory && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Watchlist Cat:</span>
                        <span className="text-slate-300 text-right text-[11px]">{activeAlert.details.watchlistCategory}</span>
                      </div>
                    )}
                    {activeAlert.details.crowdDensity && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Crowd Density:</span>
                        <strong className="text-amber-400">{activeAlert.details.crowdDensity} p/m²</strong>
                      </div>
                    )}
                    {activeAlert.details.perimeterZone && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Perimeter Sector:</span>
                        <strong className="text-red-400">{activeAlert.details.perimeterZone}</strong>
                      </div>
                    )}
                  </div>

                  {activeAlert.details.notes && (
                    <div className="p-2.5 bg-[#0B1120] border border-slate-800 rounded text-slate-300 text-[11px] font-sans">
                      {activeAlert.details.notes}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  Logged in local audit chain under Sec. 65B simulation protocol.
                </div>
              </div>
            </div>

            {/* 3. INCIDENT TIMELINE */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>INCIDENT TIMELINE</span>
                </div>
                <span className="text-[10px] text-slate-400">Detected ➔ AI Analysis ➔ Acknowledged ➔ Dispatched ➔ Resolved</span>
              </div>

              <div className="space-y-2.5">
                {activeAlert.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <StatusPill status={event.status} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-[11px]">
                        <strong className="text-slate-200">{event.actor}</strong>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{event.timestamp}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] font-sans mt-0.5">{event.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. RELATED INFORMATION */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-2.5 font-mono text-xs">
              <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>RELATED CORRELATION INFORMATION</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] block font-bold">Nearby Cameras in Sector:</span>
                  <div className="text-slate-300">
                    Primary: <strong className="text-blue-400">{activeAlert.relatedInfo.relatedCameraId}</strong>
                  </div>
                  <div className="text-slate-400">
                    Adjacent: {activeAlert.relatedInfo.nearbyCameras.join(', ')}
                  </div>
                </div>

                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] block font-bold">Cross-District Observations:</span>
                  <div className="text-slate-300">
                    {activeAlert.relatedInfo.crossDistrictObservations[0] || 'No cross-district flags'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#0F172A] border border-slate-800 rounded-lg p-12 text-center text-slate-500 font-mono">
            Select an incident from the queue to inspect.
          </div>
        )}
      </div>

      {/* Export Evidence Modal */}
      {showEvidenceModal && activeAlert && (
        <EvidenceModal
          alert={activeAlert}
          onClose={() => setShowEvidenceModal(false)}
          onExportComplete={handleExportFinished}
        />
      )}

      {/* Floating Audit Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1120] border border-blue-500 text-slate-200 px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-3 text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
