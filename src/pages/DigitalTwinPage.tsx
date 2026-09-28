import React, { useState, useRef } from 'react';
import { useStation } from '../context/StationContext';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { ComponentInspector } from '../components/digital-twin/ComponentInspector';
import { Station3DCanvas, Station3DCanvasRef, CameraPresetType } from '../components/station-3d/Station3DCanvas';
import { EquipmentComponent } from '../types';
import { 
  Eye, 
  Zap, 
  Radio, 
  GitFork, 
  AlertTriangle, 
  Filter, 
  RotateCcw, 
  Maximize2,
  Tag,
  ShieldCheck,
  Compass,
  Boxes
} from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const { 
    station,
    stationData, 
    components, 
    selectedComponent, 
    selectedComponentId, 
    setSelectedComponentId,
    simulateFault,
    resetAllFaults,
    multiPhysicsState
  } = useStation();

  const canvasRef = useRef<Station3DCanvasRef>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2.5d'>('3d');
  const [showLabels, setShowLabels] = useState(true);
  const [showEnergyFlow, setShowEnergyFlow] = useState(true);
  const [showCommsFlow, setShowCommsFlow] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [showFaultImpact, setShowFaultImpact] = useState(true);
  const [isolatedSystem, setIsolatedSystem] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [overlayMode, setOverlayMode] = useState<'none' | 'thermal' | 'airflow' | 'acoustic' | 'comms'>('none');

  const categories = ['All', 'Power', 'Thermal', 'Comms', 'Life Support', 'Science', 'Storage', 'Computing'];

  const handleSelectComponent = (comp: EquipmentComponent) => {
    setSelectedComponentId(comp.id);
  };

  const handleResetView = () => {
    setShowLabels(true);
    setShowEnergyFlow(true);
    setShowCommsFlow(false);
    setShowDependencies(false);
    setShowFaultImpact(true);
    setIsolatedSystem(null);
    setSelectedComponentId('gen-01');
  };

  return (
    <div className={`space-y-3 max-w-[1600px] mx-auto select-none ${isFullscreen ? 'fixed inset-0 z-50 bg-[var(--bg-page)] p-6 overflow-auto' : ''}`}>
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Station Digital Twin
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--accent)] font-medium">
              {stationData.name.toUpperCase()} · {stationData.code}
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Interactive operational representation of the selected station.
          </p>
        </div>

        {/* Permanent demonstrators label */}
        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            SIMULATED STATION TWIN — DEMONSTRATOR VISUALIZATION
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] transition-colors"
            title="Toggle full screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW CONTROLS TOOLBAR */}
      <div className="card-polar p-2.5 flex flex-wrap items-center justify-between gap-2 text-[12px]">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 transition-colors ${
              showLabels 
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium' 
                : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Labels</span>
          </button>

          <button
            onClick={() => setShowEnergyFlow(!showEnergyFlow)}
            className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 transition-colors ${
              showEnergyFlow 
                ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] font-medium' 
                : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Energy flow</span>
          </button>

          <button
            onClick={() => setShowCommsFlow(!showCommsFlow)}
            className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 transition-colors ${
              showCommsFlow 
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium' 
                : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Communication flow</span>
          </button>

          <button
            onClick={() => setShowDependencies(!showDependencies)}
            className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 transition-colors ${
              showDependencies 
                ? 'border-[var(--text-secondary)] bg-[var(--surface-subtle)] text-[var(--text-primary)] font-medium' 
                : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Dependency links</span>
          </button>

          <button
            onClick={() => setShowFaultImpact(!showFaultImpact)}
            className={`px-2.5 py-1 rounded-[4px] border flex items-center gap-1.5 transition-colors ${
              showFaultImpact 
                ? 'border-[var(--critical)] bg-[var(--critical-soft)] text-[var(--critical)] font-medium' 
                : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Fault impact</span>
          </button>
        </div>

        {/* Category Isolator & Reset Actions */}
        <div className="flex items-center gap-2">
          {/* 3D vs 2.5D Mode Selector */}
          <div className="inline-flex rounded border border-[var(--border)] p-0.5 bg-[var(--surface-subtle)] text-[11px] font-mono">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2 py-0.5 rounded transition-colors ${
                viewMode === '3d'
                  ? 'bg-[var(--accent)] text-white font-medium shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              3D Orbit View
            </button>
            <button
              onClick={() => setViewMode('2.5d')}
              className={`px-2 py-0.5 rounded transition-colors ${
                viewMode === '2.5d'
                  ? 'bg-[var(--accent)] text-white font-medium shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              2.5D Isometric
            </button>
          </div>

          {/* Subsystem Isolator */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] mr-1">Isolate:</span>
            <select
              value={isolatedSystem || 'All'}
              onChange={(e) => setIsolatedSystem(e.target.value === 'All' ? null : e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetView}
            className="px-2.5 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset view</span>
          </button>
        </div>
      </div>

      {/* MULTI-PHYSICS ADVANCED OVERLAYS BAR */}
      <div className="card-polar px-3 py-2 flex flex-wrap items-center justify-between text-[11px] gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[var(--text-muted)] font-semibold uppercase">Multi-Physics Overlays:</span>
          <div className="inline-flex rounded border border-[var(--border)] p-0.5 bg-[var(--surface-subtle)]">
            {(['none', 'thermal', 'airflow', 'acoustic', 'comms'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setOverlayMode(mode)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  overlayMode === mode 
                    ? 'bg-[var(--surface)] text-[var(--primary)] font-semibold shadow-xs' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {mode === 'none' ? 'Standard' : mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-[10px] text-[var(--text-muted)]">
          {overlayMode === 'thermal' && 'Thermal bloom: Glycol loop + DG1 heat exchange'}
          {overlayMode === 'airflow' && 'Airflow: 0.28 ACH infiltration & HVAC circulation'}
          {overlayMode === 'acoustic' && 'Acoustic: Generator sound isobars (88 dBA -> 42 dBA)'}
          {overlayMode === 'comms' && 'Comms: GSAT-7A / Intelsat line-of-sight tracking arc'}
          {overlayMode === 'none' && 'Layer: Interactive Multi-Physics 3D Model'}
        </div>
      </div>

      {/* COMPONENT STATUS LEGEND STRIP */}
      <div className="card-polar px-3 py-2 flex flex-wrap items-center justify-between text-[11px] text-[var(--text-secondary)] font-mono gap-y-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[var(--text-muted)] font-semibold uppercase">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--caution)]" />
            Monitor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]" />
            Warning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--critical)]" />
            Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--data-issue)]" />
            Data Issue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]" />
            Offline
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateFault()}
            className="px-2 py-0.5 rounded border border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-soft)] font-mono text-[11px]"
          >
            + Inject Fault
          </button>
          <button
            onClick={resetAllFaults}
            className="px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] font-mono text-[11px]"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* MAIN DIGITAL TWIN WORKSPACE (CANVAS + INSPECTOR DRAWER) */}
      <div className="flex flex-col lg:flex-row gap-3 items-start">
        <div className="flex-1 w-full h-[580px] relative">
          {viewMode === '3d' ? (
            <div className="w-full h-full rounded-[4px] overflow-hidden border border-[var(--border)] relative bg-[#0B132B]">
              <Station3DCanvas
                ref={canvasRef}
                isMaitri={station === 'MAITRI'}
                components={components}
                selectedId={selectedComponentId}
                onSelectComponent={handleSelectComponent}
                multiPhysicsState={multiPhysicsState}
                showLabels={showLabels}
                showEnergy={showEnergyFlow}
                showComms={showCommsFlow}
                showLogistics={false}
                showEnvironment={overlayMode !== 'none'}
                isolatedSystem={isolatedSystem}
                showFaultImpact={showFaultImpact}
              />

              {/* Floating Camera Presets Bar in 3D View */}
              <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center gap-1 bg-[#0A1428]/85 border border-white/20 rounded-full p-1 backdrop-blur-md shadow-md text-[11px] font-mono text-white/90">
                {(['overall', 'front', 'side', 'top', 'cutaway'] as CameraPresetType[]).map(preset => (
                  <button
                    key={preset}
                    onClick={() => canvasRef.current?.setCameraPreset(preset)}
                    className="px-2.5 py-0.5 rounded-full capitalize hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
                <span className="w-[1px] h-3 bg-white/25 mx-0.5" />
                <button
                  onClick={() => canvasRef.current?.resetCamera()}
                  className="px-2 py-0.5 rounded-full flex items-center gap-1 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Reset to default camera orientation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 3D Navigation Instructions Hint */}
              <div className="absolute bottom-2 left-3 z-10 text-[10px] font-mono text-white/60 pointer-events-none bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                Left Drag: Orbit · Right Drag: Pan · Scroll: Zoom · Click: Inspect
              </div>
            </div>
          ) : (
            <DigitalTwinCanvas
              onSelectComponent={handleSelectComponent}
              selectedId={selectedComponentId}
              showLabels={showLabels}
              showEnergyFlow={showEnergyFlow}
              showCommsFlow={showCommsFlow}
              showDependencies={showDependencies}
              showFaultImpact={showFaultImpact}
              isolatedSystem={isolatedSystem}
              overlayMode={overlayMode}
            />
          )}
        </div>

        {/* Right Side Inspector Drawer */}
        <ComponentInspector
          component={selectedComponent}
          onClose={() => setSelectedComponentId(null)}
        />
      </div>
    </div>
  );
};
