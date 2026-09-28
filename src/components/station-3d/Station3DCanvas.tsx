import React, { useRef, useState, useEffect, Suspense, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { StationTerrain } from './StationTerrain';
import { MaitriStationMesh } from './MaitriStationMesh';
import { BharatiStationMesh } from './BharatiStationMesh';
import { Station3DOverlays } from './Station3DOverlays';
import { EquipmentComponent } from '../../types';

export type CameraPresetType = 'overall' | 'front' | 'side' | 'top' | 'cutaway' | 'reset';

export interface Station3DCanvasRef {
  setCameraPreset: (preset: CameraPresetType) => void;
  resetCamera: () => void;
}

interface Station3DCanvasProps {
  isMaitri: boolean;
  components: EquipmentComponent[];
  selectedId: string | null;
  onSelectComponent: (comp: EquipmentComponent) => void;
  multiPhysicsState?: any;
  showLabels?: boolean;
  showEnergy?: boolean;
  showLogistics?: boolean;
  showEnvironment?: boolean;
  showComms?: boolean;
  isolatedSystem?: string | null;
  showFaultImpact?: boolean;
}

// Preset camera configurations matching cinematic specifications
const CAMERA_PRESETS: Record<CameraPresetType, { pos: [number, number, number]; target: [number, number, number] }> = {
  overall: { pos: [55, 38, 55], target: [0, 5, 0] },
  front:   { pos: [0, 20, 80],  target: [0, 5, 0] },
  side:    { pos: [80, 20, 0],  target: [0, 5, 0] },
  top:     { pos: [0, 90, 0.1], target: [0, 0, 0] },
  cutaway: { pos: [40, 25, 40], target: [0, 5, 0] },
  reset:   { pos: [55, 38, 55], target: [0, 5, 0] }
};

// Camera Animator with exponential lerp tween over ~600ms
const CameraAnimator: React.FC<{
  targetCam: { pos: [number, number, number]; target: [number, number, number] } | null;
  onAnimationComplete: () => void;
  controlsRef: React.RefObject<any>;
}> = ({ targetCam, onAnimationComplete, controlsRef }) => {
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    if (targetCam) {
      targetPos.current.set(...targetCam.pos);
      targetLookAt.current.set(...targetCam.target);
      animatingRef.current = true;
    }
  }, [targetCam]);

  useFrame((_, delta) => {
    if (!animatingRef.current) return;

    // Smooth exponential damping factor (approx 600 ms duration)
    const alpha = Math.min(1.0, delta * 5.0);
    camera.position.lerp(targetPos.current, alpha);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, alpha);
      controlsRef.current.update();
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.15 &&
      (!controlsRef.current || controlsRef.current.target.distanceTo(targetLookAt.current) < 0.15)
    ) {
      animatingRef.current = false;
      onAnimationComplete();
    }
  });

  return null;
};

