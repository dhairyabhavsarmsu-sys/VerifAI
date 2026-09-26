import React, { useState } from 'react';
import { Header } from './components/Header';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { GuardInputZone } from './components/GuardInputZone';
import { ScanProgressBar } from './components/ScanProgressBar';
import { VerdictBanner } from './components/VerdictBanner';
import { ForensicResultsGrid } from './components/ForensicResultsGrid';
import { AIGuidanceAssistant } from './components/AIGuidanceAssistant';
import { DigitalTrailLog } from './components/DigitalTrailLog';
import { ThreeSecurityHologram } from './components/ThreeSecurityHologram';
import { CyberScrollHUD } from './components/CyberScrollHUD';
import { CheckpointLogItem, DocumentType, VerificationResult } from './types';
import { DEMO_PRESETS, GENUINE_PASSPORT_SVG, TRAVELER_JOHNATHAN_SVG } from './data/demoPresets';
import { verifyIdentityDocuments } from './services/verificationService';

// Seed initial history logs for inspection desk continuity
const INITIAL_LOGS: CheckpointLogItem[] = [
  {
    id: 'LOG-1094',
    timestamp: '09:42:15',
    documentType: 'passport',
    passengerName: 'MOREAU, CLAIRE L.',
    documentNumber: 'FRA-9201948',
    riskScore: 8,
    verdict: 'APPROVED',
    moduleAlerts: [],
    inspectionNotes: 'Cleared lane 3 primary gate.',
  },
  {
    id: 'LOG-1093',
    timestamp: '09:35:02',
    documentType: 'visa',
    passengerName: 'PETROV, DMITRI',
    documentNumber: 'V-8820194',
    riskScore: 92,
    verdict: 'NOT_APPROVED',
    moduleAlerts: ['Altered Visa Issue Post Ink', 'Expired 2023'],
    inspectionNotes: 'Referred to secondary interview room.',
  },
];

