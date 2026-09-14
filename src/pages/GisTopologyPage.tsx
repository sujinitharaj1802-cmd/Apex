import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DISTRICT_CENTROIDS, STATEWIDE_METRICS } from '../services/mockDataService';
import { GujaratMap } from '../components/map/GujaratMap';
import { Camera } from '../types';
import {
  MapPin,
  Layers,
  Network,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
} from 'lucide-react';

export const GisTopologyPage: React.FC = () => {
  const { cameras, setSelectedCamera, setSelectedAlert, setCurrentScreen } = useApp();
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Ahmedabad');
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(5);
  const [isSpatialQueryActive, setIsSpatialQueryActive] = useState<boolean>(true);

  // District statistics calculation
  const districtStats = useMemo(() => {
    const dCams = cameras.filter((c) => c.district.toLowerCase() === selectedDistrictName.toLowerCase());
    const online = dCams.filter((c) => c.status === 'online').length;
    const degraded = dCams.filter((c) => c.status === 'degraded').length;
    const offline = dCams.filter((c) => c.status === 'offline').length;
    const activeAlerts = dCams.filter((c) => c.currentAlert).length;

    return {
      total: dCams.length,
      online,
      degraded,
      offline,
      activeAlerts,
      centroid: DISTRICT_CENTROIDS.find((c) => c.district.toLowerCase() === selectedDistrictName.toLowerCase()) || DISTRICT_CENTROIDS[0],
      cameras: dCams,
    };
  }, [cameras, selectedDistrictName]);

  // Simulated 5km spatial query calculation
  const nearbyCameras = useMemo(() => {
    if (!isSpatialQueryActive || !districtStats.centroid) {
      return districtStats.cameras.slice(0, 8).map((cam) => ({ ...cam, distanceKm: 1.2 }));
    }
    const centerLat = districtStats.centroid.lat;
    const centerLng = districtStats.centroid.lng;

    // Simulated Euclidean distance mapped to km (1 deg ~ 111 km)
    return districtStats.cameras
      .map((cam) => {
        const dLat = (cam.lat - centerLat) * 111;
        const dLng = (cam.lng - centerLng) * 111 * Math.cos((centerLat * Math.PI) / 180);
        const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
        return { ...cam, distanceKm: Number(distKm.toFixed(2)) };
      })
      .filter((cam) => cam.distanceKm <= searchRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [districtStats, searchRadiusKm, isSpatialQueryActive]);

  const handleInspectCamera = (cam: Camera) => {
    setSelectedCamera(cam);
    setCurrentScreen('cameras');
  };

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">GIS Infrastructure & Network Topology Layer</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Spatial indexing foundation mapping Gujarat's representative edge nodes into municipal and highway clusters
          </p>
        </div>

        <div className="text-xs font-mono bg-[#0F172A] border border-slate-800 px-3 py-1.5 rounded text-slate-300">
          Spatial Resolution: <strong className="text-blue-400">Sub-meter Centroid Tagging</strong>
        </div>
      </div>

      {/* 4 Backbone Pillars Explained */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#0F172A] border border-slate-800 rounded p-3 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Pillar 1</div>
          <div className="text-white font-bold">Camera Registry</div>
          <p className="text-[11px] text-slate-400 font-sans">
            Centralized metadata store containing UID, vendor profile, IP scheme, and install date.
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded p-3 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Pillar 2</div>
          <div className="text-blue-400 font-bold">GIS Layer</div>
          <p className="text-[11px] text-slate-400 font-sans">
            Geospatial indexing providing polygonal polygon boundaries and corridor buffers.
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded p-3 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Pillar 3</div>
          <div className="text-purple-400 font-bold">Network Topology</div>
          <p className="text-[11px] text-slate-400 font-sans">
            Mesh and star telemetry mapping across municipal WANs, BSNL fiber, and cellular edge links.
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded p-3 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Pillar 4</div>
          <div className="text-emerald-400 font-bold">Health Monitoring</div>
          <p className="text-[11px] text-slate-400 font-sans">
            Automated heartbeat pings checking packet loss, lens occlusion, and power drops.
          </p>
        </div>
      </div>

      {/* District Selector & Metric Breakdown Strip */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Selected District:</span>
          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            aria-label="Select district for GIS breakdown"
            className="bg-[#0B1120] border border-slate-700 text-white py-1.5 px-3 rounded focus:outline-none focus:border-blue-500"
          >
            {DISTRICT_CENTROIDS.map((c) => (
              <option key={c.district} value={c.district}>
                {c.district} District
              </option>
            ))}
          </select>
        </div>

        {/* District Metrics */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-slate-500 text-[10px] block">TOTAL REPRESENTATIVE:</span>
            <strong className="text-white">{districtStats.total} Nodes</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">ONLINE:</span>
            <strong className="text-emerald-400">{districtStats.online}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">DEGRADED:</span>
            <strong className="text-amber-400">{districtStats.degraded}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">OFFLINE:</span>
            <strong className="text-red-400">{districtStats.offline}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">ACTIVE ALERTS:</span>
            <strong className="text-red-400 font-bold">{districtStats.activeAlerts}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Spatial Query Results (5 cols) + Map (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Spatial Radius Query */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-3 flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Simulated Spatial Query</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {nearbyCameras.length} Nodes within {searchRadiusKm} km
            </span>
          </div>

          {/* Radius Slider */}
          <div className="space-y-1 bg-[#0B1120] p-2.5 rounded border border-slate-800 text-xs font-mono">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Spatial Radius: <strong>{searchRadiusKm} km</strong> from {selectedDistrictName} centroid</span>
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={1}
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>2 km (Local Junction)</span>
              <span>15 km (District Ring)</span>
            </div>
          </div>

          {/* Nearby Nodes List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {nearbyCameras.map((cam, idx) => (
              <div
                key={cam.id}
                onClick={() => handleInspectCamera(cam)}
                className="p-2.5 rounded bg-[#0B1120] border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-colors text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400">{cam.id}</span>
                  <span className="text-emerald-400 font-bold">{cam.distanceKm} km away</span>
                </div>
                <div className="text-slate-200 text-xs font-sans font-semibold mt-0.5">
                  {cam.name}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>Vendor: {cam.vendor}</span>
                  <span>Health: {cam.healthScore}/100</span>
                  <span className={cam.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}>
                    {cam.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map view */}
        <div className="lg:col-span-7">
          <GujaratMap
            cameras={districtStats.cameras}
            selectedCamera={null}
            onSelectCamera={handleInspectCamera}
            heightClass="h-[520px]"
          />
        </div>
      </div>
    </div>
  );
};
