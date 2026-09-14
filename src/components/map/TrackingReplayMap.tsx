import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TrackingScenario, TrackingWaypoint } from '../../types';
import { Play, Pause, RotateCcw, FastForward, StepForward } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TrackingReplayMapProps {
  scenario: TrackingScenario;
  onWaypointChange?: (waypoint: TrackingWaypoint, index: number) => void;
}

export const TrackingReplayMap: React.FC<TrackingReplayMapProps> = ({
  scenario,
  onWaypointChange,
}) => {
  const { theme } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const targetMarkerRef = useRef<L.Marker | null>(null);
  const waypointMarkersRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 1x, 2x, 4x

  const waypoints = scenario.waypoints;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const firstPt = waypoints[0];
    const map = L.map(mapContainerRef.current, {
      center: [firstPt.lat, firstPt.lng],
      zoom: 9,
      attributionControl: false,
    });

    const tileUrl =
      theme === 'light'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tiles;

    const wpGroup = L.layerGroup().addTo(map);
    waypointMarkersRef.current = wpGroup;
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

  // Dynamic map tile update on theme toggle
  useEffect(() => {
    if (tileLayerRef.current) {
      const tileUrl =
        theme === 'light'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [theme]);

  // Update scenario waypoints & polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const wpGroup = waypointMarkersRef.current;
    if (!map || !wpGroup) return;

    wpGroup.clearLayers();
    if (polylineRef.current) {
      polylineRef.current.remove();
    }
    if (targetMarkerRef.current) {
      targetMarkerRef.current.remove();
    }

    const latLngs: L.LatLngExpression[] = waypoints.map((w) => [w.lat, w.lng]);

    // Directional dotted route line
    const line = L.polyline(latLngs, {
      color: '#3B82F6',
      weight: 3.5,
      dashArray: '8, 8',
      opacity: 0.9,
    }).addTo(map);
    polylineRef.current = line;

    map.fitBounds(line.getBounds(), { padding: [50, 50] });

    // Place waypoint markers
    waypoints.forEach((wp, idx) => {
      const icon = L.divIcon({
        className: 'custom-wp-icon',
        html: `
          <div class="w-6 h-6 rounded bg-[#0F172A] border border-blue-400 text-white text-[12px] font-bold flex items-center justify-center shadow">
            ${idx + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([wp.lat, wp.lng], { icon });
      marker.bindPopup(`
        <div class="text-xs p-1 space-y-1 text-white">
          <div class="font-bold text-white text-sm">Fix #${idx + 1}: ${wp.cameraId}</div>
          <div class="font-bold text-white">${wp.locationName}</div>
          <div class="text-slate-200 text-[11px]">${wp.district} • ${wp.timestamp}</div>
          <div class="text-emerald-300 text-[11px] font-bold">Confidence: ${wp.confidence}%</div>
        </div>
      `);
      wpGroup.addLayer(marker);
    });

    // Create target vehicle marker
    const startWp = waypoints[0];
    const targetIcon = L.divIcon({
      className: 'target-vehicle-icon',
      html: `
        <div class="w-7 h-7 rounded bg-red-600 border border-white flex items-center justify-center shadow-lg text-white font-mono text-[10px] font-bold">
          TRK
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const targetMarker = L.marker([startWp.lat, startWp.lng], { icon: targetIcon, zIndexOffset: 1000 }).addTo(map);
    targetMarkerRef.current = targetMarker;

    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [scenario]);

  // Update target marker position on step change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const target = targetMarkerRef.current;
    const currentWp = waypoints[currentStepIndex];

    if (map && target && currentWp) {
      target.setLatLng([currentWp.lat, currentWp.lng]);
      map.panTo([currentWp.lat, currentWp.lng], { animate: true, duration: 0.8 });

      if (onWaypointChange) {
        onWaypointChange(currentWp, currentStepIndex);
      }
    }
  }, [currentStepIndex, waypoints, onWaypointChange]);

  // Playback timer ticker
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(700, 2200 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= waypoints.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, waypoints.length]);

  const handlePlayPause = () => {
    if (currentStepIndex >= waypoints.length - 1 && !isPlaying) {
      setCurrentStepIndex(0);
    }
    setIsPlaying((p) => !p);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < waypoints.length - 1) {
      setCurrentStepIndex((p) => p + 1);
    }
  };

  const toggleSpeed = () => {
    const nextSpeed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
    setSpeed(nextSpeed);
  };

  const activeWp = waypoints[currentStepIndex];

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-md bg-[#080D1A] flex flex-col">
      {/* Top Playback HUD */}
      <div className="p-3 bg-[#0F172A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-red-950 border border-red-800 px-2.5 py-1 rounded text-xs font-mono text-red-200 font-bold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            <span>{scenario.plateOrId}</span>
          </div>
          <div className="text-xs text-slate-300 hidden md:block">
            <span className="text-slate-500 font-mono">Current Fix:</span>{' '}
            <strong className="text-white">{activeWp.locationName}</strong> ({activeWp.district})
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Reset to origin"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white font-bold'
                : 'bg-blue-600 hover:bg-blue-500 text-white font-bold'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentStepIndex >= waypoints.length - 1 ? 'REPLAY' : 'PLAY'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepNext}
            disabled={currentStepIndex >= waypoints.length - 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            title="Step next waypoint"
          >
            <StepForward className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSpeed}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono text-xs font-semibold flex items-center space-x-1"
            title="Toggle playback speed multiplier"
          >
            <FastForward className="w-3 h-3" />
            <span>{speed}×</span>
          </button>
        </div>
      </div>

      {/* Progress Waypoint Bar */}
      <div className="bg-[#0B1120] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          {waypoints.map((wp, idx) => (
            <button
              key={wp.cameraId}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors ${
                idx === currentStepIndex
                  ? 'bg-blue-600 text-white font-bold'
                  : idx < currentStepIndex
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-[11px]">Fix #{idx + 1}: {wp.district}</span>
            </button>
          ))}
        </div>
        <div className="text-[11px] text-slate-400">
          Timestamp: <strong className="text-white">{activeWp.timestamp}</strong>
        </div>
      </div>

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-[460px] z-10" />
    </div>
  );
};
