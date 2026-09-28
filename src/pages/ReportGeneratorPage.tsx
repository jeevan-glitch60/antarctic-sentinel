import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileSpreadsheet,
  Terminal,
  Bookmark
} from 'lucide-react';

type ReportTemplate = 'shift_handover' | 'incident' | 'weekly_summary' | 'maintenance' | 'science';

export const ReportGeneratorPage: React.FC = () => {
  const { station, stationData, multiPhysicsState, activeScenario, simService } = useStation();

  const manifest = simService.getManifest();
  const sessionSeed = manifest.seed;
  const simEngineVersion = manifest.engine_version;

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>('shift_handover');
  const [operatorNotes, setOperatorNotes] = useState<string>('All auxiliary systems functioning within nominal polar envelopes. Fuel transfer from main bladder tank completed successfully. No critical deviations during watch.');
  const [copied, setCopied] = useState<boolean>(false);

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  // Generate dynamic report content based on state and template
  const generateReportMarkdown = (): string => {
    const header = `# ANTARCTIC SENTINEL — FORMAL OPERATIONAL REPORT
**Station:** ${station.toUpperCase()} (${stationData.coordinates})
**Generated:** ${timestamp}
**Engine Seed:** ${sessionSeed} · **Version:** ${simEngineVersion}
**Classification:** OFFICIAL SCIENTIFIC RECORD / UNCLASSIFIED
**Notice:** DEMONSTRATOR MODE — SIMULATED DATA — NOT CONNECTED TO LIVE STATION SYSTEMS.

---
`;

    if (selectedTemplate === 'shift_handover') {
      return `${header}
## 1. SHIFT WATCH HANDOVER REPORT
- **Watch Officer:** On-Duty Station Engineer
- **Active Crew on Station:** ${stationData.winteringCrew}
- **Operating Regime:** ${multiPhysicsState.environment.temp_c < -25 ? 'Severe Cold / Windchill Alert' : 'Standard Austral Operations'}

### Key Station Metrics
| Subsystem | Metric | Current Value | Threshold / State |
|---|---|---|---|
| Primary Generator | Power Output | 64.2 kW | Nominal (40–120 kW) |
| Diesel Engine | Rotor Temp / CHT | ${multiPhysicsState.generator.rotor_temp_c.toFixed(1)}°C | Nominal (&lt;95°C) |
| Engine Vibration | Band 1 Fundamental | ${multiPhysicsState.generator.vibration_spectrum[0].toFixed(2)} mm/s | Alert at &gt;4.5 mm/s |
| LiFePO4 Storage | State of Charge (SoC) | ${multiPhysicsState.battery.soc_pct.toFixed(1)}% | Nominal (&gt;30%) |
| Battery Health | State of Health (SoH) | ${multiPhysicsState.battery.soh_pct.toFixed(1)}% | High Health |
| Hydronic Heating | Glycol HX Outflow | ${multiPhysicsState.thermal_loop.glycol_temp_out_hx.toFixed(1)}°C | Target 55°C |
| Habitat Living | Air Temperature | ${multiPhysicsState.zones.living.air_temp_c.toFixed(1)}°C | Setpoint +21.0°C |
| Science Labs | Air Temperature | ${multiPhysicsState.zones.lab.air_temp_c.toFixed(1)}°C | Setpoint +20.0°C |
| Station Fuel | Usable Reserve | ${multiPhysicsState.fuel.tank_level_l.toFixed(0)} L | Autonomy ~78 Days |
| Fuel Viscosity | Temperature Corrected | ${multiPhysicsState.fuel.viscosity_cst.toFixed(2)} cSt | ASTM D341 Safe |
| Comms Uplink | Link State / SNR | ${multiPhysicsState.comms.link_state.toUpperCase()} (${multiPhysicsState.comms.snr_db.toFixed(1)} dB) | Buffer: ${multiPhysicsState.comms.buffer_occupancy_mb.toFixed(0)} MB |

### Operational Incidents & Anomalies
- **Active Injected Fault:** ${activeScenario ? activeScenario.toUpperCase() : 'None. All monitored parameters in green envelope.'}
- **Telemetry Health:** Continuous 1 Hz RK4 numerical integration nominal.

### Watch Officer Handover Notes
${operatorNotes}

### Signature & Handover
- Outgoing Watch Engineer: ___________________________
- Incoming Watch Engineer: ___________________________
`;
    }

    if (selectedTemplate === 'incident') {
      return `${header}
## 2. INCIDENT INVESTIGATION & ANOMALY REPORT
- **Incident Reference:** INC-${new Date().getFullYear()}-0928
- **Severity Classification:** ${activeScenario ? 'TIER 2 — SYSTEM CONTINGENCY' : 'TIER 0 — ROUTINE HEALTH LOG'}
- **Trigger Mode:** ${activeScenario ? activeScenario.toUpperCase() : 'NO FAULT DETECTED'}

### Subsystem Impact Analysis
- **Coupled Effects:** Generator thermal-viscosity feedback, building thermal decay rate, and science payload buffering.
- **Affected Units:** Primary Diesel Generator, Hydronic Loop Node 2, Secondary Lab Heating.
- **Root Cause Assessment:** Multi-physics parameter divergence simulated via stochastic distribution (Log-Normal onset).

### Corrective Action Taken / SOP Executed
- Executed Standard Operating Procedure SOP-${activeScenario === 'blizzard_gen_fail' ? '01' : activeScenario === 'cooling_leak' ? '03' : '05'}.
- Switched auxiliary bypass loop and verified thermal envelope stabilization.

### Watch Notes
${operatorNotes}
`;
    }

    if (selectedTemplate === 'weekly_summary') {
      return `${header}
## 3. WEEKLY STATION RESILIENCE & LOGISTICS SUMMARY
- **Station Reserve Days:** 78.4 Days Fuel · 92.0 Days Water
- **Power Generation:** 10,780 kWh generated this period
- **Renewable Contribution:** 18.4% (Wind + Solar PV)
- **Science Data Downlinked:** 32.6 GB transmitted to NCPOR Goa
- **Buffer Retention Health:** 100% integrity, 0 frame drops

### Summary Notes
${operatorNotes}
`;
    }

    return `${header}
## 4. DETAILED ENGINEERING LOG
- Multi-physics engine state vector logged successfully.
${operatorNotes}
`;
  };

  const reportMarkdown = generateReportMarkdown();

  const handleDownloadMarkdown = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ANTARCTIC_SENTINEL_${station.toUpperCase()}_REPORT_${selectedTemplate.toUpperCase()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Mission Report Generator & Shift Logs
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Institutional operational reports, watch handovers, incident investigations, and printable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-2.5 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Download .md
          </button>
          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-[12px] font-medium text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Template Selection & Controls */}
        <div className="space-y-4">
          {/* A. TEMPLATE SELECTOR */}
          <div className="card-polar p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <FileText className="w-4 h-4 text-[var(--primary)]" />
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                A. Report Template Selection
              </h3>
            </div>

            <div className="space-y-2">
              {[
                { id: 'shift_handover', name: 'Shift Handover Watch Log', desc: 'Active metrics, power, fuel, thermal & watch handover signature block.' },
                { id: 'incident', name: 'Incident & Anomaly Assessment', desc: 'Root-cause evaluation, coupled cascade impact, and SOP actions.' },
                { id: 'weekly_summary', name: 'Weekly Station Resilience Summary', desc: 'Fuel autonomy, renewable ratio, science payload uptime, and logistics.' },
                { id: 'maintenance', name: 'Maintenance & Asset Lifecycle Log', desc: 'Running hours, Archard wear status, and deferred inspection backlog.' },
                { id: 'science', name: 'Scientific Research Data Report', desc: 'Payload health, cryo storage, and telemetry bandwidth allocation.' }
              ].map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id as ReportTemplate)}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    selectedTemplate === tpl.id 
                      ? 'border-[var(--primary)] bg-[var(--surface-subtle)] shadow-xs' 
                      : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)]'
                  }`}
                >
                  <div className="text-[12px] font-medium text-[var(--text-primary)]">{tpl.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{tpl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Remarks Form */}
          <div className="card-polar p-4 space-y-2">
            <h4 className="text-[12px] font-semibold text-[var(--text-primary)]">
              Watch Officer Remarks / Custom Observations
            </h4>
            <textarea
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              rows={4}
              className="w-full text-[12px] font-mono p-2 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--primary)]"
              placeholder="Enter custom observations, EVA notes, or anomalies..."
            />
            <span className="text-[10px] text-[var(--text-muted)] block">
              Notes are dynamically compiled into the Markdown and Print views.
            </span>
          </div>

          {/* B. REPORT METADATA */}
          <div className="card-polar p-3 bg-[var(--surface-subtle)] space-y-2 font-mono text-[11px]">
            <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Report Generation Context</div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Engine Seed:</span>
              <span className="text-[var(--text-primary)]">{sessionSeed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Engine Version:</span>
              <span className="text-[var(--text-primary)]">{simEngineVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Integration Mode:</span>
              <span className="text-[var(--text-primary)]">Coupled RK4 1 Hz</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-emerald-700">
              <span>Reproducibility:</span>
              <span>100% Deterministic</span>
            </div>
          </div>
        </div>

        {/* Right Column: B. Content Preview & Render */}
        <div className="card-polar p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2.5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                B. Live Formatted Document Preview
              </h3>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
              AUDIT READY
            </span>
          </div>

          {/* Formatted Markdown Render Container */}
          <div className="bg-[var(--surface-subtle)] border border-[var(--border)] rounded-md p-5 text-[12px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-[var(--text-primary)] max-h-[700px] overflow-y-auto">
            {reportMarkdown}
          </div>
        </div>
      </div>
    </div>
  );
};
