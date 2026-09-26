import React, { useEffect, useState } from 'react';
import { VerificationResult } from '../types';
import { generateGuardGuidance, GuardAIFeedback } from '../services/geminiService';
import { Bot, ShieldAlert, Sparkles, CheckCircle, ChevronDown, ChevronUp, Copy, Printer, HelpCircle } from 'lucide-react';

interface AIGuidanceAssistantProps {
  result: VerificationResult;
}

export const AIGuidanceAssistant: React.FC<AIGuidanceAssistantProps> = ({ result }) => {
  const [feedback, setFeedback] = useState<GuardAIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    generateGuardGuidance(result)
      .then((data) => {
        if (isMounted) {
          setFeedback(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error generating AI guidance:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [result]);

  const handleCopyReport = () => {
    if (!feedback) return;
    const text = `VerifAI TACTICAL INSPECTION REPORT
Verdict: ${result.verdict}
Risk Score: ${result.fraudRiskScore}%
Recommended Action: ${feedback.recommendedAction}
Summary: ${feedback.guidanceSummary}
Protocol Steps:
${feedback.protocolSteps.join('\n')}
Targeted Questions:
${feedback.interrogationQuestions.join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#111827] rounded-xl border border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-cyan-400 animate-pulse">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">
              AI Border Intelligence Co-Pilot
            </div>
            <div className="text-[11px] text-slate-400">
              Synthesizing 4-module forensic data and generating guard guidance...
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>ANALYZING</span>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  const isHighThreat = feedback.threatLevel === 'HIGH';

  return (
    <div
      className={`card-3d-hover w-full rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden ${
        isHighThreat
          ? 'bg-gradient-to-r from-[#170e14] via-[#111827] to-[#0d1527] border-rose-800/80 hover:border-rose-500/60'
          : 'bg-[#111827]/90 backdrop-blur-md border-slate-800 hover:border-cyan-500/50'
      }`}
    >
      {/* Header bar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isHighThreat
                ? 'bg-rose-500/20 text-rose-400 border-rose-400/40 shadow-md shadow-rose-950/40'
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40 shadow-md shadow-cyan-950/40'
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide font-display">
                VerifAI Intelligence Co-Pilot
              </h3>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  isHighThreat
                    ? 'text-rose-300 bg-rose-950/80 border-rose-800'
                    : 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                }`}
              >
                {feedback.threatLevel} THREAT LEVEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous Frontline Standard Operating Procedure (SOP) Guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="btn-3d btn-3d-slate px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-3d btn-3d-slate px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Docket</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-3d btn-3d-slate p-2 rounded-xl text-slate-300 hover:text-white cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          {/* Action Directive Callout */}
          <div
            className={`p-3 rounded-lg border font-mono ${
              isHighThreat
                ? 'bg-rose-950/50 border-rose-700/80 text-rose-200'
                : 'bg-emerald-950/50 border-emerald-700/80 text-emerald-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
              PRIMARY GUARD DIRECTIVE:
            </div>
            <div className="text-sm font-bold tracking-wide">
              {feedback.recommendedAction}
            </div>
          </div>

          {/* AI Forensic Summary */}
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
              Incident Context & Anomaly Breakdown
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {feedback.guidanceSummary}
            </p>
          </div>

          {/* 2 Columns: Protocols & Interrogation Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Step-by-Step SOP Protocols */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] font-mono font-semibold uppercase text-cyan-400 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Required Officer Protocols
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11.5px]">
                {feedback.protocolSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Targeted Interrogation Questions */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] font-mono font-semibold uppercase text-amber-400 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Interrogation Verifications
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11.5px]">
                {feedback.interrogationQuestions.map((q, idx) => (
                  <li key={idx} className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80 text-slate-200 italic">
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
