import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Camera } from '../../types';
import { DISTRICT_CENTROIDS, STATEWIDE_METRICS } from '../../services/mockDataService';
import { Filter, Maximize2, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GujaratMapProps {
  cameras: Camera[];
  selectedCamera: Camera | null;
  onSelectCamera: (camera: Camera) => void;
  filterStatus?: 'all' | 'online' | 'degraded' | 'offline';
  heightClass?: string;
  onOpenAlert?: (alertId: string) => void;
}

export const GujaratMap: React.FC<GujaratMapProps> = ({
  cameras,
  selectedCamera,
  onSelectCamera,
  filterStatus = 'all',
  heightClass = 'h-[520px]',
  onOpenAlert,
}) => {
  const { theme } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [internalStatusFilter, setInternalStatusFilter] = useState<string>(filterStatus);

  // Initialize Map focused directly on Gujarat
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of Gujarat
    const map = L.map(mapContainerRef.current, {
      center: [22.4, 71.6],
      zoom: 7,
      minZoom: 6.5,
      maxZoom: 16,
      maxBounds: [
        [19.5, 67.5], // South-West
        [24.8, 75.2], // North-East
      ],
      maxBoundsViscosity: 0.8,
      attributionControl: false,
    });

    // Base tiles based on current theme (OpenStreetMap standard for light mode to avoid API key limits)
    const tileUrl =
      theme === 'light'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      subdomains: 'abc',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tiles;

    L.control
      .attribution({
        prefix: '<span class="text-[11px] text-slate-800 font-bold">Apex GIS • Gujarat Police Concept</span>',
        position: 'bottomright',
      })
      .addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered = cameras.filter((cam) => {
      const matchDistrict = selectedDistrict === 'all' || cam.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchStatus = internalStatusFilter === 'all' || cam.status === internalStatusFilter;
      return matchDistrict && matchStatus;
    });

    filtered.forEach((cam) => {
      const color =
        cam.status === 'online'
          ? '#10B981' // Green
          : cam.status === 'degraded'
          ? '#F59E0B' // Amber
          : '#EF4444'; // Red

      const marker = L.circleMarker([cam.lat, cam.lng], {
        radius: cam.currentAlert ? 7 : cam.status === 'offline' ? 6 : 5,
        fillColor: color,
        color: cam.currentAlert ? '#FFFFFF' : '#0F172A',
        weight: cam.currentAlert ? 2 : 1.5,
        opacity: 1,
        fillOpacity: 0.85,
      });

      const popupHtml = `
        <div class="p-2 space-y-1.5 min-w-[220px] text-xs text-white">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1">
            <span class="font-bold text-white text-sm">${cam.id}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold text-white ${
              cam.status === 'online'
                ? 'bg-emerald-950 border border-emerald-700'
                : cam.status === 'degraded'
                ? 'bg-amber-950 border border-amber-600'
                : 'bg-red-950 border border-red-700'
            }">${cam.status}</span>
          </div>

          <div class="font-bold text-white text-sm mt-0.5">${cam.locationName}</div>

          <div class="grid grid-cols-2 gap-1 text-[11px] text-white mt-1">
            <div><span class="text-slate-200 block text-[10px] uppercase font-bold">District</span><span class="text-white font-semibold">${cam.district}</span></div>
            <div><span class="text-slate-200 block text-[10px] uppercase font-bold">Dept</span><span class="text-white font-semibold">${cam.dept}</span></div>
            <div><span class="text-slate-200 block text-[10px] uppercase font-bold">Vendor</span><span class="text-white font-semibold">${cam.vendor}</span></div>
            <div><span class="text-slate-200 block text-[10px] uppercase font-bold">Health</span><span class="text-emerald-400 font-bold">${cam.healthScore}/100</span></div>
          </div>

          <div class="text-[11px] text-slate-200 pt-1 border-t border-slate-800">
            Heartbeat: <strong class="text-white">${cam.lastHeartbeat}</strong>
          </div>

          ${
            cam.currentAlert
              ? `<div class="bg-red-950 border border-red-700 p-1.5 rounded text-[11px] text-white font-bold flex items-center justify-between">
                  <span>Alert: <strong class="text-white underline">${cam.currentAlert}</strong></span>
                  <button id="alert-jump-btn-${cam.id}" class="underline text-white font-bold hover:text-amber-300">View Alert</button>
                </div>`
              : ''
          }

          <button id="inspect-btn-${cam.id}" class="w-full mt-2 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors text-center block">
            Inspect Sensor Telemetry
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-btn-${cam.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectCamera(cam);
          };
        }
        if (cam.currentAlert && onOpenAlert) {
          const alertBtn = document.getElementById(`alert-jump-btn-${cam.id}`);
          if (alertBtn) {
            alertBtn.onclick = () => {
              onOpenAlert(cam.currentAlert!);
            };
          }
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [cameras, selectedDistrict, internalStatusFilter, onSelectCamera, onOpenAlert]);

  // Dynamic map tile update on theme toggle
  useEffect(() => {
    if (tileLayerRef.current) {
      const tileUrl =
        theme === 'light'
          ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [theme]);

  // Zoom to camera when selected from outside
  useEffect(() => {
    if (selectedCamera && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedCamera.lat, selectedCamera.lng], 13, {
        duration: 1.0,
      });
    }
  }, [selectedCamera]);

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    if (!mapInstanceRef.current) return;

    if (districtName === 'all') {
      mapInstanceRef.current.flyTo([22.4, 71.6], 7);
    } else {
      const centroid = DISTRICT_CENTROIDS.find((c) => c.district.toLowerCase() === districtName.toLowerCase());
      if (centroid) {
        mapInstanceRef.current.flyTo([centroid.lat, centroid.lng], 11);
      }
    }
  };

  const resetView = () => {
    setSelectedDistrict('all');
    setInternalStatusFilter('all');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.4, 71.6], 7);
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-md bg-[#080D1A]">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 bg-[#0F172A]/95 p-2 rounded border border-slate-700 shadow-lg text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {/* District Selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            aria-label="Filter cameras by district"
            className="bg-[#0B1120] text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">Gujarat State (All {cameras.length} Representative Nodes)</option>
            {DISTRICT_CENTROIDS.map((c) => (
              <option key={c.district} value={c.district.toLowerCase()}>
                {c.district} District ({c.cameraBase} Nodes)
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-[#0B1120] rounded p-0.5 border border-slate-800">
            <Filter className="w-3 h-3 text-slate-500 ml-1" />
            <button
              onClick={() => setInternalStatusFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                internalStatusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setInternalStatusFilter('online')}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                internalStatusFilter === 'online' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setInternalStatusFilter('degraded')}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                internalStatusFilter === 'degraded' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Degraded
            </button>
            <button
              onClick={() => setInternalStatusFilter('offline')}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                internalStatusFilter === 'offline' ? 'bg-red-950 text-red-300 font-bold' : 'text-slate-400 hover:text-red-400'
              }`}
            >
              Offline
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={resetView}
            title="Reset Statewide Gujarat View"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fleet Representation Note */}
        <div className="bg-[#0B1120] border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
          <span className="text-amber-400 font-bold mr-1">Note:</span>
          <span>405 Nodes represented (of 80,000+ fleet)</span>
        </div>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#0F172A]/95 px-3 py-2 rounded border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1 shadow">
        <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
          Representative Node Status
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Online (~96%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Degraded (~3%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Offline (~1%)</span>
          </div>
        </div>
      </div>

      {/* Leaflet container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />
    </div>
  );
};
