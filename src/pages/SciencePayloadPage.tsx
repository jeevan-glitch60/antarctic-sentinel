import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Atom, 
  Database, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  HardDrive, 
  Flame, 
  Thermometer, 
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  principalInvestigator: string;
  institute: string;
  category: string;
  status: 'nominal' | 'degraded' | 'offline' | 'queued';
  powerNominalW: number;
  powerActualW: number;
  thermalReqC: string;
  bandwidthKbps: number;
  dataAcquiredGbToday: number;
  bufferOccupancyPct: number;
  criticality: 'High' | 'Medium' | 'Low';
  failureImpact: string;
  dataLossCostPerHr: string;
}

export const SciencePayloadPage: React.FC = () => {
  const { station, stationData, multiPhysicsState, activeScenario } = useStation();

  const [selectedExperiment, setSelectedExperiment] = useState<string>('EXP-01');
  const [dataThrottlingStrategy, setDataThrottlingStrategy] = useState<'fair-share' | 'priority-first' | 'store-all'>('priority-first');

  const experiments: Experiment[] = [
    {
      id: 'EXP-01',
      name: 'High-Resolution FTIR Atmospheric Trace Gas Spectrometer',
      principalInvestigator: 'Dr. S. K. Mukherjee',
      institute: 'NCPOR / IIT Roorkee',
      category: 'Atmospheric Physics',
      status: activeScenario === 'grid_instability' || activeScenario === 'cooling_leak' ? 'degraded' : 'nominal',
      powerNominalW: 420,
      powerActualW: activeScenario === 'grid_instability' ? 290 : 420,
      thermalReqC: '18°C to 22°C (Cryo detector -196°C)',
      bandwidthKbps: 64,
      dataAcquiredGbToday: 1.84,
      bufferOccupancyPct: 38,
      criticality: 'High',
      failureImpact: 'Detector drift requires 14-hour liquid nitrogen recooling and baseline re-calibration.',
      dataLossCostPerHr: '12 hrs observation gap; $3,200 re-run cost'
    },
    {
      id: 'EXP-02',
      name: 'Broadband Digital Triaxial Seismometer Array',
      principalInvestigator: 'Dr. P. R. Joshi',
      institute: 'NGRI Hyderabad',
      category: 'Geophysics & Seismology',
      status: 'nominal',
      powerNominalW: 65,
      powerActualW: 65,
      thermalReqC: '-10°C to +30°C (Vault stabilized)',
      bandwidthKbps: 16,
      dataAcquiredGbToday: 0.42,
      bufferOccupancyPct: 12,
      criticality: 'High',
      failureImpact: 'Antarctic micro-seismicity waveform disruption; cannot interpolate missing time series.',
      dataLossCostPerHr: 'Permanent void in global IRIS seismograph network'
    },
    {
      id: 'EXP-03',
      name: 'Continuous Geomagnetic Fluxgate Magnetometer',
      principalInvestigator: 'Prof. A. Sengupta',
      institute: 'IIG Mumbai',
      category: 'Geomagnetism & Space Weather',
      status: multiPhysicsState.comms.link_state === 'Offline' ? 'degraded' : 'nominal',
      powerNominalW: 45,
      powerActualW: 45,
      thermalReqC: 'Constant ±0.5°C non-magnetic housing',
      bandwidthKbps: 8,
      dataAcquiredGbToday: 0.19,
      bufferOccupancyPct: multiPhysicsState.comms.link_state === 'Offline' ? 68 : 18,
      criticality: 'High',
      failureImpact: 'Space weather storm baseline loss during auroral substorm events.',
      dataLossCostPerHr: 'Real-time alert disruption to ISRO space operations'
    },
    {
      id: 'EXP-04',
      name: 'Aerosol Chemical Mass Spectrometer & CCN Counter',
      principalInvestigator: 'Dr. V. Ramanathan',
      institute: 'SPL / VSSC Thiruvananthapuram',
      category: 'Aerosol & Climate',
      status: activeScenario === 'blizzard_gen_fail' ? 'degraded' : 'nominal',
      powerNominalW: 850,
      powerActualW: activeScenario === 'blizzard_gen_fail' ? 510 : 850,
      thermalReqC: 'Heated inlet tube (+15°C) to prevent riming',
      bandwidthKbps: 32,
      dataAcquiredGbToday: 2.15,
      bufferOccupancyPct: 44,
      criticality: 'Medium',
      failureImpact: 'Heated inlet freezes if auxiliary power drops below 300W in blizzard.',
      dataLossCostPerHr: 'Inlet de-icing failure causes 48-hr sample blockage'
    },
    {
      id: 'EXP-05',
      name: 'Cosmic Ray Neutron Monitor (6-NM-64)',
      principalInvestigator: 'Dr. M. S. Pathak',
      institute: 'PRL Ahmedabad',
      category: 'Astrophysics & Solar-Terrestrial',
      status: 'nominal',
      powerNominalW: 110,
      powerActualW: 110,
      thermalReqC: '+10°C to +25°C counter enclosure',
      bandwidthKbps: 4,
      dataAcquiredGbToday: 0.09,
      bufferOccupancyPct: 9,
      criticality: 'Medium',
      failureImpact: 'Forbush decrease detection latency during solar energetic particle events.',
      dataLossCostPerHr: 'Delayed GLE (Ground Level Enhancement) warning'
    },
    {
      id: 'EXP-06',
      name: 'Microbial Extremophile Cryo-Incubation System',
      principalInvestigator: 'Dr. K. Jayasree',
      institute: 'NCPOR / Goa University',
      category: 'Polar Biology',
      status: multiPhysicsState.zones.lab.air_temp_c < 14 ? 'degraded' : 'nominal',
      powerNominalW: 240,
      powerActualW: 240,
      thermalReqC: 'Precise +4.0°C and -20.0°C chambers',
      bandwidthKbps: 2,
      dataAcquiredGbToday: 0.05,
      bufferOccupancyPct: 6,
      criticality: 'Low',
      failureImpact: 'Bacterial culture defrosting if lab thermal decay persists > 6 hours.',
      dataLossCostPerHr: 'Irreversible loss of 6-month slow-growth psychrophile cultures'
    }
  ];

  const totalSciencePower = experiments.reduce((acc, e) => acc + e.powerActualW, 0);
  const totalDailyGb = experiments.reduce((acc, e) => acc + e.dataAcquiredGbToday, 0).toFixed(2);
  const activeExp = experiments.find(e => e.id === selectedExperiment) || experiments[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Scientific Payloads & Research Continuity
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Real-time payload health, power and thermal envelope monitoring, fault impact attribution, and telemetry data pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            PAYLOAD LOAD: {totalSciencePower} W
          </span>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            DAILY ACQUISITION: {totalDailyGb} GB
          </span>
        </div>
      </div>

      {/* A. ACTIVE EXPERIMENTS REGISTER */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              A. Active Scientific Instrument Envelopes
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Active instruments across Atmospheric Physics, Seismology, Geomagnetism, and Cryobiology.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            {experiments.filter(e => e.status === 'nominal').length} / {experiments.length} NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {experiments.map((exp) => (
            <div 
              key={exp.id}
              onClick={() => setSelectedExperiment(exp.id)}
              className={`p-3 rounded border text-left cursor-pointer transition-all ${
                selectedExperiment === exp.id 
                  ? 'border-[var(--primary)] bg-[var(--surface-subtle)] shadow-xs' 
                  : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)]'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] block">{exp.id} · {exp.category}</span>
                  <span className="text-[12px] font-medium text-[var(--text-primary)] line-clamp-1">{exp.name}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                  exp.status === 'nominal' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {exp.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-2 pt-2 border-t border-[var(--border)] text-[var(--text-secondary)]">
                <div>Power: <span className="text-[var(--text-primary)]">{exp.powerActualW}W</span> / {exp.powerNominalW}W</div>
                <div>Bandwidth: <span className="text-[var(--text-primary)]">{exp.bandwidthKbps} kbps</span></div>
                <div>Daily Data: <span className="text-[var(--text-primary)]">{exp.dataAcquiredGbToday} GB</span></div>
                <div>Buffer: <span className={exp.bufferOccupancyPct > 50 ? 'text-amber-600 font-semibold' : 'text-[var(--text-primary)]'}>{exp.bufferOccupancyPct}%</span></div>
              </div>

              <div className="mt-2 text-[10px] text-[var(--text-muted)] truncate">
                PI: {exp.principalInvestigator} ({exp.institute})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL INSPECTION & B. IMPACT ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Selected Experiment Deep Dive */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <Atom className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Instrument Telemetry & Envelope: {activeExp.id}
            </h3>
          </div>

          <div className="space-y-2.5 text-[12px]">
            <div>
              <span className="text-[11px] text-[var(--text-muted)] block">Instrument Name</span>
              <span className="font-medium text-[var(--text-primary)]">{activeExp.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)] font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Criticality Tier</span>
                <span className={`font-semibold ${activeExp.criticality === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>
                  TIER {activeExp.criticality.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Sponsor Institute</span>
                <span className="text-[var(--text-primary)]">{activeExp.institute}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Thermal Window</span>
                <span className="text-[var(--text-primary)]">{activeExp.thermalReqC}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Lab Zone</span>
                <span className="text-[var(--text-primary)]">Lab Zone 1 ({multiPhysicsState.zones.lab.air_temp_c.toFixed(1)}°C)</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                Interruption & Recovery Vulnerability:
              </div>
              <p className="text-[11px] leading-relaxed">{activeExp.failureImpact}</p>
              <div className="font-mono text-[10px] text-amber-900 pt-1 border-t border-amber-500/20">
                Data Interruption Cost: {activeExp.dataLossCostPerHr}
              </div>
            </div>
          </div>
        </div>

        {/* B. FAULT-TO-EXPERIMENT CASCADE MATRIX */}
        <div className="card-polar p-4 space-y-3 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                B. Fault-to-Science Cascade Correlation Matrix
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Simulated cross-system impact: how station infrastructure disruptions propagate to scientific observations.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              ACTIVE FAULT: {activeScenario ? activeScenario.toUpperCase() : 'NONE (STATION NOMINAL)'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-left bg-[var(--surface-subtle)]">
                  <th className="py-2 px-2.5 font-medium">Fault Mode</th>
                  <th className="py-2 px-2.5 font-medium">Primary Mechanism</th>
                  <th className="py-2 px-2.5 font-medium">Direct Science Impact</th>
                  <th className="py-2 px-2.5 font-medium">Affected Payloads</th>
                  <th className="py-2 px-2.5 font-medium">Data Cost Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr className={activeScenario === 'blizzard_gen_fail' ? 'bg-amber-500/10 font-semibold' : ''}>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">DG1 Trip / Power Shedding</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">Grid voltage dip & Tier-3 shedding</td>
                  <td className="py-2 px-2.5 text-amber-700">Aerosol spectrometer inlet heating cutoff</td>
                  <td className="py-2 px-2.5">EXP-04, EXP-06</td>
                  <td className="py-2 px-2.5 text-rose-600">48h defrost void</td>
                </tr>
                <tr className={activeScenario === 'cooling_leak' ? 'bg-amber-500/10 font-semibold' : ''}>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">Hydronic Glycol Leak</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">Lab room temperature decay (&lt;14°C)</td>
                  <td className="py-2 px-2.5 text-amber-700">FTIR spectrometer baseline drift</td>
                  <td className="py-2 px-2.5">EXP-01, EXP-06</td>
                  <td className="py-2 px-2.5 text-amber-700">14h re-calibration</td>
                </tr>
                <tr className={activeScenario === 'fuel_gel' ? 'bg-amber-500/10 font-semibold' : ''}>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">Fuel Viscosity Gelling</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">Generator starvation & frequency swing</td>
                  <td className="py-2 px-2.5 text-rose-700">Emergency load shedding of all lab circuits</td>
                  <td className="py-2 px-2.5">EXP-01, 04, 05, 06</td>
                  <td className="py-2 px-2.5 text-rose-600">Complete pause</td>
                </tr>
                <tr className={multiPhysicsState.comms.link_state === 'Offline' ? 'bg-amber-500/10 font-semibold' : ''}>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">Satcom Deep Fade (12h+)</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">Satellite line-of-sight blackout</td>
                  <td className="py-2 px-2.5 text-amber-700">Local SSD buffer fills &gt;80%</td>
                  <td className="py-2 px-2.5">EXP-01, EXP-03</td>
                  <td className="py-2 px-2.5 text-amber-700">FIFO packet drop</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* C. DATA PIPELINE ARCHITECTURE & STORE-AND-FORWARD */}
      <div className="card-polar p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              C. Telemetry & Science Data Acquisition Pipeline
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              End-to-end data transmission path from Antarctic instrument transducers through station flash buffer to NCPOR HQ Goa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)]">Downlink Policy:</span>
            <div className="inline-flex rounded border border-[var(--border)] p-0.5 bg-[var(--surface-subtle)] text-[11px]">
              {(['priority-first', 'fair-share', 'store-all'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setDataThrottlingStrategy(p)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    dataThrottlingStrategy === p 
                      ? 'bg-[var(--surface)] text-[var(--primary)] font-medium shadow-xs' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {p.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Stage Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-primary)]">
              <span className="flex items-center gap-1.5"><Atom className="w-3.5 h-3.5 text-blue-600" /> 1. Sensor Capture</span>
              <span className="font-mono text-emerald-600 text-[10px]">100% ONLINE</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
              <div>Sample Rate: 100 Hz / 1 Hz</div>
              <div>Daily Rate: 4.65 GB/day</div>
              <div>Loss at Sensor: 0.00%</div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--border)] pt-1">
              ADC digitized & timestamped via GPS disciplined oscillator (1PPS).
            </div>
          </div>

          <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-primary)]">
              <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-amber-600" /> 2. Station Local Buffer</span>
              <span className="font-mono text-amber-600 text-[10px]">{multiPhysicsState.comms.buffer_occupancy_mb.toFixed(0)} MB</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
              <div>Flash Storage: 2.0 TB NVMe</div>
              <div>Retention Limit: 45 Days</div>
              <div>Integrity: SHA-256 Verified</div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--border)] pt-1">
              Resilient store-and-forward queue handles satellite blackouts up to 21 days.
            </div>
          </div>

          <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-primary)]">
              <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-purple-600" /> 3. Satellite Uplink</span>
              <span className="font-mono text-emerald-600 text-[10px]">{multiPhysicsState.comms.link_state.toUpperCase()}</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
              <div>Bandwidth: 128 kbps (Burst 512)</div>
              <div>SNR: {multiPhysicsState.comms.snr_db.toFixed(1)} dB</div>
              <div>Packet Loss: {multiPhysicsState.comms.packet_loss_pct.toFixed(1)}%</div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--border)] pt-1">
              GSAT-7A / Intelsat C-band steerable radome antenna tracking at {multiPhysicsState.comms.antenna_el_deg.toFixed(1)}° El.
            </div>
          </div>

          <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-primary)]">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-600" /> 4. HQ Data Center</span>
              <span className="font-mono text-emerald-600 text-[10px]">NCPOR GOA</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
              <div>Sync Latency: {multiPhysicsState.comms.latency_ms} ms</div>
              <div>Ingestion Status: OK</div>
              <div>Open Polar Archives: Synced</div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--border)] pt-1">
              Direct pipeline to National Centre for Polar & Ocean Research servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
