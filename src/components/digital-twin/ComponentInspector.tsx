import React from 'react';
import { EquipmentComponent, ComponentStatus } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useStation } from '../../context/StationContext';
import { 
  X, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  RotateCcw
} from 'lucide-react';

interface ComponentInspectorProps {
  component: EquipmentComponent | null;
  onClose: () => void;
}

export const ComponentInspector: React.FC<ComponentInspectorProps> = ({ component, onClose }) => {
  const navigate = useNavigate();
  const { simulateFault, updateComponentStatus, resetAllFaults } = useStation();

  if (!component) {
    return (
      <div className="w-80 shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-[4px] p-4 flex flex-col items-center justify-center text-center text-[var(--text-muted)] min-h-[460px]">
        <Activity className="w-8 h-8 stroke-[1.2] mb-2 text-[var(--text-muted)]/60" />
        <div className="text-[13px] font-medium text-[var(--text-secondary)]">No Component Selected</div>
        <div className="text-[11px] mt-1 max-w-[200px]">
          Click any station module on the 2.5D twin canvas to inspect live telemetry and dependencies.
        </div>
      </div>
    );
  }

  const getStatusColor = (status: ComponentStatus) => {
    switch (status) {
      case 'normal': return 'text-[var(--success)]';
      case 'monitor': return 'text-[var(--caution)]';
      case 'warning': return 'text-[var(--warning)]';
      case 'critical': return 'text-[var(--critical)]';
      case 'data-issue': return 'text-[var(--data-issue)]';
      case 'offline': return 'text-[var(--text-muted)]';
      default: return 'text-[var(--success)]';
    }
  };

  const getStatusBorderClass = (status: ComponentStatus) => {
    switch (status) {
      case 'critical': return 'border-l-[3px] border-l-[var(--critical)]';
      case 'warning': return 'border-l-[3px] border-l-[var(--warning)]';
      case 'monitor': return 'border-l-[3px] border-l-[var(--caution)]';
      case 'normal': return 'border-l-[3px] border-l-[var(--success)]';
      case 'data-issue': return 'border-l-[3px] border-l-[var(--data-issue)]';
      default: return 'border-l-[3px] border-l-[var(--border)]';
    }
  };

  return (
    <div className={`w-88 shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-[4px] flex flex-col max-h-[600px] overflow-hidden ${getStatusBorderClass(component.status)}`}>
      {/* Header */}
      <div className="p-3 border-b border-[var(--border)] flex items-start justify-between bg-[var(--surface-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
              {component.id.toUpperCase()}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {component.category}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mt-0.5 leading-tight">
            {component.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Body Content */}
      <div className="p-3.5 space-y-3.5 overflow-y-auto text-[13px] flex-1">
        {/* Status & Health Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="text-[11px] uppercase font-mono text-[var(--text-muted)]">Status</div>
            <div className={`font-semibold capitalize mt-0.5 ${getStatusColor(component.status)}`}>
              {component.status}
            </div>
          </div>
          <div className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="text-[11px] uppercase font-mono text-[var(--text-muted)]">Health Score</div>
            <div className="font-mono font-semibold text-[var(--text-primary)] mt-0.5 flex items-center justify-between">
              <span>{component.healthScore}%</span>
              <div className="w-12 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${component.healthScore < 80 ? 'bg-[var(--critical)]' : 'bg-[var(--success)]'}`}
                  style={{ width: `${component.healthScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Sparkline Trend Visualization */}
        <div className="border border-[var(--border)] rounded p-2.5 bg-[var(--surface-subtle)] space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[var(--text-muted)] uppercase">Live Telemetry Sparkline (30s)</span>
            <span className="text-[var(--text-primary)] font-medium">1 Hz RK4</span>
          </div>
          <div className="h-10 w-full relative flex items-end">
            {/* SVG Sparkline */}
            <svg viewBox="0 0 280 40" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Baseline */}
              <line x1="0" y1="20" x2="280" y2="20" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              {/* Sparkline curve */}
              <path
                d="M 0,22 Q 35,18 70,24 T 140,16 T 210,22 T 280,18"
                fill="none"
                stroke={component.status === 'critical' ? 'var(--critical)' : 'var(--accent)'}
                strokeWidth="1.8"
              />
              {/* Current value dot */}
              <circle 
                cx="280" 
                cy="18" 
                r="3" 
                fill={component.status === 'critical' ? 'var(--critical)' : 'var(--accent)'} 
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
            <span>-30s</span>
            <span>Ref Baseline</span>
            <span>Now ({component.temperature}°C)</span>
          </div>
        </div>

        {/* Core Live Metrics Table */}
        <div className="border border-[var(--border)] rounded overflow-hidden">
          <div className="px-2.5 py-1 bg-[var(--surface-subtle)] border-b border-[var(--border)] text-[11px] font-mono uppercase text-[var(--text-muted)]">
            Operating Telemetry
          </div>
          <div className="divide-y divide-[var(--border)] text-[12px]">
            <div className="flex justify-between px-2.5 py-1.5">
              <span className="text-[var(--text-secondary)]">Temperature</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{component.temperature} °C</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5">
              <span className="text-[var(--text-secondary)]">Power Load / Output</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{component.powerUsageKw} kW</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5">
              <span className="text-[var(--text-secondary)]">Load Capacity</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{component.loadPercentage}%</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5">
              <span className="text-[var(--text-secondary)]">Last Heartbeat</span>
              <span className="font-mono text-[var(--text-muted)]">{component.lastHeartbeat}</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5">
              <span className="text-[var(--text-secondary)]">Last Maintenance</span>
              <span className="font-mono text-[var(--text-muted)]">{component.lastMaintenance}</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5">
              <span className="text-[var(--text-secondary)]">Data Quality</span>
              <span className="font-mono text-[var(--success)]">{component.dataQualityScore}%</span>
            </div>
          </div>
        </div>

        {/* Current Alerts */}
        <div>
          <div className="text-[11px] uppercase font-mono text-[var(--text-muted)] mb-1">
            Active Alerts ({component.alerts.length})
          </div>
          {component.alerts.length > 0 ? (
            <div className="space-y-1">
              {component.alerts.map((alt, idx) => (
                <div key={idx} className="p-2 text-[12px] bg-[var(--critical-soft)] border-l-[3px] border-l-[var(--critical)] text-[var(--critical)] rounded-r">
                  {alt}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5 p-1.5 bg-[var(--surface-subtle)] rounded border border-[var(--border)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>No abnormal telemetry flagged.</span>
            </div>
          )}
        </div>

        {/* Dependent Systems & Topology */}
        <div>
          <div className="text-[11px] uppercase font-mono text-[var(--text-muted)] mb-1">
            Dependent Subsystems ({component.dependentSystems.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {component.dependentSystems.length > 0 ? (
              component.dependentSystems.map(dep => (
                <span key={dep} className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">
                  {dep}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-[var(--text-muted)]">Terminal subsystem (no children)</span>
            )}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded text-[12px]">
          <div className="font-mono text-[10px] uppercase text-[var(--text-muted)] mb-0.5">
            Operational Recommendation
          </div>
          <div className="text-[var(--text-secondary)] leading-snug">
            {component.recommendedAction}
          </div>
        </div>

        {/* Plain Outlined Action Buttons */}
        <div className="pt-2 border-t border-[var(--border)] space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => navigate('/telemetry')}
              className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>View telemetry</span>
            </button>

            <button
              onClick={() => navigate('/recovery')}
              className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Recovery planner</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => simulateFault(`${component.name} Malfunction`)}
              className="px-2.5 py-1.5 rounded-[4px] border border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-soft)] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate fault</span>
            </button>

            <button
              onClick={() => updateComponentStatus(component.id, 'normal', 98)}
              className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-secondary)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>Restore nominal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
