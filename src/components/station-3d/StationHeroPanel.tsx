import React, { useState, useRef, Suspense } from 'react';
import { useStation } from '../../context/StationContext';
import { Station3DCanvas, Station3DCanvasRef, CameraPresetType } from './Station3DCanvas';
import { StationTopDownMap } from './StationTopDownMap';
import { ComponentInspector } from '../digital-twin/ComponentInspector';
import { EquipmentComponent } from '../../types';
import { 
  Building2, 
  Zap, 
  Package, 
  Wind, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Layers,
  MapPin,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StationHeroPanel: React.FC = () => {
  const { 
    station, 
    stationData, 
    components, 
    selectedComponent, 
    selectedComponentId, 
    setSelectedComponentId,
    multiPhysicsState
  } = useStation();

  const isMaitri = station === 'MAITRI';
  const canvasRef = useRef<Station3DCanvasRef>(null);

  // View state: '3d' or 'map'
  const [viewMode, setViewMode] = useState<'3d' | 'map'>('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState<CameraPresetType>('overall');

  // Layer toggles
  const [showInfrastructure, setShowInfrastructure] = useState(false);
  const [showEnergy, setShowEnergy] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showEnvironment, setShowEnvironment] = useState(false);

  // Inspector slide-out drawer state
  const [showInspectorDrawer, setShowInspectorDrawer] = useState(false);

  const handleSelectComponent = (comp: EquipmentComponent) => {
    setSelectedComponentId(comp.id);
    setShowInspectorDrawer(true);
  };

  const handleCloseInspector = () => {
    setSelectedComponentId(null);
    setShowInspectorDrawer(false);
  };

  const handlePresetClick = (preset: CameraPresetType) => {
    setActivePreset(preset);
    if (preset === 'reset') {
      canvasRef.current?.resetCamera();
    } else {
      canvasRef.current?.setCameraPreset(preset);
    }
  };

  return (
    <div className={`overflow-hidden transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-[#0F172A] p-4 flex flex-col' 
        : 'card-polar rounded-[14px]'
    }`}>
      {/* 3D / MAP VIEWPORT CONTAINER */}
      <div className={`w-full relative overflow-hidden rounded-[14px] bg-[#0A101D] ${
        isFullscreen 
          ? 'flex-1 h-full' 
          : 'h-[360px] sm:h-[400px] lg:h-[450px] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]'
      }`}>
        {/* Loading Placeholder */}
        <Suspense fallback={
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B132B] text-slate-300 font-mono text-[13px] gap-2">
            <div className="w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
            <span>Loading 3D station scene…</span>
          </div>
        }>
          {viewMode === '3d' ? (
            <Station3DCanvas
              ref={canvasRef}
              isMaitri={isMaitri}
              components={components}
              selectedId={selectedComponentId}
              onSelectComponent={handleSelectComponent}
              multiPhysicsState={multiPhysicsState}
              showLabels={showInfrastructure}
              showEnergy={showEnergy}
              showLogistics={showLogistics}
              showEnvironment={showEnvironment}
              showComms={false}
            />
          ) : (
            <StationTopDownMap
              isMaitri={isMaitri}
              components={components}
              selectedId={selectedComponentId}
              onSelectComponent={handleSelectComponent}
              showLabels={showInfrastructure}
            />
          )}
        </Suspense>

        {/* Top Dark Gradient for Overlay Readability */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none z-10" />

        {/* Bottom Dark Gradient for Overlay Readability */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/65 via-black/30 to-transparent pointer-events-none z-10" />

        {/* ============================================================== */}
        {/* TOP-LEFT OVERLAY                                               */}
        {/* ============================================================== */}
        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <h1 className="text-white text-[20px] sm:text-[22px] font-semibold tracking-tight drop-shadow-sm">
              {stationData.name} Station
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/40 backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-pulse" />
              Operational
            </span>
          </div>
          <div className="text-white/80 font-mono text-[12px] sm:text-[13px] mt-0.5 drop-shadow-sm flex items-center gap-3">
            <span>{stationData.coordinates}</span>
            <span className="text-white/40">·</span>
            <span>Elevation: {stationData.elevation}</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TOP-RIGHT OVERLAY                                              */}
        {/* ============================================================== */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Compass Rose */}
          <div 
            className="w-9 h-9 rounded-full bg-[#0A1428]/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 shadow-md relative"
            title="Compass: Polar Grid Azimuth Locked (North Up)"
          >
            <Compass className="w-5 h-5 text-white/80" />
            <span className="absolute -top-1 font-mono text-[8px] font-bold text-[#38BDF8]">N</span>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-9 h-9 rounded-full bg-[#0A1428]/60 hover:bg-[#0A1428]/85 border border-white/20 hover:border-white/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all shadow-md cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Expand to Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* ============================================================== */}
        {/* CAMERA PRESETS (Top center / floating strip)                  */}
        {/* ============================================================== */}
        {viewMode === '3d' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1 bg-[#0A1428]/70 border border-white/15 rounded-full p-1 backdrop-blur-md shadow-md pointer-events-auto text-[11px] font-mono text-white/80">
            {(['overall', 'front', 'side', 'top', 'cutaway'] as CameraPresetType[]).map(preset => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`px-2.5 py-0.5 rounded-full capitalize transition-colors cursor-pointer ${
                  activePreset === preset 
                    ? 'bg-[#38BDF8] text-slate-950 font-semibold shadow-xs' 
                    : 'hover:text-white hover:bg-white/10'
                }`}
              >
                {preset}
              </button>
            ))}
            <span className="w-[1px] h-3 bg-white/20 mx-0.5" />
            <button
              onClick={() => handlePresetClick('reset')}
              className="px-2 py-0.5 rounded-full flex items-center gap-1 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset camera to default view"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOTTOM-LEFT OVERLAY (Pill Toggles: 3D View vs Map View)       */}
        {/* ============================================================== */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 pointer-events-auto">
          <div className="inline-flex rounded-full p-1 bg-[#0A1428]/70 border border-white/20 backdrop-blur-md shadow-md">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3.5 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-[#BAE6FD] text-[#0C4A6E] font-semibold shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              3D View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#BAE6FD] text-[#0C4A6E] font-semibold shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM-RIGHT OVERLAY (4 Frosted-Glass Layer Chips)            */}
        {/* ============================================================== */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* Chip 1: Infrastructure */}
          <button
            onClick={() => setShowInfrastructure(!showInfrastructure)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer shadow-md backdrop-blur-[8px] ${
              showInfrastructure
                ? 'bg-[#0A1428]/90 border-[#38BDF8] text-[#38BDF8]'
                : 'bg-[rgba(10,20,40,0.55)] border-white/20 text-white/90 hover:bg-[rgba(10,20,40,0.75)] hover:border-white/40'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Infrastructure ▸</span>
          </button>

          {/* Chip 2: Energy */}
          <button
            onClick={() => setShowEnergy(!showEnergy)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer shadow-md backdrop-blur-[8px] ${
              showEnergy
                ? 'bg-[#0A1428]/90 border-[#4ADE80] text-[#4ADE80]'
                : 'bg-[rgba(10,20,40,0.55)] border-white/20 text-white/90 hover:bg-[rgba(10,20,40,0.75)] hover:border-white/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Energy ▸</span>
          </button>

          {/* Chip 3: Logistics */}
          <button
            onClick={() => setShowLogistics(!showLogistics)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer shadow-md backdrop-blur-[8px] ${
              showLogistics
                ? 'bg-[#0A1428]/90 border-[#FBBF24] text-[#FBBF24]'
                : 'bg-[rgba(10,20,40,0.55)] border-white/20 text-white/90 hover:bg-[rgba(10,20,40,0.75)] hover:border-white/40'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Logistics ▸</span>
          </button>

          {/* Chip 4: Environment */}
          <button
            onClick={() => setShowEnvironment(!showEnvironment)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer shadow-md backdrop-blur-[8px] ${
              showEnvironment
                ? 'bg-[#0A1428]/90 border-[#67E8F9] text-[#67E8F9]'
                : 'bg-[rgba(10,20,40,0.55)] border-white/20 text-white/90 hover:bg-[rgba(10,20,40,0.75)] hover:border-white/40'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-[#67E8F9]" />
            <span>Environment ▸</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* COMPONENT INSPECTOR DRAWER OVERLAY (When clicked in 3D scene)  */}
        {/* ============================================================== */}
        {showInspectorDrawer && selectedComponent && (
          <div className="absolute top-0 right-0 bottom-0 w-84 z-30 p-2 overflow-y-auto bg-[var(--surface)]/95 border-l border-[var(--border)] shadow-2xl backdrop-blur-md">
            <ComponentInspector
              component={selectedComponent}
              onClose={handleCloseInspector}
            />
          </div>
        )}
      </div>

      {/* METADATA STRIP WITH LABELED VALUES */}
      <div className="px-4 py-2.5 bg-[var(--surface)] border-t border-[var(--border)] flex flex-wrap items-center justify-between text-[13px] gap-y-2">
        <div className="flex flex-wrap items-center text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">Station:</span>
          <span className="ml-1.5">{stationData.name} ({stationData.code})</span>

          <span className="mx-3 h-3.5 w-[1px] bg-[var(--border)] hidden sm:inline-block" />

          <span className="font-medium text-[var(--text-primary)]">Coordinates:</span>
          <span className="ml-1.5 font-mono">{stationData.coordinates}</span>

          <span className="mx-3 h-3.5 w-[1px] bg-[var(--border)] hidden sm:inline-block" />

          <span className="font-medium text-[var(--text-primary)]">Elevation:</span>
          <span className="ml-1.5 font-mono">{stationData.elevation}</span>

          <span className="mx-3 h-3.5 w-[1px] bg-[var(--border)] hidden sm:inline-block" />

          <span className="font-medium text-[var(--text-primary)]">Status:</span>
          <span className="ml-1.5 text-[var(--success)] font-medium">Operational</span>

          <span className="mx-3 h-3.5 w-[1px] bg-[var(--border)] hidden md:inline-block" />

          <span className="font-medium text-[var(--text-primary)]">Data source:</span>
          <span className="ml-1.5 text-[var(--text-muted)]">Multi-physics hybrid twin</span>
        </div>

        {/* Text Links to Full 3D Digital Twin and Environment Map */}
        <div className="flex items-center space-x-4 text-[13px]">
          <Link
            to="/digital-twin"
            className="text-[var(--accent)] hover:underline flex items-center gap-1 font-medium"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open 3D view</span>
          </Link>
          <span className="text-[var(--border)]">•</span>
          <Link
            to="/environment"
            className="text-[var(--accent)] hover:underline flex items-center gap-1 font-medium"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open map view</span>
          </Link>
        </div>
      </div>

      {/* Caption under image */}
      <div className="px-4 py-1.5 bg-[var(--surface-subtle)] border-t border-[var(--border)] text-[12px] text-[var(--text-muted)] italic">
        {stationData.name} Station, {stationData.location} — 3D interactive station digital twin. Not an operational telemetry image.
      </div>
    </div>
  );
};
