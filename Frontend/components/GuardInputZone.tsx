import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Zap,
  Video,
  SwitchCamera,
  X,
  ScanLine,
} from 'lucide-react';

interface GuardInputZoneProps {
  documentPreview: string | null;
  travelerPreview: string | null;
  onDocumentSelected: (fileOrUrl: File | string) => void;
  onTravelerCaptured: (fileOrUrl: File | string) => void;
  onRunScreening: () => void;
  isScanning: boolean;
  disabled?: boolean;
}

export const GuardInputZone: React.FC<GuardInputZoneProps> = ({
  documentPreview,
  travelerPreview,
  onDocumentSelected,
  onTravelerCaptured,
  onRunScreening,
  isScanning,
  disabled = false,
}) => {
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active camera state: null, 'traveler', or 'document'
  const [activeCameraTarget, setActiveCameraTarget] = useState<'traveler' | 'document' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Enumerate cameras
  const refreshCameraDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      setAvailableCameras(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (e) {
      console.warn('Could not enumerate video devices:', e);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    refreshCameraDevices();
  }, [refreshCameraDevices]);

  // Synchronize mediaStream to the video element whenever mounted or stream updates
  const attachStreamToVideo = useCallback((video: HTMLVideoElement | null, stream: MediaStream | null) => {
    if (!video) return;
    if (stream) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.warn('Webcam playback error or policy restriction:', err);
        });
      };
      // In case metadata is already loaded
      video.play().catch(() => {});
    } else {
      video.srcObject = null;
    }
  }, []);

  // Update video element on state changes
  useEffect(() => {
    if (activeCameraTarget && videoRef.current && mediaStream) {
      attachStreamToVideo(videoRef.current, mediaStream);
    }
  }, [activeCameraTarget, mediaStream, attachStreamToVideo]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActiveCameraTarget(null);
    setIsCameraLoading(false);
    setCameraError(null);
  }, [mediaStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mediaStream]);

  // Resilient multi-tier camera acquisition
  const startCamera = async (target: 'traveler' | 'document', specificDeviceId?: string) => {
    setCameraError(null);
    setIsCameraLoading(true);
    setActiveCameraTarget(target);

    // Context check for browser permissions
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isHttp =
        window.location.protocol === 'http:' &&
        !['localhost', '127.0.0.1'].includes(window.location.hostname);
      setCameraError(
        isHttp
          ? 'Browser security restricts webcam access over network HTTP. Please access this app via http://localhost:3000 or HTTPS.'
          : 'Webcam API is not supported in this browser. Please use Chrome, Edge, or Firefox, or use the "Upload Photo" button.'
      );
      setIsCameraLoading(false);
      setActiveCameraTarget(null);
      return;
    }

    // Stop current stream if running
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
      setMediaStream(null);
    }

    const deviceIdToUse = specificDeviceId || selectedDeviceId;

    // Constraint ladder: progressively fallback if specific hardware constraints fail
    const constraintLadder: MediaStreamConstraints[] = [];

    if (deviceIdToUse) {
      constraintLadder.push({
        video: {
          deviceId: { exact: deviceIdToUse },
          width: { ideal: target === 'document' ? 1920 : 1280 },
          height: { ideal: target === 'document' ? 1080 : 720 },
        },
        audio: false,
      });
      constraintLadder.push({
        video: { deviceId: { exact: deviceIdToUse } },
        audio: false,
      });
    }

    // Target facing mode
    constraintLadder.push({
      video: {
        facingMode: target === 'traveler' ? 'user' : { ideal: 'environment' },
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
      },
      audio: false,
    });

    // Relaxed facing mode without resolution restrictions
    constraintLadder.push({
      video: {
        facingMode: target === 'traveler' ? 'user' : 'environment',
      },
      audio: false,
    });

    // Ultimate fallback: simple { video: true }
    constraintLadder.push({
      video: true,
      audio: false,
    });

    let obtainedStream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraints of constraintLadder) {
      try {
        obtainedStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (obtainedStream) break;
      } catch (err: any) {
        lastError = err;
        console.warn('Camera constraints attempt failed, trying next level:', constraints, err);
      }
    }

    if (obtainedStream) {
      setMediaStream(obtainedStream);
      setIsCameraLoading(false);

      // Immediately connect to video element if it's already rendered
      if (videoRef.current) {
        attachStreamToVideo(videoRef.current, obtainedStream);
      }

      // Refresh camera devices list with actual device labels now that permission is active
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableCameras(videoInputs);
        const activeTrack = obtainedStream.getVideoTracks()[0];
        const activeSettings = activeTrack?.getSettings?.();
        if (activeSettings?.deviceId) {
          setSelectedDeviceId(activeSettings.deviceId);
        }
      } catch (e) {
        console.warn('Could not enumerate video devices after stream started:', e);
      }
    } else {
      console.error('All webcam connection attempts failed:', lastError);
      let errorMsg = 'Could not access webcam.';
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        errorMsg =
          'Camera permission denied. Please click the camera icon in your browser address bar to allow webcam access, then try again.';
      } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device found on this system. Please connect a webcam or use file upload.';
      } else if (lastError?.name === 'NotReadableError' || lastError?.name === 'TrackStartError') {
        errorMsg =
          'Webcam is locked by another program (Zoom, Teams, etc.). Please close other applications using the camera and retry.';
      } else if (lastError?.name === 'OverconstrainedError') {
        errorMsg = 'Camera does not support requested resolution.';
      } else if (lastError?.message) {
        errorMsg = `Camera error: ${lastError.message}`;
      }

      setCameraError(errorMsg);
      setIsCameraLoading(false);
      setActiveCameraTarget(null);
    }
  };

  // Switch to next available camera if multiple webcams exist
  const handleSwitchCamera = async () => {
    if (availableCameras.length <= 1 || !activeCameraTarget) return;
    const currentIndex = availableCameras.findIndex((c) => c.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextDevice = availableCameras[nextIndex];
    if (nextDevice) {
      setSelectedDeviceId(nextDevice.deviceId);
      await startCamera(activeCameraTarget, nextDevice.deviceId);
    }
  };

  // Capture photo from video feed
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (activeCameraTarget === 'traveler') {
      // Mirror flip for traveler selfie so it matches preview
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onTravelerCaptured(dataUrl);
    } else if (activeCameraTarget === 'document') {
      // Normal orientation for document scan so text is readable
      ctx.drawImage(video, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onDocumentSelected(dataUrl);
    }

    stopCamera();
  };

  // File Handlers
  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDocumentSelected(e.target.files[0]);
    }
  };

  const handleFaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onTravelerCaptured(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDocumentSelected(e.dataTransfer.files[0]);
    }
  };

  const canRunScreening = !!documentPreview && !!travelerPreview && !isScanning;

  return (
    <div className="w-full space-y-4">
      {/* 2-Column Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ============================================================== */}
        {/* Column 1: Upload or Scan Travel Document Image                */}
        {/* ============================================================== */}
        <div className="card-3d-hover bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 flex flex-col justify-between relative shadow-xl hover:border-cyan-500/40">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide font-display">
                  1. Travel Document Image
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                PASSPORT / VISA / ID
              </span>
            </div>

            {/* Document Zone Content */}
            {activeCameraTarget === 'document' ? (
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/60 bg-black min-h-[220px] flex items-center justify-center shadow-inner">
                {/* Live Video Feed */}
                <video
                  ref={(el) => {
                    videoRef.current = el;
                    if (el && mediaStream && el.srcObject !== mediaStream) {
                      attachStreamToVideo(el, mediaStream);
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[220px] object-contain bg-black"
                />

                {/* Loading Spinner */}
                {isCameraLoading && (
                  <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center z-20">
                    <RefreshCw className="w-7 h-7 animate-spin text-cyan-400 mb-2" />
                    <span className="text-xs font-mono text-cyan-300">Connecting to webcam...</span>
                  </div>
                )}

                {/* Document Alignment Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                  <div className="w-[85%] h-[82%] border-2 border-dashed border-cyan-400/80 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] relative flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
                      <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300/90 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        Align Passport / ID in Frame
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
                      <div className="w-3 h-3 border-b-2 border-r-2 border-cyan-300" />
                    </div>
                  </div>
                </div>

                {/* Controls Bar Overlay */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-2 z-10 px-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isCameraLoading}
                    className="btn-3d btn-3d-emerald btn-shine px-4 py-2 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Document
                  </button>

                  {availableCameras.length > 1 && (
                    <button
                      type="button"
                      onClick={handleSwitchCamera}
                      title="Switch Camera Device"
                      className="btn-3d btn-3d-slate p-2 text-cyan-300 text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="btn-3d btn-3d-slate px-3 py-2 text-slate-300 text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : documentPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950 flex flex-col items-center justify-center min-h-[220px] group">
                <img
                  src={documentPreview}
                  alt="Document Preview"
                  className="max-h-[220px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />

                {/* Sweeping Laser Scan Animation when scanning */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-laser absolute" />
                    <div className="absolute inset-0 bg-cyan-500/10 backdrop-brightness-110" />
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Loaded
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => docFileInputRef.current?.click()}
                    disabled={isScanning}
                    className="btn-3d btn-3d-slate px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Change Image
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera('document')}
                    disabled={isScanning}
                    className="btn-3d btn-3d-primary btn-shine px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    Rescan with Webcam
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center min-h-[220px] transition-all text-center ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-800/90 flex items-center justify-center mb-3 text-cyan-400 shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200 mb-1">
                  Upload or scan travel document
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Supports High-Res JPG, PNG, WEBP scans or live webcam
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => docFileInputRef.current?.click()}
                    className="btn-3d btn-3d-primary btn-shine px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Select Image File
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera('document')}
                    className="btn-3d btn-3d-slate btn-shine px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    Scan with Webcam
                  </button>
                </div>
              </div>
            )}

            <input
              ref={docFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleDocFileChange}
            />
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2.5">
            <span>Automatic MRZ & OCR zone detection</span>
            <span className="font-mono text-cyan-400">ICAO 9303 Compliant</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Column 2: Live Built-In Device Camera Capture (Webcam)        */}
        {/* ============================================================== */}
        <div className="card-3d-hover bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 flex flex-col justify-between relative shadow-xl hover:border-cyan-500/40">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide font-display">
                  2. Live Traveler Biometrics
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                LAPTOP WEBCAM / FACIAL 1:1
              </span>
            </div>

            {/* Video Viewport or Captured Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 min-h-[220px] flex items-center justify-center shadow-inner">
              {activeCameraTarget === 'traveler' ? (
                <div className="relative w-full h-[220px] flex items-center justify-center bg-black">
                  {/* Mirrored Live Video Feed for natural selfie view */}
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (el && mediaStream && el.srcObject !== mediaStream) {
                        attachStreamToVideo(el, mediaStream);
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    style={{ transform: 'scaleX(-1)' }}
                    className="w-full h-full object-cover"
                  />

                  {/* Loading Spinner */}
                  {isCameraLoading && (
                    <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center z-20">
                      <RefreshCw className="w-7 h-7 animate-spin text-cyan-400 mb-2" />
                      <span className="text-xs font-mono text-cyan-300">Connecting to webcam...</span>
                    </div>
                  )}

                  {/* Centered Facial Alignment Guide Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-44 border-2 border-dashed border-cyan-400/80 rounded-[50%] shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                  </div>

                  {/* Capture Button Overlay */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-2 z-10 px-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={isCameraLoading}
                      className="btn-3d btn-3d-emerald btn-shine px-4 py-2 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                      Capture Traveler Photo
                    </button>

                    {availableCameras.length > 1 && (
                      <button
                        type="button"
                        onClick={handleSwitchCamera}
                        title="Switch Camera Device"
                        className="btn-3d btn-3d-slate p-2 text-cyan-300 text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={stopCamera}
                      className="btn-3d btn-3d-slate px-3 py-2 text-slate-300 text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : travelerPreview ? (
                <div className="relative w-full h-[220px] flex flex-col items-center justify-center bg-slate-950 group">
                  <img
                    src={travelerPreview}
                    alt="Traveler Capture"
                    className="max-h-[220px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Sweeping Laser Scan Animation when scanning */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-laser absolute" />
                      <div className="absolute inset-0 bg-cyan-500/10 backdrop-brightness-110" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Biometrics Captured
                  </div>

                  <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera('traveler')}
                      disabled={isScanning}
                      className="btn-3d btn-3d-primary btn-shine px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retake with Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => faceFileInputRef.current?.click()}
                      disabled={isScanning}
                      className="btn-3d btn-3d-slate px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      Upload File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800/90 flex items-center justify-center mb-3 text-cyan-400 shadow-md">
                    <Video className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mb-1">
                    Live Checkpoint Face Verification
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Uses built-in laptop camera for 128-d biometric facial match
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => startCamera('traveler')}
                      className="btn-3d btn-3d-primary btn-shine px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Start Web Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => faceFileInputRef.current?.click()}
                      className="btn-3d btn-3d-slate btn-shine px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      Or Upload Face Photo
                    </button>
                  </div>

                  {cameraError && (
                    <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-900/70 rounded-xl text-[11px] text-rose-300 flex items-start gap-2 text-left shadow-lg">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-rose-200 mb-0.5">Camera Access Note:</div>
                        <div>{cameraError}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <input
              ref={faceFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFaceFileChange}
            />
            {/* Hidden canvas for video frame capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Passive Liveness & Anti-Spoof</span>
            <span className="font-mono text-cyan-400">1:1 Biometric Match</span>
          </div>
        </div>
      </div>

      {/* Main Action Button (Centered below the 2 columns) */}
      <div className="flex flex-col items-center pt-2">
        <button
          type="button"
          disabled={!canRunScreening}
          onClick={onRunScreening}
          className={`w-full max-w-xl py-4 px-8 rounded-2xl text-base md:text-lg font-bold tracking-widest font-display uppercase transition-all duration-200 flex items-center justify-center gap-3 select-none ${
            canRunScreening
              ? 'btn-3d btn-3d-primary btn-shine ring-2 ring-cyan-400/80 cursor-pointer'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed transform-none shadow-none'
          }`}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-200" />
              <span className="tracking-wider">EXECUTING VerifAI 4-MODULE FORENSIC PIPELINE...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-cyan-200 transition-transform group-hover:scale-125" />
              <span>RUN VerifAI 4-MODULE SCREENING</span>
            </>
          )}
        </button>

        {!canRunScreening && !isScanning && (
          <p className="text-[11px] font-mono text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Please load both Document Photo (Col 1) and Traveler Face (Col 2), or pick a Demo button above.
          </p>
        )}
      </div>
    </div>
  );
};