// Scene Content Component
const SceneContent: React.FC<{
  isMaitri: boolean;
  components: EquipmentComponent[];
  selectedId: string | null;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onSelectComponent: (comp: EquipmentComponent) => void;
  multiPhysicsState?: any;
  showLabels: boolean;
  showEnergy: boolean;
  showLogistics: boolean;
  showEnvironment: boolean;
  showComms: boolean;
  isolatedSystem: string | null;
  showFaultImpact: boolean;
  controlsRef: React.RefObject<any>;
  targetCam: { pos: [number, number, number]; target: [number, number, number] } | null;
  onAnimationComplete: () => void;
}> = ({
  isMaitri,
  components,
  selectedId,
  hoveredId,
  setHoveredId,
  onSelectComponent,
  multiPhysicsState,
  showLabels,
  showEnergy,
  showLogistics,
  showEnvironment,
  showComms,
  isolatedSystem,
  showFaultImpact,
  controlsRef,
  targetCam,
  onAnimationComplete
}) => {
  return (
    <>
      {/* 1. HDRI Environment Map for realistic metallic and snow reflections */}
      <Environment preset="city" background={false} />

      {/* 2. Directional Sun Light with High-Resolution Soft Shadows */}
      <directionalLight
        position={[40, 60, 20]}
        intensity={2.2}
        color="#FFF9EE"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={180}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
      />

      {/* 3. Hemisphere Light for Snow Surface Bounce */}
      <hemisphereLight
        args={['#BCD8F0', '#FFFFFF', 0.6]}
      />

      {/* 4. Subtle Ambient Base Light */}
      <ambientLight intensity={0.35} color="#D8E8F5" />

      {/* 5. Contact Shadows on the Snow Surface */}
      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.65}
        scale={85}
        blur={2.0}
        far={12}
      />

      {/* Camera Controller & Smooth OrbitControls */}
      <CameraAnimator
        targetCam={targetCam}
        onAnimationComplete={onAnimationComplete}
        controlsRef={controlsRef}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={18}
        maxDistance={140}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 5, 0]}
        enablePan
        enableZoom
      />

      {/* Photorealistic Sculpted Terrain */}
      <StationTerrain isMaitri={isMaitri} />

      {/* Station Modules Architecture */}
      {isMaitri ? (
        <MaitriStationMesh
          components={components}
          selectedId={selectedId}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onSelectComponent={onSelectComponent}
          multiPhysicsState={multiPhysicsState}
          showLabels={showLabels}
          isolatedSystem={isolatedSystem}
          showFaultImpact={showFaultImpact}
        />
      ) : (
        <BharatiStationMesh
          components={components}
          selectedId={selectedId}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onSelectComponent={onSelectComponent}
          multiPhysicsState={multiPhysicsState}
          showLabels={showLabels}
          isolatedSystem={isolatedSystem}
          showFaultImpact={showFaultImpact}
        />
      )}

      {/* 3D Overlays (Energy arcs, Comms beam, Logistics, Snow & Wind) */}
      <Station3DOverlays
        showEnergy={showEnergy}
        showLogistics={showLogistics}
        showEnvironment={showEnvironment}
        showComms={showComms}
        windSpeedKmh={multiPhysicsState?.ambient?.wind_speed_kmh}
      />

      {/* Postprocessing Stack: ACESFilmic ToneMapping + Subtle Vignette */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Vignette offset={0.18} darkness={0.52} eskil={false} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
};

export const Station3DCanvas = forwardRef<Station3DCanvasRef, Station3DCanvasProps>(({
  isMaitri,
  components,
  selectedId,
  onSelectComponent,
  multiPhysicsState,
  showLabels = false,
  showEnergy = false,
  showLogistics = false,
  showEnvironment = false,
  showComms = false,
  isolatedSystem = null,
  showFaultImpact = false
}, ref) => {
  const controlsRef = useRef<any>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [targetCam, setTargetCam] = useState<{ pos: [number, number, number]; target: [number, number, number] } | null>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }

    const handleVisibility = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useImperativeHandle(ref, () => ({
    setCameraPreset: (preset: CameraPresetType) => {
      setTargetCam(CAMERA_PRESETS[preset]);
    },
    resetCamera: () => {
      setTargetCam(CAMERA_PRESETS.reset);
    }
  }));

  if (!webGLSupported) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-[#1E293B] to-[#0F172A] flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] font-mono text-[12px]">
        <div className="text-[14px] text-white font-medium mb-1">Station 3D Scene Unavailable</div>
        <div>Hardware accelerated WebGL is not supported on this device.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 35, near: 0.5, far: 500, position: [55, 38, 55] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05
        }}
        frameloop={isVisible ? 'always' : 'never'}
        className="w-full h-full"
      >
        <color attach="background" args={['#9BBED8']} />
        <fogExp2 attach="fog" args={['#9BBED8', 0.0045]} />

        <Suspense fallback={null}>
          <SceneContent
            isMaitri={isMaitri}
            components={components}
            selectedId={selectedId}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onSelectComponent={onSelectComponent}
            multiPhysicsState={multiPhysicsState}
            showLabels={showLabels}
            showEnergy={showEnergy}
            showLogistics={showLogistics}
            showEnvironment={showEnvironment}
            showComms={showComms}
            isolatedSystem={isolatedSystem}
            showFaultImpact={showFaultImpact}
            controlsRef={controlsRef}
            targetCam={targetCam}
            onAnimationComplete={() => setTargetCam(null)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

Station3DCanvas.displayName = 'Station3DCanvas';
