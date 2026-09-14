import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Camera } from '../types';
import { StatusPill } from '../components/common/StatusPill';
import { MockFeedPreview } from '../components/common/MockFeedPreview';
import {
  Search,
  Camera as CameraIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Wrench,
  AlertTriangle,
  Radio,
  CheckCircle,
} from 'lucide-react';

export const CameraRegistryPage: React.FC = () => {
  const { cameras, addWorkOrder } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const [selectedDrawerCam, setSelectedDrawerCam] = useState<Camera | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<{
    status: string;
    rtt: string;
    loss: string;
    rtsp: string;
    edgeAi: string;
    success: boolean;
  } | null>(null);
  const itemsPerPage = 12;

  // Unique lists for filter dropdowns
  const districts = useMemo(() => Array.from(new Set(cameras.map((c) => c.district))), [cameras]);
  const vendors = ['CP Plus', 'Hikvision', 'Dahua', 'Bosch', 'Axis'];
  const depts = useMemo(() => Array.from(new Set(cameras.map((c) => c.dept))), [cameras]);

  // Filtered cameras
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchesSearch =
        searchTerm === '' ||
        cam.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cam.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cam.ipAddress.includes(searchTerm);

      const matchesDistrict = districtFilter === 'all' || cam.district === districtFilter;
      const matchesVendor = vendorFilter === 'all' || cam.vendor === vendorFilter;
      const matchesStatus = statusFilter === 'all' || cam.status === statusFilter;
      const matchesDept = deptFilter === 'all' || cam.dept === deptFilter;

      return matchesSearch && matchesDistrict && matchesVendor && matchesStatus && matchesDept;
    });
  }, [cameras, searchTerm, districtFilter, vendorFilter, statusFilter, deptFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage) || 1;
  const paginatedCameras = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCameras.slice(start, start + itemsPerPage);
  }, [filteredCameras, currentPage]);

  const handleIssueWorkOrder = async (cam: Camera) => {
    await addWorkOrder({
      cameraId: cam.id,
      district: cam.district,
      issue: cam.failureReason || 'Routine maintenance flagged from Registry.',
      priority: cam.status === 'offline' ? 'Critical' : 'Medium',
      status: 'Open',
      technicianVendor: `${cam.vendor} SLA Field Team`,
    });
    alert(`Simulated Work Order generated for ${cam.id}. Record logged.`);
  };

  const handlePingDiagnostic = (cam: Camera) => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      if (cam.status === 'offline') {
        setPingResult({
          status: 'HOST UNREACHABLE',
          rtt: 'Timeout (>2000ms)',
          loss: '100%',
          rtsp: 'ERR_RTSP_CONNECTION_FAILED (Port 554)',
          edgeAi: 'Inactive (No Telemetry Stream)',
          success: false,
        });
      } else if (cam.status === 'degraded') {
        setPingResult({
          status: 'DEGRADED CONNECTION',
          rtt: `${Math.floor(220 + Math.random() * 80)}ms`,
          loss: '14.2%',
          rtsp: 'RTSP/1.0 200 OK • Frame Drops Detected',
          edgeAi: 'Degraded • Falling back to lower bitrate',
          success: false,
        });
      } else {
        setPingResult({
          status: 'NOMINAL / HEALTHY',
          rtt: `${Math.floor(14 + Math.random() * 12)}ms`,
          loss: '0%',
          rtsp: 'RTSP/1.0 200 OK • Negotiated H.265 / 30fps',
          edgeAi: 'Active • ONVIF Profile S/T Compliant',
          success: true,
        });
      }
    }, 450);
  };

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <CameraIcon className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">Camera Registry & Asset Management</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Comprehensive catalog of 405 representative edge sensors across 26 state departments in Gujarat
          </p>
        </div>

        <div className="text-xs font-mono bg-[#0F172A] border border-slate-800 px-3 py-1.5 rounded text-slate-300">
          Representative Demo Catalog: <strong className="text-blue-400">{filteredCameras.length}</strong> of{' '}
          <strong className="text-white">{cameras.length}</strong> sensors
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 text-xs font-mono">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Location, IP..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 bg-[#0B1120] border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* District */}
        <div>
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by district"
            className="w-full py-1.5 px-2 bg-[#0B1120] border border-slate-700 rounded text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by department"
            className="w-full py-1.5 px-2 bg-[#0B1120] border border-slate-700 rounded text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="all">All Departments</option>
            {depts.map((dp) => (
              <option key={dp} value={dp}>
                {dp}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor */}
        <div>
          <select
            value={vendorFilter}
            onChange={(e) => {
              setVendorFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by vendor"
            className="w-full py-1.5 px-2 bg-[#0B1120] border border-slate-700 rounded text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="all">All Vendors</option>
            {vendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
            className="w-full py-1.5 px-2 bg-[#0B1120] border border-slate-700 rounded text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="degraded">Degraded</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#0B1120] text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Camera ID</th>
                <th className="p-3">Location & Landmark</th>
                <th className="p-3">District</th>
                <th className="p-3">Department</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Resolution</th>
                <th className="p-3">Status</th>
                <th className="p-3">Health</th>
                <th className="p-3">Last Heartbeat</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-mono text-[11px]">
              {paginatedCameras.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                      <CameraIcon className="w-8 h-8 text-slate-600" />
                      <span className="text-sm font-semibold text-slate-300">No cameras matching current filter criteria</span>
                      <p className="text-xs font-mono text-slate-500 max-w-md">
                        Try modifying search query, adjusting district, vendor OEM, or resetting status filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setDistrictFilter('all');
                          setVendorFilter('all');
                          setStatusFilter('all');
                          setDeptFilter('all');
                          setCurrentPage(1);
                        }}
                        className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono text-xs rounded border border-slate-700 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCameras.map((cam) => (
                  <tr
                    key={cam.id}
                    onClick={() => setSelectedDrawerCam(cam)}
                    className="hover:bg-slate-850 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-blue-400">{cam.id}</td>
                    <td className="p-3 font-sans">
                      <div className="font-semibold text-white">{cam.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{cam.ipAddress}</div>
                    </td>
                    <td className="p-3 text-slate-300">{cam.district}</td>
                    <td className="p-3 font-sans text-slate-400">{cam.dept}</td>
                    <td className="p-3 text-slate-400">{cam.vendor}</td>
                    <td className="p-3 text-slate-400">{cam.resolution.split(' ')[0]}</td>
                    <td className="p-3">
                      <StatusPill status={cam.status} />
                    </td>
                    <td className="p-3 font-bold text-emerald-400">{cam.healthScore}/100</td>
                    <td className="p-3 text-slate-400">{cam.lastHeartbeat}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDrawerCam(cam);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="text-slate-400">
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedDrawerCam && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="bg-[#0F172A] border-l border-slate-700 w-full max-w-md h-full overflow-y-auto p-5 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-400">{selectedDrawerCam.id}</span>
                  <h2 className="text-sm font-bold text-white">{selectedDrawerCam.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedDrawerCam(null)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Camera Preview */}
              <MockFeedPreview
                cameraId={selectedDrawerCam.id}
                locationName={selectedDrawerCam.locationName}
                district={selectedDrawerCam.district}
                isOffline={selectedDrawerCam.status === 'offline'}
                isDegraded={selectedDrawerCam.status === 'degraded'}
              />

              {/* Technical Details */}
              <div className="bg-[#0B1120] border border-slate-800 rounded p-3.5 space-y-2.5 font-mono text-xs">
                <div className="text-[10px] text-slate-500 uppercase font-semibold border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>Hardware & Health Telemetry</span>
                  <StatusPill status={selectedDrawerCam.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><span className="text-slate-500 text-[10px] block">DISTRICT</span><strong>{selectedDrawerCam.district}</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">DEPARTMENT</span><strong>{selectedDrawerCam.dept}</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">VENDOR OEM</span><strong>{selectedDrawerCam.vendor}</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">RESOLUTION</span><strong>{selectedDrawerCam.resolution}</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">IP ADDRESS</span><strong>{selectedDrawerCam.ipAddress}</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">FIRMWARE</span><strong>{selectedDrawerCam.firmware}</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">30-DAY UPTIME</span><strong className="text-emerald-400">{selectedDrawerCam.uptime30d}%</strong></div>
                  <div><span className="text-slate-500 text-[10px] block">HEALTH SCORE</span><strong className="text-blue-400">{selectedDrawerCam.healthScore}/100</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Last Heartbeat Ping: <strong className="text-slate-200">{selectedDrawerCam.lastHeartbeat}</strong>
                </div>

                {selectedDrawerCam.failureReason && (
                  <div className="pt-1 text-amber-400 text-xs">
                    <strong>Diagnostic Status:</strong> {selectedDrawerCam.failureReason}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => handlePingDiagnostic(selectedDrawerCam)}
                disabled={isPinging}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50 shadow"
              >
                <Radio className={`w-3.5 h-3.5 ${isPinging ? 'animate-pulse text-yellow-300' : ''}`} />
                <span>{isPinging ? 'Pinging Sensor via ICMP & ONVIF...' : 'Run Live Diagnostic Ping'}</span>
              </button>

              {pingResult && (
                <div className="bg-[#080D1A] border border-slate-700 rounded p-3 font-mono text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] border-b border-slate-800 pb-1">
                    <span className="text-slate-400 font-bold uppercase">Diagnostic Telemetry</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        pingResult.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-red-950 text-red-300 border border-red-700'
                      }`}
                    >
                      {pingResult.status}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    RTT: <strong className="text-white">{pingResult.rtt}</strong> • Packet Loss:{' '}
                    <strong className={pingResult.loss === '0%' ? 'text-emerald-400' : 'text-red-400'}>{pingResult.loss}</strong>
                  </div>
                  <div className="text-slate-400">
                    RTSP Stream: <strong className="text-slate-200">{pingResult.rtsp}</strong>
                  </div>
                  <div className="text-slate-400">
                    Edge Engine: <strong className="text-blue-300">{pingResult.edgeAi}</strong>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleIssueWorkOrder(selectedDrawerCam)}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Create Simulated Work Order</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDrawerCam(null);
                  setPingResult(null);
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-xs rounded transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
