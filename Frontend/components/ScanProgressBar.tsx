import React from 'react';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { ModuleExecutionSpeeds } from '../types';

interface ScanProgressBarProps {
  currentStepIndex: number; // 0 to 4
  isScanning: boolean;
  speeds?: ModuleExecutionSpeeds;
}

const MODULE_STEPS = [
  { id: 1, name: 'Module 1: OCR Extraction', short: 'OCR Extraction' },
  { id: 2, name: 'Module 2: Document & Watchlist Validation', short: 'Doc Validation' },
  { id: 3, name: 'Module 3: ELA & CNN Tampering Detection', short: 'ELA Tamper Heatmap' },
  { id: 4, name: 'Module 4: 1:1 Face Verification', short: 'Biometric Face Match' },
];

export const ScanProgressBar: React.FC<ScanProgressBarProps> = ({
  currentStepIndex,
  isScanning,
  speeds,
}) => {
  // If not scanning and never scanned, return subtle baseline
  const getStepSpeed = (index: number) => {
    if (!speeds) return null;
    if (index === 0) return `${speeds.ocrSpeedSec}s`;
    if (index === 1) return `${speeds.validationSpeedSec}s`;
    if (index === 2) return `${speeds.elaSpeedSec}s`;
    if (index === 3) return `${speeds.faceSpeedSec}s`;
    return null;
  };

  return (
    <div className="w-full bg-[#111827] rounded-xl border border-slate-800 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-200">
            Live 4-Module AI Process Tracker
          </h4>
        </div>
        {speeds && (
          <span className="text-xs font-mono text-emerald-400">
            Total Pipeline Latency: <span className="font-bold">{speeds.totalTimeSec}s</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODULE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || (!isScanning && speeds !== undefined);
          const isCurrent = isScanning && idx === currentStepIndex;
          const isPending = !isCompleted && !isCurrent;
          const stepSpeed = getStepSpeed(idx);

          return (
            <div
              key={step.id}
              className={`relative p-3 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                  : isCurrent
                  ? 'bg-blue-950/40 border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                  STEP 0{step.id}
                </span>

                {isCompleted ? (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{stepSpeed || 'DONE'}</span>
                  </div>
                ) : isCurrent ? (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                    <span>RUNNING</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">QUEUED</span>
                )}
              </div>

              <div className="text-xs font-semibold tracking-tight text-white mb-1">
                {step.name}
              </div>

              {/* Step indicator bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCompleted
                      ? 'w-full bg-emerald-400'
                      : isCurrent
                      ? 'w-2/3 bg-cyan-400 animate-pulse'
                      : 'w-0 bg-transparent'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
