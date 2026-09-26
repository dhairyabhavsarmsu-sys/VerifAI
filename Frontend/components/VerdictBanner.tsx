import React from 'react';
import { UserPlus, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { VerificationResult } from '../types';

interface VerdictBannerProps {
  result: VerificationResult;
  onScanNext: () => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ result, onScanNext }) => {
  const isApproved = result.verdict === 'APPROVED';
  const riskScore = result.fraudRiskScore;

  // Determine risk category label
  let riskCategory = 'Low Risk (Genuine Document)';
  let riskBadgeColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50';
  if (riskScore > 60) {
    riskCategory = 'Critical Forgery Risk (High Alert)';
    riskBadgeColor = 'text-rose-300 bg-rose-950/80 border-rose-500/50';
  } else if (riskScore > 20) {
    riskCategory = 'Medium Risk (Secondary Inspection)';
    riskBadgeColor = 'text-amber-300 bg-amber-950/80 border-amber-500/50';
  }

  return (
    <div
      className={`card-3d-hover w-full rounded-2xl p-6 transition-all duration-300 shadow-2xl border-2 relative overflow-hidden ${
        isApproved
          ? 'bg-gradient-to-r from-emerald-950/95 via-emerald-900/60 to-slate-950 border-[#10B981] glow-emerald'
          : 'bg-gradient-to-r from-rose-950/95 via-rose-900/60 to-slate-950 border-[#EF4444] glow-crimson'
      }`}
    >
      {/* Background Specular Ambient Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${
        isApproved ? 'bg-emerald-500/10' : 'bg-rose-500/15'
      }`} />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Headline & Status Icon */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3.5 rounded-2xl flex-shrink-0 transition-transform duration-300 hover:scale-105 ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-lg shadow-emerald-950/50'
                : 'bg-rose-500/20 text-rose-400 border border-rose-400/40 shadow-lg shadow-rose-950/50 animate-pulse'
            }`}
          >
            {isApproved ? (
              <ShieldCheck className="w-10 h-10 md:w-12 md:h-12" />
            ) : (
              <ShieldAlert className="w-10 h-10 md:w-12 md:h-12 text-rose-400" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${riskBadgeColor}`}
              >
                {riskCategory}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Verified in {result.executionSpeeds.totalTimeSec}s</span>
              </div>
            </div>

            {/* Giant Headline */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-display tracking-tight text-white drop-shadow-sm">
              {isApproved
                ? '✓ APPROVED — DOCUMENT & TRAVELER CLEARED'
                : '✕ NOT APPROVED (REJECTED) — DETAIN FOR INSPECTION'}
            </h2>

            {/* Summary or Explicit Failure Reasons */}
            {isApproved ? (
              <p className="text-xs md:text-sm text-emerald-200/90 mt-1.5 leading-relaxed font-medium">
                All 4 VerifAI Modules Passed: OCR Extracted • Document Standards Valid • Zero Pixel Tampering • Live Face Matched
              </p>
            ) : (
              <div className="mt-2 text-xs md:text-sm text-rose-200 space-y-1">
                <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  Primary Failure Trigger(s):
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  {result.failureReasons.map((reason, idx) => (
                    <li key={idx} className="font-bold tracking-wide text-rose-100">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Risk Score Meter + 3D Scan Next Passenger Button */}
        <div className="flex sm:flex-row lg:flex-col items-center sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
          {/* Risk Score Gauge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Fraud Risk Score
              </div>
              <div
                className={`text-3xl md:text-4xl font-black font-display ${
                  isApproved ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {riskScore}%
              </div>
            </div>

            {/* Mini Progress Dial */}
            <div className="w-13 h-13 rounded-full border-4 flex items-center justify-center font-mono text-xs font-bold bg-slate-950/80 border-slate-800 relative shadow-inner">
              <svg className="w-full h-full -rotate-90 p-0.5" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isApproved ? 'text-emerald-400' : 'text-rose-500'}
                  strokeDasharray={`${riskScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          {/* Prominent 3D Action Button: Scan Next Passenger */}
          <button
            type="button"
            onClick={onScanNext}
            className="btn-3d btn-shine px-6 py-3 rounded-xl font-bold text-xs md:text-sm tracking-wider uppercase font-display bg-white hover:bg-slate-100 text-slate-950 shadow-[0_4px_0_#94a3b8,0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_0_#94a3b8,0_14px_28px_rgba(0,0,0,0.6)] active:translate-y-1 transition-all flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Scan Next Passenger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
