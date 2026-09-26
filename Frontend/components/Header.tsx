import React from 'react';
import { VerifAILogo } from './VerifAILogo';
import { RotateCcw, CheckCircle2, AlertTriangle, FileX } from 'lucide-react';
import { DEMO_PRESETS } from '../data/demoPresets';

interface HeaderProps {
  onSelectPreset: (presetId: string) => void;
  onResetTerminal: () => void;
  activePresetId?: string;
  isBackendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onResetTerminal,
  activePresetId,
  isBackendConnected,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-xl px-4 lg:px-8 py-2.5 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Custom SVG Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <VerifAILogo size="md" showSubtitle={true} />

          {/* Subtitle tag visible on larger screens */}
          <div className="hidden xl:flex flex-col border-l border-slate-800 pl-3 ml-1">
            <span className="text-[12px] font-medium text-slate-300 tracking-wide font-display">
              Frontline Border Security Terminal
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              AI-Based Fake Identity & Document Screening System
            </span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center flex-wrap gap-2.5 justify-end w-full md:w-auto">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800/90 text-[11px] font-mono text-slate-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold tracking-wide">
              {isBackendConnected
                ? 'ONLINE ENGINE CONNECTED'
                : 'OFFLINE EDGE AI ACTIVE (localhost)'}
            </span>
          </div>

          {/* Evaluator Quick-Test 3D Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
            {/* Demo 1: Genuine Passport */}
            <button
              onClick={() => onSelectPreset('demo-1')}
              title={DEMO_PRESETS[0].description}
              className={`btn-3d btn-shine px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activePresetId === 'demo-1'
                  ? 'btn-3d-emerald ring-2 ring-emerald-400 text-white'
                  : 'text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40 hover:text-emerald-300 border border-emerald-900/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo 1: Genuine</span>
            </button>

            {/* Demo 2: Altered Photo & Stamp */}
            <button
              onClick={() => onSelectPreset('demo-2')}
              title={DEMO_PRESETS[1].description}
              className={`btn-3d btn-shine px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activePresetId === 'demo-2'
                  ? 'btn-3d-rose ring-2 ring-rose-400 text-white'
                  : 'text-rose-400 bg-rose-950/20 hover:bg-rose-900/40 hover:text-rose-300 border border-rose-900/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Demo 2: Altered</span>
            </button>

            {/* Demo 3: Modified DOB & Expired */}
            <button
              onClick={() => onSelectPreset('demo-3')}
              title={DEMO_PRESETS[2].description}
              className={`btn-3d btn-shine px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activePresetId === 'demo-3'
                  ? 'btn-3d-amber ring-2 ring-amber-400 text-white'
                  : 'text-amber-400 bg-amber-950/20 hover:bg-amber-900/40 hover:text-amber-300 border border-amber-900/40'
              }`}
            >
              <FileX className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo 3: Expired</span>
            </button>

            {/* Reset Terminal Button */}
            <button
              onClick={onResetTerminal}
              title="Clear all fields and restart checkpoint scanner"
              className="btn-3d btn-3d-slate px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1 ml-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 transition-transform hover:-rotate-45" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
