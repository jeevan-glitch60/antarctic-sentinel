import React from 'react';
import { useStation } from '../context/StationContext';
import { 
  Radio, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ConnectivityPage: React.FC = () => {
  const { 
    station, 
    stationData, 
    connectivity, 
    simulateConnectionLoss, 
    restoreConnection, 
    telemetryHistory,
    addAuditLog
  } = useStation();

  const isNominal = connectivity.primaryLink.status === 'Nominal';
  const isOffline = connectivity.primaryLink.status === 'Offline';

  const handleModeChange = (mode: string) => {
    addAuditLog('Control', 'Resilience Mode Changed', `Switched to ${mode} mode`);
  };

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Connectivity Resilience & Edge Buffering
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Polar satellite uplink telemetry integrity, low-elevation tracking, and store-and-forward edge failover.
          </p>
        </div>

        {/* Link Status Chip */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded font-mono text-[11px] border flex items-center gap-1.5 ${
            isNominal
              ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success-soft)]'
              : isOffline
                ? 'border-[var(--critical)] text-[var(--critical)] bg-[var(--critical-soft)]'
                : 'border-[var(--caution)] text-[var(--caution)] bg-[var(--caution-soft)]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isNominal ? 'bg-[var(--success)]' : isOffline ? 'bg-[var(--critical)]' : 'bg-[var(--caution)]'}`} />
            <span>PRIMARY LINK: {connectivity.primaryLink.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* DISRUPTION INJECTION & RESILIENCE CONTROLS */}
      <div className="card-polar p-3 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase text-[var(--text-muted)] mr-1">Simulate Disruptions:</span>
          <button
            onClick={simulateConnectionLoss}
            disabled={isOffline}
            className="px-2.5 py-1.5 rounded-[4px] border border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-soft)] text-[12px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Trigger Polar Ionospheric Blackout</span>
          </button>

          <button
            onClick={restoreConnection}
            className="px-2.5 py-1.5 rounded-[4px] border border-[var(--success)] text-[var(--success)] hover:bg-[var(--success-soft)] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Nominal Uplink</span>
          </button>
        </div>

        {/* Resilience Mode Presets */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">Mode:</span>
          {(['Full Stream', 'Low-Bandwidth Essential', 'Store & Forward'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-2 py-1 rounded-[4px] border text-[11px] font-mono transition-colors ${
                connectivity.resilienceMode === mode
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                  : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* THREE PRIMARY RESILIENCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: Primary Satellite Link (GSAT-7A) */}
        <div className="card-polar p-3.5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <div>
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Primary Carrier</div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                {connectivity.primaryLink.type}
              </h3>
            </div>
            <Radio className="w-5 h-5 text-[var(--accent)] stroke-[1.5]" />
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Link Status</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.primaryLink.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Uplink Latency</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.primaryLink.latencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Packet Loss</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.primaryLink.packetLossPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Signal SNR</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.primaryLink.signalSnrDb} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Transponder Band</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.primaryLink.frequencyGhz} GHz C-Band</span>
            </div>
          </div>
        </div>

        {/* Card 2: Secondary Satellite Fallback (Iridium Polar Mesh) */}
        <div className="card-polar p-3.5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <div>
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Secondary Burst Link</div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                {connectivity.secondaryLink.type}
              </h3>
            </div>
            <Wifi className="w-5 h-5 text-[var(--text-muted)] stroke-[1.5]" />
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Constellation State</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.secondaryLink.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Orbital Pass Latency</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.secondaryLink.latencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Redundancy Mechanism</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">Low Earth Orbit Mesh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Payload Profile</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">Telemetry Packets & Emergency SOS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Autonomous Handover</span>
              <span className="font-mono text-[var(--success)] font-medium">Armed (0.4s switchover)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Local NVMe Store & Forward Edge Buffer */}
        <div className="card-polar p-3.5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <div>
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Zero-Data-Loss Architecture</div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                NVMe Store-and-Forward Buffer
              </h3>
            </div>
            <HardDrive className="w-5 h-5 text-[var(--accent)] stroke-[1.5]" />
          </div>

          <div className="space-y-2 text-[12px]">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[var(--text-secondary)]">Ring Buffer Capacity</span>
                <span className="font-mono font-medium text-[var(--text-primary)]">
                  {connectivity.edgeBuffer.fillPercentage}% ({connectivity.edgeBuffer.usedCapacityMb} MB / {connectivity.edgeBuffer.maxCapacityMb} MB)
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${connectivity.edgeBuffer.fillPercentage > 50 ? 'bg-[var(--critical)]' : 'bg-[var(--accent)]'}`}
                  style={{ width: `${connectivity.edgeBuffer.fillPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Queued Offline Records</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{connectivity.edgeBuffer.queuedRecords} records</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Buffer State</span>
              <span className="font-mono text-[var(--text-primary)]">{connectivity.edgeBuffer.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Last Flush Timestamp</span>
              <span className="font-mono text-[var(--text-muted)]">{connectivity.edgeBuffer.lastFlushTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* LINK MARGIN & PACKET LOSS CHART */}
      <div className="card-polar p-3.5 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Polar Tracking Elevation & Link Latency History</h4>
            <div className="text-[11px] text-[var(--text-muted)]">Real-time carrier drift under atmospheric scintillation and snow storm attenuation.</div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-[#2C5F8A]">● Latency (ms)</span>
            <span className="text-[#B4611F]">● Packet Loss (%)</span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="commLatencyMs" name="Latency" stroke="#2C5F8A" fill="#2C5F8A" fillOpacity={0.12} strokeWidth={1.5} isAnimationActive={false} />
              <Area type="monotone" dataKey="packetLossPct" name="Packet Loss" stroke="#B4611F" fill="#B4611F" fillOpacity={0.15} strokeWidth={1.5} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEPTH PANELS: ANTENNA POINTING DIAL & DOPPLER SHIFT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Antenna Pointing Dial */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Radome Gimbal Pointing</h4>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">SERVO LOCKED</span>
          </div>
          <div className="flex items-center justify-center p-3">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Compass Ring */}
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="80" cy="80" r="45" fill="none" stroke="var(--border)" strokeWidth="0.8" />
              <circle cx="80" cy="80" r="20" fill="none" stroke="var(--border)" strokeWidth="0.8" />
              {/* Azimuth Crosshairs */}
              <line x1="80" y1="10" x2="80" y2="150" stroke="var(--border)" strokeWidth="0.8" />
              <line x1="10" y1="80" x2="150" y2="80" stroke="var(--border)" strokeWidth="0.8" />
              <text x="80" y="8" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-muted)">N (0°)</text>
              <text x="80" y="158" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-muted)">S (180°)</text>
              <text x="156" y="83" fontSize="8" fontFamily="monospace" fill="var(--text-muted)">E</text>
              <text x="4" y="83" fontSize="8" fontFamily="monospace" fill="var(--text-muted)">W</text>
              {/* Current Pointing Vector (Az: 342°, El: 14.8°) */}
              <line x1="80" y1="80" x2="70" y2="24" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="70" cy="24" r="3.5" fill="var(--accent)" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px] font-mono bg-[var(--surface-subtle)] p-2 rounded border border-[var(--border)] text-center">
            <div>Azimuth: <span className="font-semibold text-[var(--text-primary)]">342.1°</span></div>
            <div>Elevation: <span className="font-semibold text-[var(--text-primary)]">14.8°</span></div>
          </div>
        </div>

        {/* Doppler Shift Simulation */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">LEO Doppler Shift Tracking</h4>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">IRIDIUM / NOAA</span>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            Relative orbital velocity introduces carrier frequency offset during polar overhead passes:
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Carrier Frequency:</span>
              <span className="text-[var(--text-primary)]">1,626.5 MHz (L-Band)</span>
            </div>
            <div className="flex justify-between">
              <span>Current Doppler Δf:</span>
              <span className="text-emerald-700 font-semibold">+34.8 kHz (Approaching)</span>
            </div>
            <div className="flex justify-between">
              <span>Max Δf Rate:</span>
              <span className="text-[var(--text-primary)]">420 Hz / sec</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>AFC Tracking Loop:</span>
              <span className="text-emerald-600 font-semibold">LOCKED (&lt;5 Hz error)</span>
            </div>
          </div>
        </div>

        {/* Store-and-Forward Integrity & Blackout Forecast */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Integrity &amp; Blackout Window</h4>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">100% VERIFIED</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Upcoming Blackout Window</span>
              <div className="text-[12px] font-semibold text-amber-700">03:40 – 04:15 UTC (35 min)</div>
              <p className="text-[10px] text-[var(--text-secondary)] font-sans">
                Geomagnetic absorption zone pass; automatic store-and-forward buffering queued.
              </p>
            </div>
            <div className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Cryptographic Audit</span>
              <div className="text-[10px] text-[var(--text-primary)] truncate">SHA-256: 8f4e2c9...b140</div>
              <div className="text-emerald-700 text-[10px]">0 dropped frames · 12,480 packets buffered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
