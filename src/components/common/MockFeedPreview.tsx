import React, { useState, useEffect } from 'react';
import { Camera, EyeOff } from 'lucide-react';

interface MockFeedPreviewProps {
  cameraId?: string;
  locationName?: string;
  district?: string;
  isOffline?: boolean;
  isDegraded?: boolean;
  boundingBoxLabel?: string;
  aspectRatio?: 'video' | 'square';
}

export const MockFeedPreview: React.FC<MockFeedPreviewProps> = ({
  cameraId = 'CAM-AHM-0182',
  locationName = 'SG Highway',
  district = 'Ahmedabad',
  isOffline = false,
  isDegraded = false,
  boundingBoxLabel,
  aspectRatio = 'video',
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').slice(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full ${
        aspectRatio === 'video' ? 'aspect-video' : 'aspect-[4/3]'
      } bg-[#0A0F1D] rounded-md overflow-hidden border border-slate-700 flex flex-col justify-between p-3 select-none surveillance-grid`}
    >
      {/* Permanent Frame Banner */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-amber-500/50 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded shadow tracking-wider uppercase whitespace-nowrap">
        SIMULATED CAMERA VIEW • NO LIVE VIDEO SOURCE
      </div>

      {/* Top HUD: Camera ID, Jurisdiction, Time */}
      <div className="relative z-10 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOffline ? 'bg-red-500' : isDegraded ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-white font-bold">{cameraId}</span>
          <span className="text-slate-200">• {district}</span>
        </div>

        <div className="text-white font-bold">
          <span>{time} IST</span>
        </div>
      </div>

      {/* Center Simulated Surveillance Frame / Bounding Box */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-2">
        {isOffline ? (
          <div className="text-center text-red-400 space-y-1">
            <EyeOff className="w-8 h-8 mx-auto opacity-80" />
            <div className="text-xs font-bold">SIGNAL LOSS / OFFLINE</div>
            <div className="text-[10px] text-slate-200">Telemetry Timeout ERR_EDGE_DISCONNECTED</div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative border border-slate-800/80 rounded bg-slate-900/40">
            {/* Center target crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-12 h-12 border border-slate-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
              </div>
            </div>

            {/* Bounding box demonstration if label provided */}
            {boundingBoxLabel ? (
              <div className="border border-blue-400 bg-blue-500/10 px-4 py-2.5 rounded shadow-md relative max-w-xs text-center">
                <div className="absolute -top-3.5 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {boundingBoxLabel}
                </div>
                <div className="text-[11px] text-white font-bold mt-1">
                  Target Vector Extracted
                </div>
                <div className="text-[10px] text-slate-200 mt-0.5">
                  Edge Neural Processing
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-200 text-xs space-y-1">
                <Camera className="w-6 h-6 mx-auto opacity-60 text-slate-300" />
                <div className="font-bold text-white">{locationName}</div>
                <div className="text-[11px] text-slate-200">Simulated Edge RTSP Stream Active</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom HUD: Stream Telemetry */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-200 border-t border-slate-800 pt-1 font-normal">
        <div className="flex items-center space-x-3">
          <span>FPS: <strong className="text-white">{isOffline ? '0' : '25.0'}</strong></span>
          <span>CODEC: <strong className="text-white">H.265 Standard</strong></span>
          <span>ENC: <strong className="text-white">Edge ASIC</strong></span>
        </div>
        <div className="text-white font-bold">
          PROPOSAL PROTOTYPE
        </div>
      </div>
    </div>
  );
};
