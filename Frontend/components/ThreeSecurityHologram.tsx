import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Shield, Cpu, RefreshCw } from 'lucide-react';

interface ThreeSecurityHologramProps {
  status: 'idle' | 'scanning' | 'approved' | 'rejected';
  riskScore?: number;
}

export const ThreeSecurityHologram: React.FC<ThreeSecurityHologramProps> = ({
  status,
  riskScore = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'shield' | 'biometric' | 'mesh'>('shield');
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(0x06b6d4, 3, 20);
    primaryLight.position.set(3, 4, 5);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(0x6366f1, 2.5, 20);
    secondaryLight.position.set(-3, -3, 4);
    scene.add(secondaryLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 5, -3);
    scene.add(rimLight);

    // Root Group for interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Build 3D Shield Shape matching the VerifAI logo
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 2.4);
    shieldShape.lineTo(-1.9, 1.6);
    shieldShape.lineTo(-1.9, -0.4);
    shieldShape.quadraticCurveTo(-1.8, -2.1, 0, -2.8);
    shieldShape.quadraticCurveTo(1.8, -2.1, 1.9, -0.4);
    shieldShape.lineTo(1.9, 1.6);
    shieldShape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelSegments: 5,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Shield Material (Metallic with forensic edge shine)
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    rootGroup.add(shieldMesh);

    // Wireframe Overlay on Shield
    const wireframeGeometry = new THREE.WireframeGeometry(shieldGeometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
    });
    const wireframeLines = new THREE.LineSegments(wireframeGeometry, wireframeMat);
    shieldMesh.add(wireframeLines);

    // 3D Inner Checkmark inside shield
    const checkShape = new THREE.Shape();
    checkShape.moveTo(-0.8, 0.0);
    checkShape.lineTo(-0.25, -0.55);
    checkShape.lineTo(0.85, 0.65);
    checkShape.lineTo(0.68, 0.82);
    checkShape.lineTo(-0.25, -0.25);
    checkShape.lineTo(-0.65, 0.15);
    checkShape.closePath();

    const checkGeo = new THREE.ExtrudeGeometry(checkShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    checkGeo.center();

    const checkMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    });
    const checkMesh = new THREE.Mesh(checkGeo, checkMat);
    checkMesh.position.z = 0.28;
    shieldMesh.add(checkMesh);

    // 2. Biometric Reticle Rings (Rotates around shield)
    const reticleGroup = new THREE.Group();
    rootGroup.add(reticleGroup);

    const ringGeo1 = new THREE.RingGeometry(2.9, 2.95, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    reticleGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(3.3, 3.34, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    reticleGroup.add(ring2);

    // 3. Laser Scanning Slice Plane
    const laserGeo = new THREE.PlaneGeometry(5.5, 0.06);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });
    const laserPlane = new THREE.Mesh(laserGeo, laserMat);
    laserPlane.position.z = 0.45;
    rootGroup.add(laserPlane);

    // 4. Background Security Particles
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) {
        // Gentle parallax follow
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = nx * 0.45;
        targetRotationX = ny * 0.35;
      } else {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        targetRotationY += deltaX * 0.015;
        targetRotationX += deltaY * 0.015;
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Status color updates
      if (status === 'approved') {
        primaryLight.color.setHex(0x10b981);
        checkMat.color.setHex(0x10b981);
        checkMat.emissive.setHex(0x059669);
        wireframeMat.color.setHex(0x34d399);
        laserMat.color.setHex(0x10b981);
      } else if (status === 'rejected') {
        primaryLight.color.setHex(0xef4444);
        checkMat.color.setHex(0xef4444);
        checkMat.emissive.setHex(0x991b1b);
        wireframeMat.color.setHex(0xf87171);
        laserMat.color.setHex(0xef4444);
      } else if (status === 'scanning') {
        primaryLight.color.setHex(0x06b6d4);
        checkMat.color.setHex(0x06b6d4);
        checkMat.emissive.setHex(0x0284c7);
        wireframeMat.color.setHex(0x38bdf8);
        laserMat.color.setHex(0x38bdf8);
      } else {
        primaryLight.color.setHex(0x06b6d4);
        checkMat.color.setHex(0x60a5fa);
        checkMat.emissive.setHex(0x2563eb);
        wireframeMat.color.setHex(0x06b6d4);
        laserMat.color.setHex(0x06b6d4);
      }

      // Smooth interpolation for rotation
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.08;

      // Gentle idle sway if user is not actively dragging
      if (!isMouseDown) {
        rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
        reticleGroup.rotation.z = elapsedTime * 0.3;
      }

      // Laser Scanner Motion
      if (status === 'scanning') {
        laserPlane.visible = true;
        laserPlane.position.y = Math.sin(elapsedTime * 6) * 2.2;
        laserMat.opacity = 0.8 + Math.sin(elapsedTime * 12) * 0.2;
      } else if (status === 'idle') {
        laserPlane.visible = true;
        laserPlane.position.y = Math.sin(elapsedTime * 2) * 2.0;
        laserMat.opacity = 0.45;
      } else {
        laserPlane.visible = false;
      }

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      shieldGeometry.dispose();
      shieldMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMat.dispose();
      checkGeo.dispose();
      checkMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      laserGeo.dispose();
      laserMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [status, viewMode]);

  return (
    <div className="relative w-full h-[260px] bg-gradient-to-b from-[#0d1424] to-[#090d16] rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl group">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Top HUD overlay */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'approved'
                ? 'bg-emerald-400 animate-ping'
                : status === 'rejected'
                ? 'bg-rose-500 animate-ping'
                : status === 'scanning'
                ? 'bg-cyan-400 animate-ping'
                : 'bg-blue-400'
            }`}
          />
          <span className="text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider">
            3D FORENSIC SHIELD HUD
          </span>
        </div>

        <div className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
          DRAG TO TILT 3D
        </div>
      </div>

      {/* Bottom Mode Switcher */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('shield')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'shield'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3" />
            Shield
          </button>
          <button
            onClick={() => setViewMode('biometric')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'biometric'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            Reticle
          </button>
          <button
            onClick={() => setViewMode('mesh')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'mesh'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3 h-3" />
            Mesh
          </button>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400">WebGL 2.0 Edge Engine</div>
          <div className="text-[11px] font-mono-nums font-semibold text-cyan-400">
            {status === 'approved'
              ? 'CLEARED [0.62s]'
              : status === 'rejected'
              ? `FORGERY RISK: ${riskScore}%`
              : status === 'scanning'
              ? 'SCANNING 4 MODULES...'
              : 'READY FOR PASSENGER'}
          </div>
        </div>
      </div>
    </div>
  );
};
