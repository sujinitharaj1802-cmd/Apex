import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, WorkOrder } from '../types';
import { StatusPill } from '../components/common/StatusPill';
import {
  Activity,
  Wrench,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Server,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const HealthDashboardPage: React.FC = () => {
  const { cameras, workOrders, addWorkOrder } = useApp();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Uptime data per district for Recharts BarChart
  const districtUptimeData = useMemo(() => {
    const districtStats: Record<string, { total: number; online: number; sumUptime: number }> = {};

    cameras.forEach((cam) => {
      if (!districtStats[cam.district]) {
        districtStats[cam.district] = { total: 0, online: 0, sumUptime: 0 };
      }
      districtStats[cam.district].total++;
      if (cam.status === 'online') districtStats[cam.district].online++;
      districtStats[cam.district].sumUptime += cam.uptime30d;
    });

    return Object.keys(districtStats).map((d) => ({
      district: d,
      uptime: Number((districtStats[d].sumUptime / districtStats[d].total).toFixed(1)),
      cams: districtStats[d].total,
    }));
  }, [cameras]);

  // MTTR Trend Data (Mean Time To Repair in hours, past 4 weeks)
  const mttrTrendData = [
    { week: 'Wk 1', mttrHours: 4.6, targetHours: 3.0 },
    { week: 'Wk 2', mttrHours: 3.9, targetHours: 3.0 },
    { week: 'Wk 3', mttrHours: 3.1, targetHours: 3.0 },
    { week: 'Wk 4 (Current)', mttrHours: 2.4, targetHours: 3.0 },
  ];

  // Specific canonical at-risk cameras
  const canonicalAtRisk = useMemo(() => {
    const ids = ['CAM-AHM-0182', 'CAM-SUR-0314', 'CAM-VAD-0104', 'CAM-RAJ-0207'];
    const found = cameras.filter((c) => ids.includes(c.id));
    // Also include any other degraded or offline cameras
    const others = cameras.filter((c) => !ids.includes(c.id) && (c.status === 'degraded' || c.status === 'offline')).slice(0, 4);
    return [...found, ...others];
  }, [cameras]);

  const openWorkOrdersCount = workOrders.filter((w) => w.status === 'Open' || w.status === 'Assigned' || w.status === 'In-Progress').length;
  const resolvedWorkOrdersCount = workOrders.filter((w) => w.status === 'Resolved').length;

  const handleCreateWorkOrder = async (cam: Camera) => {
    await addWorkOrder({
      cameraId: cam.id,
      district: cam.district,
      issue: cam.failureReason || 'Predictive AI maintenance flagged optical or telemetry anomaly.',
      priority: cam.status === 'offline' ? 'Critical' : 'High',
      status: 'Open',
      technicianVendor: `${cam.vendor} Gujarat Field Support`,
    });

    setSuccessToast(`SIMULATED WORK ORDER generated for ${cam.id} (${cam.district}).`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-12 right-6 z-50 bg-surface border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-lg shadow-2xl flex items-center space-x-2 text-xs font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-text">Camera Network Health & Predictive Maintenance (O&M)</h1>
          </div>
          <p className="text-xs text-text-muted font-mono">
            Continuous diagnostic monitoring, automated degradation detection, and vendor SLA management
          </p>
        </div>

        <div className="text-xs font-mono bg-surface border border-border px-3 py-1.5 rounded text-text-muted">
          Statewide Availability: <strong className="text-emerald-400">96.4% (Target: ≥ 96.0%)</strong>
        </div>
      </div>

      {/* Top 4 Health Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-surface border border-border rounded p-3">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Overall Network Uptime</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">96.4%</div>
          <span className="text-[10px] text-text-muted">Simulated 30-Day Fleet SLA</span>
        </div>

        <div className="bg-surface border border-border rounded p-3">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Predictive Failure Detection</span>
          <div className="text-xl font-bold text-amber-400 mt-1">{canonicalAtRisk.length} Nodes Flagged</div>
          <span className="text-[10px] text-text-muted">Pre-outage telemetry anomaly</span>
        </div>

        <div className="bg-surface border border-border rounded p-3">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Current MTTR (Resolution)</span>
          <div className="text-xl font-bold text-blue-400 mt-1">2.4 Hours</div>
          <span className="text-[10px] text-text-muted">Down from 4.6h (Target: ≤ 3h)</span>
        </div>

        <div className="bg-surface border border-border rounded p-3">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Simulated Work Orders</span>
          <div className="text-xl font-bold text-text mt-1">
            {openWorkOrdersCount} Open <span className="text-slate-500 text-xs">/ {resolvedWorkOrdersCount} Resolved</span>
          </div>
          <span className="text-[10px] text-text-muted">Simulated local ticket queue</span>
        </div>
      </div>

      {/* Charts Row: District Uptime (Bar) + MTTR Trend (Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* District Uptime Bar Chart */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold font-mono uppercase text-text">
                CAMERA NETWORK HEALTH • UPTIME BY DISTRICT (%)
              </h3>
              <p className="text-[11px] text-text-muted">Representative 30-day availability across Gujarat districts</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Target ≥ 96%
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtUptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="district"
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis domain={[90, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val) => [`${val}% Uptime`, 'Availability']}
                />
                <Bar dataKey="uptime" fill="var(--color-accent)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MTTR Trend Line Chart */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold font-mono uppercase text-text">
                MEAN TIME TO REPAIR (MTTR) REDUCTION TREND
              </h3>
              <p className="text-[11px] text-text-muted">Average vendor resolution hours from ticket dispatch to close</p>
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 flex items-center space-x-1">
              <TrendingDown className="w-3 h-3" />
              <span>Down 47.8%</span>
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mttrTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis domain={[0, 6]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val) => [`${val} Hours`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="mttrHours"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  name="Actual MTTR"
                  dot={{ r: 4, fill: 'var(--color-accent)' }}
                />
                <Line
                  type="monotone"
                  dataKey="targetHours"
                  stroke="var(--color-alert)"
                  strokeDasharray="4 4"
                  name="SLA Cap"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PREDICTIVE MAINTENANCE: At-Risk Cameras Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-3 bg-bg border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-text">
              PREDICTIVE MAINTENANCE • AT-RISK CAMERA NODES
            </h3>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            Automated sensor diagnostic telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-bg text-text-muted font-mono uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="p-3">Sensor UID</th>
                <th className="p-3">Location & District</th>
                <th className="p-3">Vendor OEM</th>
                <th className="p-3">Detected Issue / Telemetry Flag</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-mono text-[11px]">
              {canonicalAtRisk.map((cam) => (
                <tr key={cam.id} className="hover:bg-surface transition-colors">
                  <td className="p-3 font-bold text-blue-400">{cam.id}</td>
                  <td className="p-3 font-sans">
                    <div className="font-semibold text-text">{cam.locationName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{cam.district}</div>
                  </td>
                  <td className="p-3 text-text-muted">{cam.vendor}</td>
                  <td className="p-3">
                    <span className="text-amber-400 font-bold">{cam.failureReason}</span>
                  </td>
                  <td className="p-3 font-bold text-text">{cam.healthScore}/100</td>
                  <td className="p-3">
                    <StatusPill status={cam.status} />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleCreateWorkOrder(cam)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-text font-bold rounded text-[10px] transition-colors inline-flex items-center space-x-1"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>GENERATE WORK ORDER</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Work Orders Queue */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-3 bg-bg border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-text">
              SIMULATED WORK ORDERS ({workOrders.length} Tickets)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
            SIMULATED WORK ORDER • NO REAL TICKETING INTEGRATION
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-bg text-text-muted font-mono uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="p-3">Work Order ID</th>
                <th className="p-3">Camera UID</th>
                <th className="p-3">District</th>
                <th className="p-3">Reported Telemetry Anomaly</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Vendor SLA Team</th>
                <th className="p-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-mono text-[11px]">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-surface transition-colors">
                  <td className="p-3 font-bold text-amber-400">{wo.id}</td>
                  <td className="p-3 text-blue-400 font-bold">{wo.cameraId}</td>
                  <td className="p-3 text-text-muted">{wo.district}</td>
                  <td className="p-3 font-sans text-text max-w-sm">{wo.issue}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        wo.priority === 'Critical'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <StatusPill status={wo.status} />
                  </td>
                  <td className="p-3 text-text-muted font-sans">{wo.technicianVendor}</td>
                  <td className="p-3 text-text-muted">{wo.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
