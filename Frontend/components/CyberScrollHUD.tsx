import React, { useState, useEffect } from 'react';
import { ArrowUp, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { VerificationResult } from '../types';

interface CyberScrollHUDProps {
  verificationResult: VerificationResult | null;
  isScanning: boolean;
}

export const CyberScrollHUD: React.FC<CyberScrollHUDProps> = ({
  verificationResult,
  isScanning,
}) => {
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [showFloatingDock, setShowFloatingDock] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));
      setShowFloatingDock(scrollTop > 220);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToVerdict = () => {
    const el = document.getElementById('verdict-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Top Cyber Neon Laser Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-slate-900/50 pointer-events-none">
        <div
          className="h-full scroll-progress-line transition-all duration-75 relative"
          style={{ width: `${scrollPercent}%` }}
        >
          {/* Laser Head Spark Particle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 blur-[2px] shadow-[0_0_12px_#06b6d4]" />
        </div>
      </div>

      {/* 2. Floating Cyber HUD Quick-Dock (Appears on Scroll) */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 transition-all duration-300 transform ${
          showFloatingDock
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        {/* Status / Verdict Telemetry Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl shadow-cyan-950/40 text-xs font-mono">
          {isScanning ? (
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>SCREENING IN PROGRESS</span>
            </span>
          ) : verificationResult ? (
            verificationResult.verdict === 'APPROVED' ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CLEARED (RISK: {verificationResult.fraudRiskScore}%)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ALERT: FRAUD ({verificationResult.fraudRiskScore}%)</span>
              </span>
            )
          ) : (
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>LANE 04 • ARMED</span>
            </span>
          )}

          <span className="text-[10px] text-slate-500 border-l border-slate-700 pl-2">
            {Math.round(scrollPercent)}%
          </span>
        </div>

        {/* Jump to Verdict / Analysis Button (If Result is Ready) */}
        {verificationResult && (
          <button
            type="button"
            onClick={scrollToVerdict}
            title="Scroll directly to forensic verdict & AI guidance"
            className="btn-3d btn-3d-primary px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Verdict</span>
          </button>
        )}

        {/* Back to Top 3D Button */}
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll smoothly back to top"
          aria-label="Back to Top"
          className="btn-3d btn-3d-slate p-2.5 rounded-xl text-slate-300 hover:text-white border border-slate-700 shadow-xl cursor-pointer flex items-center justify-center group"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </>
  );
};
