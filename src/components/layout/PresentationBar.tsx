import React from 'react';
import { MonitorPlay, X, SkipBack, SkipForward, Pause, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PresentationBar: React.FC = () => {
  const {
    isPresentationMode,
    togglePresentationMode,
    currentScreen,
    setCurrentScreen,
  } = useApp();

  if (!isPresentationMode) return null;

  // The 6 requested screens for the executive presentation tour
  const sequence: { id: string; title: string }[] = [
    { id: 'dashboard', title: '1. Command & Control' },
    { id: 'alerts', title: '2. Alert Investigation' },
    { id: 'tracking', title: '3. Cross-District Tracking' },
    { id: 'audit', title: '4. Forensic Audit' },
    { id: 'architecture', title: '5. Architecture' },
    { id: 'about', title: '6. Proposal Roadmap' },
  ];

  const currentIndex = sequence.findIndex((s) => s.id === currentScreen);
  const activeSlideNumber = currentIndex >= 0 ? currentIndex + 1 : 1;
  const activeSlideTitle = currentIndex >= 0 ? sequence[currentIndex].title : 'Tour Navigation';

  const goPrev = () => {
    const prevIdx = currentIndex <= 0 ? sequence.length - 1 : currentIndex - 1;
    setCurrentScreen(sequence[prevIdx].id);
  };

  const goNext = () => {
    const nextIdx = currentIndex === -1 || currentIndex >= sequence.length - 1 ? 0 : currentIndex + 1;
    setCurrentScreen(sequence[nextIdx].id);
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-surface border border-blue-500/80 px-4 py-2 rounded-lg shadow-2xl flex items-center space-x-3 text-xs font-mono text-text">
      <div className="flex items-center space-x-2">
        <MonitorPlay className="w-4 h-4 text-blue-400" />
        <span className="font-bold text-text uppercase text-[11px]">
          Presentation Tour: {activeSlideTitle} ({activeSlideNumber}/6)
        </span>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Manual Step Controls */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={goPrev}
          className="px-2.5 py-1 rounded bg-surface hover:bg-border text-text font-bold flex items-center space-x-1"
          title="Previous slide"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span className="text-[11px]">Prev</span>
        </button>
        <button
          onClick={goNext}
          className="px-2.5 py-1 rounded bg-surface hover:bg-border text-text font-bold flex items-center space-x-1"
          title="Next slide"
        >
          <span className="text-[11px]">Next</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Exit Button */}
      <button
        onClick={togglePresentationMode}
        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-surface hover:bg-border text-text font-bold text-[11px]"
      >
        <X className="w-3.5 h-3.5" />
        <span>Exit Tour</span>
      </button>
    </div>
  );
};
