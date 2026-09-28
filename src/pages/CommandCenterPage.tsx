import React from 'react';
import { useStation } from '../context/StationContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Cpu, 
  ClipboardCheck, 
  Radio
} from 'lucide-react';

import { StationHeroPanel } from '../components/station-3d/StationHeroPanel';

export const CommandCenterPage: React.FC = () => {
  const { 
    station, 
    stationData, 
    currentTelemetry, 
    alerts, 
    auditLogs,
    simulateFault,
    simulateConnectionLoss,
    runScenario
  } = useStation();

  const navigate = useNavigate();
  const isMaitri = station === 'MAITRI';

  const criticalIncident = alerts.find(a => a.stationId === station && a.severity === 'Critical') || alerts[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* A. HERO PANEL (Interactive 3D Station Scene with Overlays) */}
      <StationHeroPanel />

      {/* B. PRIMARY METRIC STRIP (4 cards in a row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1 — Energy & Power */}
        <div className="card-polar p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[var(--text-primary)]">Energy & Power</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Simulated · 2 s refresh</span>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-1.5 text-[13px]">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[var(--text-secondary)]">Total load</span>
                  <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                    {(currentTelemetry.totalPowerKw / 1000).toFixed(1)} MW <span className="text-[12px] font-normal text-[var(--text-muted)]">/ 1.5 MW</span>
                  </span>
                </div>
                {/* Hairline progress bar 80% */}
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[var(--accent)]" style={{ width: '80%' }} />
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-[var(--text-secondary)]">Solar</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {isMaitri ? '320 kW' : '410 kW'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Wind</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {isMaitri ? '180 kW' : '230 kW'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Battery</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {currentTelemetry.batteryChargePct}%
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Diesel</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  40%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 — Fuel & Water */}
        <div className="card-polar p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[var(--text-primary)]">Fuel & Water</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Simulated · 2 s refresh</span>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-2.5 text-[13px]">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[var(--text-secondary)]">Fuel (diesel)</span>
                  <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                    {currentTelemetry.fuelLevelLiters.toLocaleString()} L <span className="text-[12px] font-normal text-[var(--text-muted)]">/ 20,000 L</span>
                  </span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[var(--caution)]" style={{ width: '62%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[var(--text-secondary)]">Water</span>
                  <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                    8,400 L <span className="text-[12px] font-normal text-[var(--text-muted)]">/ 10,000 L</span>
                  </span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[var(--success)]" style={{ width: '84%' }} />
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-[var(--text-secondary)]">Burn rate</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {currentTelemetry.fuelBurnRateLph} L/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 — Environment */}
        <div className="card-polar p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[var(--text-primary)]">Environment</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Simulated · 2 s refresh</span>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Temperature</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {currentTelemetry.ambientTemp} °C
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Wind speed</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {currentTelemetry.windSpeed} m/s
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Humidity</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  72%
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Visibility</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  {currentTelemetry.visibilityKm} km
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-secondary)]">Radiation</span>
                <span className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                  Low
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 — Infrastructure Health */}
        <div className="card-polar p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[var(--text-primary)]">Infrastructure Health</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Simulated · 2 s refresh</span>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-1.5 text-[13px]">
              <div>
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="text-[var(--text-secondary)]">Buildings</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">98%</span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-[var(--success)]" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="text-[var(--text-secondary)]">Power systems</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">92%</span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-[var(--success)]" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="text-[var(--text-secondary)]">Water systems</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">96%</span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-[var(--success)]" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="text-[var(--text-secondary)]">Communication</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">96%</span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-[var(--success)]" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="text-[var(--text-secondary)]">Roads & pathways</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">88%</span>
                </div>
                <div className="w-full h-1 bg-[var(--border)] rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-[var(--caution)]" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* C. SECONDARY GRID (3 columns) + D. RIGHT RAIL (System Alerts & Connectivity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main 3 Columns (Cols 1-8 or 1-9) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Column 1 — Equipment Health */}
            <div className="card-polar p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-medium text-[var(--text-primary)]">Equipment Health</h4>
                  <Link to="/digital-twin" className="text-[12px] text-[var(--accent)] hover:underline flex items-center gap-0.5">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="my-2 border-t border-[var(--border)]" />
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      Generator 1
                    </span>
                    <span className="font-mono font-medium text-[var(--text-primary)]">96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--caution)]" />
                      Generator 2
                    </span>
                    <span className="font-mono font-medium text-[var(--caution)]">72%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      Compressor 1
                    </span>
                    <span className="font-mono font-medium text-[var(--text-primary)]">93%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      Heating System
                    </span>
                    <span className="font-mono font-medium text-[var(--text-primary)]">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--caution)]" />
                      HVAC
                    </span>
                    <span className="font-mono font-medium text-[var(--caution)]">76%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      Communication Tower
                    </span>
                    <span className="font-mono font-medium text-[var(--text-primary)]">95%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 — Logistics & Inventory */}
            <div className="card-polar p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-medium text-[var(--text-primary)]">Logistics & Inventory</h4>
                  <Link to="/logistics" className="text-[12px] text-[var(--accent)] hover:underline flex items-center gap-0.5">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="my-2 border-t border-[var(--border)]" />
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Food Supplies</span>
                    <span className="font-mono text-[var(--success)]">68 t (12 days)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Fuel</span>
                    <span className="font-mono text-[var(--caution)]">62% (8 days)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Spare Parts</span>
                    <span className="font-mono text-[var(--caution)]">54% (16 days)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Medical Supplies</span>
                    <span className="font-mono text-[var(--success)]">84% (20 days)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">General Supplies</span>
                    <span className="font-mono text-[var(--success)]">73% (15 days)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 — Latest Incident */}
            <div className="card-polar p-3.5 flex flex-col justify-between border-l-[3px] border-l-[var(--critical)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">Latest incident</span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">14:12 IST</span>
                </div>
                <div className="my-2 border-t border-[var(--border)]" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {criticalIncident.title.replace(' Spike in Extreme Cold', '')}
                    </span>
                    <span className="text-[12px] font-mono text-[var(--critical)] font-medium">Critical</span>
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-3">
                    {criticalIncident.description}
                  </p>
                  <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)]">Priority</span> <span className="font-medium text-[var(--text-primary)]">High</span>
                  </div>
                  <div className="mt-2 text-[12px]">
                    <div className="text-[var(--text-muted)] mb-1">Recommended actions:</div>
                    <ol className="list-decimal list-inside space-y-0.5 text-[var(--text-secondary)] text-[12px]">
                      {criticalIncident.recommendedActions.slice(0, 3).map((act, i) => (
                        <li key={i} className="line-clamp-1">{act}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                    Related: Generator 2 · Cooling loop · Power distribution
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* E. REPAIR & RECOVERY PANEL (full-width across main col) */}
          <div className="card-polar p-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-medium text-[var(--text-primary)]">Repair & recovery estimation</h4>
              <Link to="/recovery" className="text-[12px] text-[var(--accent)] hover:underline flex items-center gap-1 font-medium">
                Open SOP-01 Plan <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[12px] text-[var(--text-muted)]">Estimated repair time</div>
                <div className="text-[18px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">4–6 hours</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Partial recovery (station normal)</div>
              </div>
              <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[12px] text-[var(--text-muted)]">Full recovery</div>
                <div className="text-[18px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">12–18 hours</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Full redundancy restored</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between items-center text-[12px] mb-1">
                <span className="text-[var(--text-secondary)] font-medium">Progress</span>
                <span className="font-mono text-[var(--text-primary)]">35% — In progress</span>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)]" style={{ width: '35%' }} />
              </div>
            </div>
          </div>

          {/* F. QUICK ACTIONS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => simulateFault()}
              className="px-3 py-2 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-primary)] transition-colors text-center"
            >
              Simulate generator fault
            </button>
            <button
              onClick={() => simulateConnectionLoss()}
              className="px-3 py-2 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-primary)] transition-colors text-center"
            >
              Simulate connection loss
            </button>
            <button
              onClick={() => navigate('/recovery')}
              className="px-3 py-2 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-primary)] transition-colors text-center"
            >
              Open recovery plan
            </button>
            <button
              onClick={() => navigate('/simulation')}
              className="px-3 py-2 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-primary)] transition-colors text-center"
            >
              Run what-if scenario
            </button>
          </div>
        </div>

        {/* D. RIGHT RAIL (persistent, spans dashboard height) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Panel A — System Alerts */}
          <div className="card-polar p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-[14px] font-medium text-[var(--text-primary)]">System alerts</h4>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[var(--critical-soft)] text-[var(--critical)] border border-[var(--critical)]/20">
                  {alerts.length}
                </span>
              </div>
              <Link to="/alerts" className="text-[12px] text-[var(--accent)] hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-2">
              {alerts.slice(0, 4).map(alert => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-[3px] bg-[var(--surface-subtle)] border-l-[3px] ${
                    alert.severity === 'Critical'
                      ? 'border-l-[var(--critical)]'
                      : alert.severity === 'Warning'
                        ? 'border-l-[var(--warning)]'
                        : 'border-l-[var(--accent)]'
                  } flex items-start justify-between gap-2`}
                >
                  <div>
                    <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight">
                      {alert.title}
                    </div>
                    <div className="text-[12px] text-[var(--text-muted)] mt-0.5">
                      {alert.stationId} · 14:12 IST
                    </div>
                  </div>
                  <span className={`text-[12px] font-mono shrink-0 ${
                    alert.severity === 'Critical'
                      ? 'text-[var(--critical)] font-semibold'
                      : alert.severity === 'Warning'
                        ? 'text-[var(--warning)]'
                        : 'text-[var(--text-muted)]'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel B — Connectivity Status */}
          <div className="card-polar p-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-medium text-[var(--text-primary)]">Connectivity</h4>
              <Link to="/connectivity" className="text-[12px] text-[var(--accent)] hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">Maitri</div>
                  <div className="text-[12px] text-[var(--text-muted)] font-mono">Strong (4G / SAT · 118 ms)</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">Bharati</div>
                  <div className="text-[12px] text-[var(--text-muted)] font-mono">Weak (SAT · 245 ms)</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[var(--caution)]" />
              </div>
            </div>
          </div>

          {/* G. RECENT ACTIVITY TIMELINE */}
          <div className="card-polar p-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-medium text-[var(--text-primary)]">Recent activity</h4>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Live journal</span>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 8).map(log => (
                <div key={log.id} className="text-[12px] flex items-start gap-2">
                  <span className="font-mono text-[var(--text-muted)] shrink-0 text-[11px]">
                    {log.timestamp.slice(0, 5)}
                  </span>
                  <div className="leading-snug">
                    <span className="text-[var(--text-primary)] font-medium mr-1.5">{log.actor}</span>
                    <span className="text-[var(--text-secondary)]">{log.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JUST CHANGED PANEL (LAST 60 SECONDS) */}
          <div className="card-polar p-3.5 border-l-[3px] border-l-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Just Changed (Last 60 s)</h4>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Multi-physics delta</span>
            </div>
            <div className="my-2 border-t border-[var(--border)]" />
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">DG1 Winding Temp:</span>
                <span className="text-emerald-700 font-medium">84.2°C (Δ +0.3°C / min)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">LiFePO4 Internal Res:</span>
                <span className="text-[var(--text-primary)]">14.6 mΩ (Stable)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">HX Glycol Delta:</span>
                <span className="text-[var(--text-primary)]">ΔT 13.2°C (Recovery 94%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Satcom Radome Az/El:</span>
                <span className="text-[var(--text-primary)]">Az 342.1° · El 14.8°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE STATION SYSTEM SUMMARY TABLE */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Integrated Station Subsystem Matrix
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Consolidated operational parameters, degradation status, thermal balance, and contingency margins across all primary physical subsystems.
            </p>
          </div>
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            STATION AUTONOMY: 78.4 DAYS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse font-mono">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-left bg-[var(--surface-subtle)]">
                <th className="py-2 px-2.5">Subsystem</th>
                <th className="py-2 px-2.5">Primary Asset</th>
                <th className="py-2 px-2.5">Key Metric / Operating Point</th>
                <th className="py-2 px-2.5">Thermal Envelope</th>
                <th className="py-2 px-2.5">Health Score</th>
                <th className="py-2 px-2.5">Autonomy / Margin</th>
                <th className="py-2 px-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr className="hover:bg-[var(--surface-subtle)]">
                <td className="py-2 px-2.5 font-medium text-[var(--text-primary)]">Primary Power</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Cummins KTA50 DG-1</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">64.2 kW (53% Load)</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Rotor: 84.2°C / Oil: 78.1°C</td>
                <td className="py-2 px-2.5 text-emerald-600 font-semibold">94.2%</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">N+1 Hot Standby Ready</td>
                <td className="py-2 px-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">ONLINE</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-subtle)]">
                <td className="py-2 px-2.5 font-medium text-[var(--text-primary)]">Battery Storage</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">LiFePO4 120 kWh Bank</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">SoC 78.2% · 52.4 V · 42 A</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Thermal Jacket: 18.5°C</td>
                <td className="py-2 px-2.5 text-emerald-600 font-semibold">97.0%</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">6.4 Hours Full Station Load</td>
                <td className="py-2 px-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">FLOAT</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-subtle)]">
                <td className="py-2 px-2.5 font-medium text-[var(--text-primary)]">Thermal Hydronic</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Alfa Laval Heat Exchanger</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Flow: 45.0 L/min Glycol</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Outflow: 54.8°C / Return: 41.6°C</td>
                <td className="py-2 px-2.5 text-emerald-600 font-semibold">91.5%</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Covers 88% Heating Demand</td>
                <td className="py-2 px-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">OPTIMAL</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-subtle)]">
                <td className="py-2 px-2.5 font-medium text-[var(--text-primary)]">Habitat Air</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Living & Lab Modules</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Living: 21.2°C · Lab: 20.4°C</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">PMV: +0.06 (Neutral Comfort)</td>
                <td className="py-2 px-2.5 text-emerald-600 font-semibold">98.5%</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Passive Infiltration: 0.28 ACH</td>
                <td className="py-2 px-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">COMFORT</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-subtle)]">
                <td className="py-2 px-2.5 font-medium text-[var(--text-primary)]">Polar Fuel Depot</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Arctic Grade Diesel (ATF-50)</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">58,400 L Stored (68% Tank)</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Tank Temp: -4.2°C · Visc: 3.1 cSt</td>
                <td className="py-2 px-2.5 text-emerald-600 font-semibold">99.0%</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">78.4 Days Autonomy at 64 kW</td>
                <td className="py-2 px-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">ADEQUATE</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-subtle)]">
                <td className="py-2 px-2.5 font-medium text-[var(--text-primary)]">Comms & Telemetry</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">GSAT-7A C-Band Terminal</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">128 kbps (Burst 512 kbps)</td>
                <td className="py-2 px-2.5 text-[var(--text-primary)]">Radome Heated: +4.0°C</td>
                <td className="py-2 px-2.5 text-emerald-600 font-semibold">92.0%</td>
                <td className="py-2 px-2.5 text-[var(--text-secondary)]">Flash Buffer: 18% (21d Hold)</td>
                <td className="py-2 px-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">LOCKED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
