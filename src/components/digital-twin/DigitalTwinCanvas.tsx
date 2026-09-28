import React, { useState } from 'react';
import { useStation } from '../../context/StationContext';
import { EquipmentComponent, ComponentStatus } from '../../types';

interface DigitalTwinCanvasProps {
  onSelectComponent: (component: EquipmentComponent) => void;
  selectedId: string | null;
  showLabels: boolean;
  showEnergyFlow: boolean;
  showCommsFlow: boolean;
  showDependencies: boolean;
  showFaultImpact: boolean;
  isolatedSystem: string | null;
  overlayMode?: 'none' | 'thermal' | 'airflow' | 'acoustic' | 'comms';
}

export const DigitalTwinCanvas: React.FC<DigitalTwinCanvasProps> = ({
  onSelectComponent,
  selectedId,
  showLabels,
  showEnergyFlow,
  showCommsFlow,
  showDependencies,
  showFaultImpact,
  isolatedSystem,
  overlayMode = 'none'
}) => {
  const { station, components, multiPhysicsState } = useStation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isMaitri = station === 'MAITRI';

  // Helper for status border & ring colors
  const getStatusColor = (status: ComponentStatus) => {
    switch (status) {
      case 'normal': return '#3F7A54'; // success
      case 'monitor': return '#B0801E'; // caution
      case 'warning': return '#B4611F'; // warning
      case 'critical': return '#A3312B'; // critical
      case 'data-issue': return '#6B4A8A'; // purple
      case 'offline': return '#8A94A6'; // grey
      default: return '#3F7A54';
    }
  };

  // Check if a component is affected by fault cascade
  const isCascadeImpacted = (comp: EquipmentComponent) => {
    if (!showFaultImpact) return false;
    // Highlight if critical or depends on critical component
    if (comp.status === 'critical') return true;
    const criticalComps = components.filter(c => c.status === 'critical');
    return criticalComps.some(crit => comp.dependsOn.includes(crit.id) || crit.dependentSystems.includes(comp.id));
  };

  return (
    <div className="w-full h-full bg-[var(--surface-subtle)] border border-[var(--border)] rounded-[4px] relative overflow-hidden flex items-center justify-center p-2 select-none min-h-[480px]">
      {/* Background Grid & Polar Coordinates Marker */}
      <div className="absolute top-2 left-3 font-mono text-[11px] text-[var(--text-muted)] pointer-events-none z-10 flex items-center gap-3">
        <span>ISOMETRIC 2.5D PROJECTION (AXONOMETRIC 30°)</span>
        <span>•</span>
        <span>GRID: 25m CELL POLAR RESOLUTION</span>
        <span>•</span>
        <span>TERRAIN: {isMaitri ? 'SCHIRMACHER NUNATAK ROCK / BLUE ICE' : 'LARSEMANN HILLS FAST-ICE MARGIN'}</span>
      </div>

      <div className="absolute bottom-2 left-3 font-mono text-[10px] text-[var(--text-muted)] pointer-events-none z-10">
        SCALE: 1:250 · ELEVATION DATUM: {isMaitri ? '+1,610m MSL' : '+35m MSL'}
      </div>

      <svg
        viewBox="0 0 920 540"
        className="w-full h-full max-h-[580px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Polar Terrain Gradients */}
          <linearGradient id="snowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--border)" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A94A6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4A5568" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2C5F8A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2C5F8A" stopOpacity="0.22" />
          </linearGradient>

          <linearGradient id="buildingTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--surface-subtle)" />
          </linearGradient>

          <linearGradient id="buildingSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--surface-subtle)" />
            <stop offset="100%" stopColor="var(--border)" />
          </linearGradient>

          {/* Marker for dependency vectors */}
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--text-muted)" />
          </marker>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--critical)" />
          </marker>
        </defs>

        {/* 1. Terrain Ground Plane Isometric Diamond */}
        <polygon
          points="460,30 890,260 460,510 30,260"
          fill="url(#snowGrad)"
          stroke="var(--border)"
          strokeWidth="1.2"
        />

        {/* 2. Topographical Context Features (Lake Priyadarshini for Maitri, Sea Coast for Bharati) */}
        {isMaitri ? (
          /* Lake Priyadarshini Meltwater Reservoir */
          <g>
            <path
              d="M 390 390 C 420 370, 480 380, 520 410 C 500 440, 440 460, 400 430 Z"
              fill="url(#iceGrad)"
              stroke="#2C5F8A"
              strokeWidth="0.8"
              strokeDasharray="4 2"
            />
            <text x="440" y="420" fill="#2C5F8A" fontSize="9" fontFamily="IBM Plex Mono" opacity="0.8">
              LAKE PRIYADARSHINI (GLACIAL SOURCE)
            </text>
            {/* Rock Nunatak outcrops */}
            <polygon points="140,210 170,190 200,210 170,225" fill="url(#rockGrad)" stroke="var(--border)" />
            <polygon points="720,160 760,140 790,165 750,180" fill="url(#rockGrad)" stroke="var(--border)" />
          </g>
        ) : (
          /* Larsemann Hills Coastal Ridge & Fast Ice Promontory */
          <g>
            <path
              d="M 60,320 C 180,260, 280,310, 390,360 C 480,410, 600,380, 840,430 L 890,260 L 780,210 Z"
              fill="url(#iceGrad)"
              stroke="#2C5F8A"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <text x="680" y="450" fill="#2C5F8A" fontSize="9" fontFamily="IBM Plex Mono" opacity="0.8">
              PRYDZ BAY / FAST-ICE SHORELINE
            </text>
            {/* Bharati aerodynamic stilted pilings outline */}
            <line x1="450" y1="290" x2="450" y2="330" stroke="var(--text-muted)" strokeWidth="1.5" />
            <line x1="560" y1="280" x2="560" y2="320" stroke="var(--text-muted)" strokeWidth="1.5" />
            <line x1="670" y1="290" x2="670" y2="330" stroke="var(--text-muted)" strokeWidth="1.5" />
          </g>
        )}

        {/* 3. Grid Lines (Isometric) */}
        <g stroke="var(--border)" strokeWidth="0.5" strokeOpacity="0.4">
          <line x1="180" y1="180" x2="680" y2="440" />
          <line x1="280" y1="130" x2="780" y2="390" />
          <line x1="380" y1="80" x2="880" y2="340" />
          <line x1="680" y1="150" x2="180" y2="410" />
          <line x1="780" y1="200" x2="280" y2="460" />
        </g>

        {/* 4. Inter-System Flow Lines */}
        {/* Energy Flow (Generators -> Power Dist -> Heating / Living / Lab) */}
        {showEnergyFlow && (
          <g stroke="#3F7A54" strokeWidth="1.5" strokeDasharray="5 3" fill="none">
            {/* Gen 1 & 2 to Main Power */}
            <path d="M 265 220 L 430 240" />
            <path d="M 265 295 L 430 255" />
            {/* Battery to Main Power */}
            <path d="M 370 255 L 430 248" />
            {/* Main Power to Heating, Living, Lab */}
            <path d="M 515 245 L 535 235" />
            <path d="M 515 260 L 535 330" />
            <path d="M 515 270 L 660 330" />
          </g>
        )}

        {/* Comms Flow (Edge Gateway -> Comms -> Sat Link) */}
        {showCommsFlow && (
          <g stroke="#2C5F8A" strokeWidth="1.5" strokeDasharray="3 3" fill="none">
            <path d="M 480 160 L 530 160" />
            <path d="M 515 155 L 640 160" />
            <path d="M 720 160 L 740 130" />
            <path d="M 740 260 L 515 160" />
          </g>
        )}

        {/* Dependency Links */}
        {showDependencies && (
          <g stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="2 2" fill="none">
            {components.map(comp => {
              if (isolatedSystem && comp.category !== isolatedSystem) return null;
              return comp.dependentSystems.map(depId => {
                const target = components.find(c => c.id === depId);
                if (!target) return null;
                const x1 = comp.coordinates2D.x + (comp.coordinates2D.width || 80) / 2;
                const y1 = comp.coordinates2D.y + (comp.coordinates2D.height || 60) / 2;
                const x2 = target.coordinates2D.x + (target.coordinates2D.width || 80) / 2;
                const y2 = target.coordinates2D.y + (target.coordinates2D.height || 60) / 2;
                return (
                  <line
                    key={`${comp.id}-${depId}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    markerEnd="url(#arrow)"
                    opacity="0.6"
                  />
                );
              });
            })}
          </g>
        )}

        {/* Fault Impact Cascade Vectors */}
        {showFaultImpact && (
          <g stroke="var(--critical)" strokeWidth="1.8" strokeDasharray="4 2" fill="none">
            {components
              .filter(c => c.status === 'critical' || c.status === 'warning')
              .map(crit => {
                return crit.dependentSystems.map(depId => {
                  const target = components.find(c => c.id === depId);
                  if (!target) return null;
                  const x1 = crit.coordinates2D.x + (crit.coordinates2D.width || 80) / 2;
                  const y1 = crit.coordinates2D.y + (crit.coordinates2D.height || 60) / 2;
                  const x2 = target.coordinates2D.x + (target.coordinates2D.width || 80) / 2;
                  const y2 = target.coordinates2D.y + (target.coordinates2D.height || 60) / 2;
                  return (
                    <line
                      key={`impact-${crit.id}-${depId}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      markerEnd="url(#arrowRed)"
                    />
                  );
                });
              })}
          </g>
        )}

        {/* 5. Render Interactive Station Modules */}
        {components.map(comp => {
          const isSelected = selectedId === comp.id;
          const isHovered = hoveredId === comp.id;
          const statusColor = getStatusColor(comp.status);
          const isCascade = isCascadeImpacted(comp);
          const isDimmed = isolatedSystem && comp.category !== isolatedSystem;

          const { x, y, width = 80, height = 60 } = comp.coordinates2D;

          // Isometric 3D box coordinates:
          // Top face, front face, right face
          const depth = 16;

          return (
            <g
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer transition-all duration-150"
              opacity={isDimmed ? 0.25 : 1}
            >
              {/* Ground Shadow */}
              <rect
                x={x + 4}
                y={y + 8}
                width={width}
                height={height}
                rx="3"
                fill="rgba(0,0,0,0.06)"
              />

              {/* Front/Side Extrusion */}
              <path
                d={`M ${x} ${y + height} L ${x + depth} ${y + height + depth} L ${x + width + depth} ${y + height + depth} L ${x + width} ${y + height} Z`}
                fill="url(#buildingSide)"
                stroke="var(--border)"
                strokeWidth="0.8"
              />
              <path
                d={`M ${x + width} ${y} L ${x + width + depth} ${y + depth} L ${x + width + depth} ${y + height + depth} L ${x + width} ${y + height} Z`}
                fill="url(#buildingSide)"
                stroke="var(--border)"
                strokeWidth="0.8"
              />

              {/* Top Face of Module */}
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx="3"
                fill="url(#buildingTop)"
                stroke={
                  isSelected 
                    ? 'var(--accent)' 
                    : isCascade 
                      ? 'var(--critical)' 
                      : isHovered 
                        ? 'var(--text-secondary)' 
                        : 'var(--border)'
                }
                strokeWidth={isSelected || isCascade ? 2 : 1}
              />

              {/* Status Indicator Bar (3px colored strip on top-left of component) */}
              <rect
                x={x}
                y={y}
                width={4}
                height={height}
                rx="1"
                fill={statusColor}
              />

              {/* Component Schematic Markings */}
              {/* Category Icon / Identifier */}
              <text
                x={x + 10}
                y={y + 16}
                fontSize="10"
                fontFamily="IBM Plex Mono"
                fontWeight="600"
                fill="var(--text-primary)"
              >
                {comp.id.toUpperCase().replace('BHR-', '')}
              </text>

              {/* Live Metric Snippet */}
              <text
                x={x + 10}
                y={y + 30}
                fontSize="9"
                fontFamily="IBM Plex Mono"
                fill="var(--text-muted)"
              >
                {comp.category === 'Power' && `${comp.powerUsageKw} kW`}
                {comp.category === 'Thermal' && `${comp.temperature}°C`}
                {comp.category === 'Comms' && `${comp.healthScore}% OK`}
                {comp.category === 'Life Support' && `${comp.temperature}°C`}
                {comp.category === 'Science' && `${comp.healthScore}% HLT`}
                {comp.category === 'Storage' && `${comp.loadPercentage}% CAP`}
                {comp.category === 'Computing' && `${comp.loadPercentage}% I/O`}
              </text>

              {/* Thin Health Score Line at bottom of module */}
              <rect
                x={x + 10}
                y={y + height - 8}
                width={width - 20}
                height="2.5"
                rx="1"
                fill="var(--border)"
              />
              <rect
                x={x + 10}
                y={y + height - 8}
                width={((width - 20) * comp.healthScore) / 100}
                height="2.5"
                rx="1"
                fill={statusColor}
              />

              {/* Module Text Label (if toggled) */}
              {showLabels && (
                <g>
                  <rect
                    x={x + width / 2 - 45}
                    y={y - 18}
                    width="90"
                    height="14"
                    rx="2"
                    fill="var(--surface)"
                    stroke="var(--border)"
                    strokeWidth="0.8"
                  />
                  <text
                    x={x + width / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="IBM Plex Sans"
                    fontWeight="500"
                    fill="var(--text-primary)"
                  >
                    {comp.name}
                  </text>
                </g>
              )}

              {/* Selected / Critical Ring Halo (hairline) */}
              {isSelected && (
                <rect
                  x={x - 3}
                  y={y - 3}
                  width={width + 6}
                  height={height + 6}
                  rx="5"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {isCascade && !isSelected && (
                <rect
                  x={x - 3}
                  y={y - 3}
                  width={width + 6}
                  height={height + 6}
                  rx="5"
                  fill="none"
                  stroke="var(--critical)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          );
        })}

        {/* 1. THERMAL OVERLAY MODE */}
        {overlayMode === 'thermal' && (
          <g className="pointer-events-none">
            {/* Generator heat bloom */}
            <ellipse cx="260" cy="270" rx="90" ry="50" fill="rgba(239, 68, 68, 0.25)" filter="url(#heatBlur)" />
            <text x="260" y="275" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
              GEN ZONE: {multiPhysicsState.generator.rotor_temp_c.toFixed(1)}°C (High Core)
            </text>

            {/* Hydronic Loop warm bloom */}
            <ellipse cx="440" cy="240" rx="80" ry="45" fill="rgba(245, 158, 11, 0.2)" />
            <text x="440" y="245" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              HYDRONIC HX: {multiPhysicsState.thermal_loop.glycol_temp_out_hx.toFixed(1)}°C
            </text>

            {/* Living Quarters comfortable bloom */}
            <ellipse cx="620" cy="210" rx="95" ry="50" fill="rgba(16, 185, 129, 0.15)" />
            <text x="620" y="215" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              HABITAT: {multiPhysicsState.zones.living.air_temp_c.toFixed(1)}°C (Comfort Target)
            </text>

            {/* External cold perimeter */}
            <rect x="50" y="50" width="180" height="40" rx="4" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1" />
            <text x="140" y="74" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace">
              EXTERNAL AIR: {multiPhysicsState.environment.temp_c.toFixed(1)}°C
            </text>
          </g>
        )}

        {/* 2. AIRFLOW OVERLAY MODE */}
        {overlayMode === 'airflow' && (
          <g className="pointer-events-none">
            {/* Ventilation streamlines */}
            <path d="M 80,180 Q 200,200 350,190 T 550,210 T 750,200" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="6 4" />
            <path d="M 120,240 Q 280,260 450,250 T 680,240" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
            <text x="140" y="170" fill="#0284c7" fontSize="9" fontFamily="monospace">Fresh Air Intake: 0.28 ACH (Filtered)</text>
            <text x="560" y="195" fill="#0284c7" fontSize="9" fontFamily="monospace">Recirculation Airflow: 1,450 CFM</text>
          </g>
        )}

        {/* 3. ACOUSTIC OVERLAY MODE */}
        {overlayMode === 'acoustic' && (
          <g className="pointer-events-none">
            {/* Concentric sound contours */}
            <circle cx="260" cy="270" r="45" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3 2" />
            <text x="260" y="220" textAnchor="middle" fill="#e11d48" fontSize="8" fontFamily="monospace">88 dBA (Near Generator)</text>

            <circle cx="260" cy="270" r="95" fill="none" stroke="#fb7185" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x="260" y="165" textAnchor="middle" fill="#e11d48" fontSize="8" fontFamily="monospace">65 dBA (Workshop Buffer)</text>

            <circle cx="260" cy="270" r="150" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="5 4" />
            <text x="260" y="110" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">42 dBA (Habitation Partition)</text>
          </g>
        )}

        {/* 4. COMMS LINE-OF-SIGHT OVERLAY MODE */}
        {overlayMode === 'comms' && (
          <g className="pointer-events-none">
            {/* Parabolic pointing arc towards satellite */}
            <path d="M 680,180 Q 750,110 840,40" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5 3" />
            <polygon points="845,35 835,42 842,48" fill="#8b5cf6" />
            <text x="730" y="100" fill="#7c3aed" fontSize="9" fontFamily="monospace">
              GSAT-7A / Intelsat Arc (El: {multiPhysicsState.comms.antenna_el_deg.toFixed(1)}° · Az: {multiPhysicsState.comms.antenna_az_deg.toFixed(1)}°)
            </text>
            <circle cx="680" cy="180" r="14" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="2 2" />
          </g>
        )}
      </svg>
    </div>
  );
};