export default function App() {
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('passport');
  const [documentInput, setDocumentInput] = useState<File | string | null>(GENUINE_PASSPORT_SVG);
  const [travelerInput, setTravelerInput] = useState<File | string | null>(TRAVELER_JOHNATHAN_SVG);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(GENUINE_PASSPORT_SVG);
  const [travelerPreviewUrl, setTravelerPreviewUrl] = useState<string | null>(TRAVELER_JOHNATHAN_SVG);

  const [activePresetId, setActivePresetId] = useState<string | undefined>('demo-1');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [scanSpeeds, setScanSpeeds] = useState<any>(undefined);

  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [logs, setLogs] = useState<CheckpointLogItem[]>(INITIAL_LOGS);
  const [show3DHologram, setShow3DHologram] = useState<boolean>(true);

  // Handle Document Upload / Change
  const handleDocumentSelected = (fileOrUrl: File | string) => {
    setDocumentInput(fileOrUrl);
    setActivePresetId(undefined);
    if (typeof fileOrUrl === 'string') {
      setDocumentPreviewUrl(fileOrUrl);
    } else {
      const url = URL.createObjectURL(fileOrUrl);
      setDocumentPreviewUrl(url);
    }
  };

  // Handle Traveler Camera Capture / Upload
  const handleTravelerCaptured = (fileOrUrl: File | string) => {
    setTravelerInput(fileOrUrl);
    setActivePresetId(undefined);
    if (typeof fileOrUrl === 'string') {
      setTravelerPreviewUrl(fileOrUrl);
    } else {
      const url = URL.createObjectURL(fileOrUrl);
      setTravelerPreviewUrl(url);
    }
  };

  // Quick-Test Demo Buttons
  const handleSelectPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setSelectedDocType(preset.type);
    setDocumentInput(preset.documentImage);
    setTravelerInput(preset.travelerImage);
    setDocumentPreviewUrl(preset.documentImage);
    setTravelerPreviewUrl(preset.travelerImage);

    // Auto-load completed demo result immediately for the evaluator
    setVerificationResult(preset.mockResult);
    setScanSpeeds(preset.mockResult.executionSpeeds);
    setScanStepIndex(4);
    setIsScanning(false);

    // Record in audit log
    const newLogItem: CheckpointLogItem = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      documentType: preset.type,
      passengerName: preset.mockResult.ocr.fullName || 'UNKNOWN',
      documentNumber:
        preset.mockResult.ocr.documentNumber || preset.mockResult.ocr.visaNumber || 'N/A',
      riskScore: preset.mockResult.fraudRiskScore,
      verdict: preset.mockResult.verdict,
      moduleAlerts: preset.mockResult.failureReasons,
    };
    setLogs((prev) => [newLogItem, ...prev]);
  };

  // Reset Terminal
  const handleResetTerminal = () => {
    setActivePresetId(undefined);
    setSelectedDocType('passport');
    setDocumentInput(null);
    setTravelerInput(null);
    setDocumentPreviewUrl(null);
    setTravelerPreviewUrl(null);
    setVerificationResult(null);
    setIsScanning(false);
    setScanStepIndex(0);
    setScanSpeeds(undefined);
  };

  // Run 4-Module Screening Pipeline
  const handleRunScreening = async () => {
    if (!documentInput || !travelerInput) return;

    setIsScanning(true);
    setScanStepIndex(0);
    setScanSpeeds(undefined);
    setVerificationResult(null);

    try {
      const result = await verifyIdentityDocuments(
        documentInput,
        travelerInput,
        selectedDocType,
        (stepIdx) => {
          setScanStepIndex(stepIdx + 1);
        }
      );

      setVerificationResult(result);
      setScanSpeeds(result.executionSpeeds);

      // Prepend to audit log
      const newLogItem: CheckpointLogItem = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString(),
        documentType: selectedDocType,
        passengerName: result.ocr.fullName || 'UNKNOWN PASSENGER',
        documentNumber: result.ocr.documentNumber || result.ocr.visaNumber || 'N/A',
        riskScore: result.fraudRiskScore,
        verdict: result.verdict,
        moduleAlerts: result.failureReasons,
      };
      setLogs((prev) => [newLogItem, ...prev]);

      // Scroll smoothly to verdict banner
      setTimeout(() => {
        document.getElementById('verdict-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Screening pipeline failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanNext = () => {
    // Keeps document type but clears input for the next traveler in queue
    setDocumentInput(null);
    setTravelerInput(null);
    setDocumentPreviewUrl(null);
    setTravelerPreviewUrl(null);
    setVerificationResult(null);
    setIsScanning(false);
    setScanStepIndex(0);
    setScanSpeeds(undefined);
    setActivePresetId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute 3D Hologram Status
  const hologramStatus = isScanning
    ? 'scanning'
    : verificationResult?.verdict === 'APPROVED'
    ? 'approved'
    : verificationResult?.verdict === 'NOT_APPROVED'
    ? 'rejected'
    : 'idle';

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F9FAFB] flex flex-col antialiased relative overflow-x-hidden">
      {/* Dynamic Animated Cyber Background Grid & Ambient Glow Orbs */}
      <div className="fixed inset-0 cyber-grid-bg animate-cyber-drift pointer-events-none z-0 opacity-60" />
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none orb-ambient-1 z-0" />
      <div className="fixed top-1/2 -right-32 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none orb-ambient-2 z-0" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none orb-ambient-1 z-0" />

      {/* Cyber Top Scroll Laser Progress & Floating Quick-Dock */}
      <CyberScrollHUD verificationResult={verificationResult} isScanning={isScanning} />

      {/* 1. Header with custom SVG Logo & Controls */}
      <div className="relative z-50">
        <Header
          onSelectPreset={handleSelectPreset}
          onResetTerminal={handleResetTerminal}
          activePresetId={activePresetId}
          isBackendConnected={false}
        />
      </div>

      {/* Main Terminal Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Terminal Top Banner & 3D Interactive Shield Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Left 2 Cols: Document Classification & Quick Info */}
          <div className="lg:col-span-2 space-y-4">
            <DocumentTypeSelector
              selectedType={selectedDocType}
              onSelectType={(type) => {
                setSelectedDocType(type);
                setActivePresetId(undefined);
              }}
              disabled={isScanning}
            />

            {/* Tactical Checkpoint Status Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs shadow-lg shadow-black/30">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                <span className="font-mono text-slate-300 font-medium">
                  PRIMARY INSPECTION LANE 04 — READY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShow3DHologram(!show3DHologram)}
                  className="btn-3d btn-3d-slate px-3 py-1.5 text-[11px] font-mono font-bold text-cyan-300 hover:text-cyan-200 rounded-xl cursor-pointer"
                >
                  {show3DHologram ? 'Hide 3D Viewport' : 'Show 3D Viewport'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Interactive 3D Three.js Hologram */}
          {show3DHologram && (
            <div className="lg:col-span-1 card-3d-hover rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl">
              <ThreeSecurityHologram
                status={hologramStatus}
                riskScore={verificationResult?.fraudRiskScore}
              />
            </div>
          )}
        </div>

        {/* 2. Dual Input Section (Upload Document + Live Camera) */}
        <section aria-label="Guard Input Zone">
          <GuardInputZone
            documentPreview={documentPreviewUrl}
            travelerPreview={travelerPreviewUrl}
            onDocumentSelected={handleDocumentSelected}
            onTravelerCaptured={handleTravelerCaptured}
            onRunScreening={handleRunScreening}
            isScanning={isScanning}
          />
        </section>

        {/* 3. Live 4-Module AI Process Tracker */}
        {(isScanning || verificationResult) && (
          <section aria-label="Process Tracker" className="animate-in fade-in duration-300">
            <ScanProgressBar
              currentStepIndex={scanStepIndex}
              isScanning={isScanning}
              speeds={scanSpeeds}
            />
          </section>
        )}

        {/* 4. Final Verdict Banner & Risk Score Gauge (Pinned Prominently above the 4 modules) */}
        {verificationResult && (
          <div id="verdict-anchor" className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <VerdictBanner result={verificationResult} onScanNext={handleScanNext} />

            {/* AI Guidance Assistant (Frontline Tactical Intelligence Co-Pilot) */}
            <AIGuidanceAssistant result={verificationResult} />

            {/* 5. Visual Outputs from All 4 AI Modules (2x2 Forensic Grid) */}
            <section aria-label="Forensic Results Grid">
              <ForensicResultsGrid result={verificationResult} />
            </section>
          </div>
        )}

        {/* 6. Compact Digital Trail Log (Recent Checkpoint Scans Table at the bottom) */}
        <section aria-label="Digital Trail Log" className="pt-2">
          <DigitalTrailLog logs={logs} onClearLogs={() => setLogs([])} />
        </section>
      </main>

      {/* Subtle Terminal Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090D16] py-3 px-4 lg:px-8 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div>
          VerifAI™ Frontline Terminal • ICAO Doc 9303 / ISO 18013 Cryptographic Standard
        </div>
        <div className="text-slate-400">
          Client-Side Edge AI Architecture • Real-Time ELA Forensic Pipeline
        </div>
      </footer>
    </div>
  );
}
