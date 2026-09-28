import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  GitFork, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Zap, 
  FlaskConical, 
  Boxes, 
  ArrowRight, 
  Compass, 
  ThermometerSnowflake 
} from 'lucide-react';

export const ImpactEnginePage: React.FC = () => {
  const { station, stationData, components } = useStation();
  const [selectedCompId, setSelectedCompId] = useState<string>('gen-01');

  const selectedComp = components.find(c => c.id === selectedCompId) || components[0];

  // Calculate cascading dependency chain
  const tier1Deps = components.filter(c => selectedComp.dependentSystems.includes(c.id));
  const tier2Deps = components.filter(c => 
    tier1Deps.some(t1 => t1.dependentSystems.includes(c.id)) && 
    !tier1Deps.some(t1 => t1.id === c.id) &&
    c.id !== selectedComp.id
  );

  // MCDA Priority Weights & Calculations
  const isPowerOrGen = selectedComp.category === 'Power';
  const isThermal = selectedComp.category === 'Thermal';
  const isFuel = selectedComp.category === 'Storage' && selectedComp.name.includes('Fuel');

  const safetyScore = isPowerOrGen ? 95 : isThermal ? 90 : isFuel ? 85 : 45;
  const thermalScore = isThermal ? 98 : isPowerOrGen ? 88 : 35;
  const powerScore = isPowerOrGen ? 100 : 25;
  const scienceScore = selectedComp.category === 'Science' ? 95 : 60;
  const logisticsScore = isFuel ? 92 : 40;

  // Composite Multi-Criteria Priority Score
  // Weights: Safety 0.40, Thermal 0.25, Power 0.20, Science 0.10, Logistics 0.05
  const priorityScore = Math.round(
    safetyScore * 0.40 +
    thermalScore * 0.25 +
    powerScore * 0.20 +
    scienceScore * 0.10 +
    logisticsScore * 0.05
  );

  const getUrgencyBadge = (score: number) => {
    if (score >= 85) return { label: 'CRITICAL EVACUATION / EMERGENCY RESPONSE', color: 'text-[var(--critical)] bg-[var(--critical-soft)] border-[var(--critical)]' };
    if (score >= 70) return { label: 'HIGH PRIORITY TIER 1 ACTION REQUIRED', color: 'text-[var(--warning)] bg-[var(--warning-soft)] border-[var(--warning)]' };
    if (score >= 50) return { label: 'MODERATE OPERATIONAL DEGRADATION', color: 'text-[var(--caution)] bg-[var(--caution-soft)] border-[var(--caution)]' };
    return { label: 'LOW / ROUTINE SUPPORT ACTION', color: 'text-[var(--success)] bg-[var(--success-soft)] border-[var(--success)]' };
  };

  const urgency = getUrgencyBadge(priorityScore);

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Cross-System Impact & Priority Engine
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Multi-Criteria Decision Analysis (MCDA) of cascading subsystem failures under extreme polar weather.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            Algorithm: ISO-14224 Polar Criticality Matrix
          </div>
        </div>
      </div>

      {/* COMPONENT SELECTION BAR */}
      <div className="card-polar p-3 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">Analyze Failure Source:</span>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            {components.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.category} · Status: {c.status})
              </option>
            ))}
          </select>
        </div>

        <div className={`px-2.5 py-1 rounded text-[11px] font-mono border ${urgency.color}`}>
          {urgency.label}
        </div>
      </div>

      {/* MULTI-FACTOR IMPACT SCORES & URGENCY INDEX */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Factor 1: Safety Risk */}
        <div className="card-polar p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--critical)]" />
              Safety Risk
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">40% Wt</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">{safetyScore}/100</span>
            <span className="text-[11px] font-mono text-[var(--critical)]">{safetyScore > 80 ? 'Life Threat' : 'Safe'}</span>
          </div>
          <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--critical)]" style={{ width: `${safetyScore}%` }} />
          </div>
        </div>

        {/* Factor 2: Thermal Integrity */}
        <div className="card-polar p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-[var(--warning)]" />
              Thermal Loss
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">25% Wt</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">{thermalScore}/100</span>
            <span className="text-[11px] font-mono text-[var(--warning)]">{thermalScore > 80 ? 'Freeze Risk' : 'Insulated'}</span>
          </div>
          <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--warning)]" style={{ width: `${thermalScore}%` }} />
          </div>
        </div>

        {/* Factor 3: Power Grid Stability */}
        <div className="card-polar p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
              Grid Stability
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">20% Wt</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">{powerScore}/100</span>
            <span className="text-[11px] font-mono text-[var(--accent)]">{powerScore > 80 ? 'Brownout' : 'Stable'}</span>
          </div>
          <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--accent)]" style={{ width: `${powerScore}%` }} />
          </div>
        </div>

        {/* Factor 4: Science Continuity */}
        <div className="card-polar p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-[var(--caution)]" />
              Science Loss
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">10% Wt</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">{scienceScore}/100</span>
            <span className="text-[11px] font-mono text-[var(--caution)]">{scienceScore > 80 ? 'Data Loss' : 'Tolerant'}</span>
          </div>
          <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--caution)]" style={{ width: `${scienceScore}%` }} />
          </div>
        </div>

        {/* Factor 5: Logistics & Fuel Burn */}
        <div className="card-polar p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              Logistics
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">5% Wt</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">{logisticsScore}/100</span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">{logisticsScore > 80 ? 'Reserves' : 'Adequate'}</span>
          </div>
          <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[var(--text-secondary)]" style={{ width: `${logisticsScore}%` }} />
          </div>
        </div>
      </div>

      {/* CASCADING PROPAGATION GRAPH (TIER 0 -> TIER 1 -> TIER 2) */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Cascading Failure Propagation Topology
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Downstream system dependencies that trip if {selectedComp.name} fails in blizzard conditions.
            </p>
          </div>
          <div className="font-mono text-[11px] text-[var(--text-muted)]">
            Composite Severity Score: <strong className="text-[var(--critical)]">{priorityScore} / 100</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Column 1: Primary Failure (Tier 0) */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-2">
            <div className="text-[10px] font-mono uppercase text-[var(--critical)] font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Initiating Component (Tier 0)</span>
            </div>
            <div className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[4px] border-l-[3px] border-l-[var(--critical)]">
              <div className="font-semibold text-[13px] text-[var(--text-primary)]">{selectedComp.name}</div>
              <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                ID: {selectedComp.id.toUpperCase()} · Cat: {selectedComp.category}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                Health: {selectedComp.healthScore}% · Load: {selectedComp.loadPercentage}%
              </div>
            </div>
          </div>

          {/* Column 2: Direct Downstream Systems (Tier 1) */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-2">
            <div className="text-[10px] font-mono uppercase text-[var(--warning)] font-semibold flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>Direct Cascade ({tier1Deps.length} Subsystems)</span>
            </div>
            <div className="space-y-1.5">
              {tier1Deps.length > 0 ? (
                tier1Deps.map(t1 => (
                  <div key={t1.id} className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-[4px] border-l-[3px] border-l-[var(--warning)] text-[12px]">
                    <div className="font-medium text-[var(--text-primary)]">{t1.name}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                      Loses primary feed from {selectedComp.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[12px] text-[var(--text-muted)]">
                  No immediate Tier 1 children.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Secondary Downstream Systems (Tier 2) */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-2">
            <div className="text-[10px] font-mono uppercase text-[var(--caution)] font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Secondary Station Impact ({tier2Deps.length} Subsystems)</span>
            </div>
            <div className="space-y-1.5">
              {tier2Deps.length > 0 ? (
                tier2Deps.map(t2 => (
                  <div key={t2.id} className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-[4px] border-l-[3px] border-l-[var(--caution)] text-[12px]">
                    <div className="font-medium text-[var(--text-primary)]">{t2.name}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                      Secondary thermal / load deprivation
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[12px] text-[var(--text-muted)]">
                  No Tier 2 secondary consequences identified.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONABLE DECISION MATRIX */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
          Autonomous Action & Shedding Protocol for {selectedComp.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[11px] uppercase text-[var(--critical)] font-semibold mb-1">
              1. Load Shedding Sequence
            </div>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
              <li>Drop exterior floodlighting & non-essential heating (Shed 45 kW)</li>
              <li>Isolate science spectrometer chiller loop (Shed 60 kW)</li>
              <li>Maintain essential living habitat heating & comms beacon (Hold 140 kW)</li>
            </ul>
          </div>

          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[11px] uppercase text-[var(--warning)] font-semibold mb-1">
              2. Personnel Protection Protocol
            </div>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
              <li>Muster all 25 wintering expeditioners to Main Habitation Pod</li>
              <li>Seal non-heated annexes to minimize air exchange</li>
              <li>Verify emergency battery survival radios and oxygen kits</li>
            </ul>
          </div>

          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
            <div className="font-mono text-[11px] uppercase text-[var(--success)] font-semibold mb-1">
              3. Auxiliary Redundancy Cutover
            </div>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
              <li>Engage LiFePO4 BESS pack in isochronous grid-forming mode</li>
              <li>Cold-start backup diesel generator using preheated glycol coil</li>
              <li>Switch telemetry to store-and-forward edge buffer</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DEPTH SECTIONS: TIME-TO-CRITICAL & MONTE CARLO INTERVENTION LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time-to-Critical Prediction */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Time-to-Critical Thermal / Power Degradation
            </h4>
            <span className="font-mono text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              P50 ESTIMATE
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-3 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Time-to-Critical Habitat Freeze (&lt;10°C):</span>
              <span className="text-rose-600 font-bold">2.4 Hours (144 min)</span>
            </div>
            <div className="flex justify-between">
              <span>Time-to-BESS Depletion (SoC &lt;10%):</span>
              <span className="text-amber-700 font-semibold">4.8 Hours</span>
            </div>
            <div className="flex justify-between">
              <span>Fuel Line Gelling Threshold (-12°C):</span>
              <span className="text-[var(--text-primary)]">6.2 Hours</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Monte Carlo Confidence Envelope:</span>
              <span className="text-emerald-700 font-semibold">P5: 1.8h · P50: 2.4h · P95: 3.1h</span>
            </div>
          </div>
        </div>

        {/* Actionable Intervention Points Timeline */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Optimal Operator Intervention Points
            </h4>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              DECISION WINDOW
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="p-2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 flex justify-between">
              <span>T + 12 min (Window 1):</span>
              <span className="font-medium">Activate auxiliary glycol bypass pump</span>
            </div>
            <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200 flex justify-between">
              <span>T + 35 min (Window 2):</span>
              <span className="font-medium">Synchronize DG-2 with bus</span>
            </div>
            <div className="p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 flex justify-between">
              <span>T + 75 min (Window 3):</span>
              <span className="font-medium">Isolate non-critical science payloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
