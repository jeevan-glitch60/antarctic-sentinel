import React, { useState, useMemo } from 'react';
import { useStation } from '../context/StationContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Filter, 
  Activity, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

export const TelemetryPage: React.FC = () => {
  const { 
    station, 
    stationData, 
    telemetryHistory, 
    currentTelemetry, 
    isStreaming, 
    setIsStreaming, 
    resetStream, 
    components 
  } = useStation();

  const [timeframe, setTimeframe] = useState<'1H' | '6H' | '24H' | '7D' | '30D'>('1H');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');

  // Custom institutional research tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-2 rounded shadow-sm text-[12px] font-mono select-none">
          <div className="text-[var(--text-muted)] text-[10px] mb-1">{label} UTC</div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetryHistory, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `telemetry_${station}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = Object.keys(telemetryHistory[0] || {}).join(',');
      const rows = telemetryHistory.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(`${headers}\n${rows}`);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", csvContent);
      downloadAnchor.setAttribute("download", `telemetry_${station}_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Live Telemetry
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--accent)] font-medium">
              {stationData.name} ({stationData.code})
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Real-time simulated operating data from station infrastructure and environment sensors.
          </p>
        </div>

        {/* Persistent Data Source Badge */}
        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            Data Source: Simulated Station Telemetry
          </div>
        </div>
      </div>

      {/* STREAM CONTROLS & TIMEFRAME TOOLBAR */}
      <div className="card-polar p-2.5 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        {/* Stream Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-[4px] border flex items-center gap-1.5 font-medium transition-colors ${
              isStreaming
                ? 'border-[var(--caution)] bg-[var(--caution-soft)] text-[var(--caution)]'
                : 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume stream</span>
              </>
            )}
          </button>

          <button
            onClick={resetStream}
            className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset buffer</span>
          </button>

          {/* Equipment Filter Selector */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--border)]">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Sensor Scope:</span>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Subsystems (Grid & Climate)</option>
              {components.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeframe Selector & Export Buttons */}
        <div className="flex items-center gap-2">
          {/* Timeframe buttons */}
          <div className="flex border border-[var(--border)] rounded overflow-hidden">
            {(['1H', '6H', '24H', '7D', '30D'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${
                  timeframe === tf
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Export CSV / JSON */}
          <button
            onClick={() => exportData('csv')}
            className="px-2 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3 text-[var(--accent)]" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportData('json')}
            className="px-2 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3 text-[var(--accent)]" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* DATA QUALITY INDICATOR ROW (compact row above charts) */}
      <div className="card-polar px-3 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] gap-y-1">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[var(--text-muted)] font-semibold uppercase">Telemetry Health:</span>
          <span>Freshness: <strong className="text-[var(--text-primary)]">0.8 s</strong></span>
          <span>•</span>
          <span>Msg Rate: <strong className="text-[var(--text-primary)]">12.4 msg/s</strong></span>
          <span>•</span>
          <span>Packet Loss: <strong className="text-[var(--text-primary)]">{currentTelemetry.packetLossPct}%</strong></span>
          <span>•</span>
          <span>Latency: <strong className="text-[var(--text-primary)]">{currentTelemetry.commLatencyMs} ms</strong></span>
          <span>•</span>
          <span>Jitter: <strong className="text-[var(--text-primary)]">14 ms</strong></span>
          <span>•</span>
          <span>Missing Fields: <strong className="text-[var(--text-primary)]">0</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
          <span>Quality score: <strong className="text-[var(--success)]">99.8%</strong></span>
        </div>
      </div>

      {/* 8 DENSE RECHARTS WITH THIN STROKES & MUTED PALETTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Chart 1 — Ambient Temperature & Wind Speed */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Ambient Temperature & Wind Speed</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#2C5F8A]">● Temp (°C)</span>
              <span className="text-[#B0801E]">● Wind (m/s)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ambientTemp" name="Temp" stroke="#2C5F8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="windSpeed" name="Wind" stroke="#B0801E" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 — Atmospheric Pressure & Visibility */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Atmospheric Pressure & Visibility</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#3F7A54]">● Pressure (hPa)</span>
              <span className="text-[#6B4A8A]">● Visibility (km)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="barometricPressure" name="Pressure" stroke="#3F7A54" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="visibilityKm" name="Visibility" stroke="#6B4A8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 — Generator Temperature & Load */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Generator Temperature & Load</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#A3312B]">● Core Temp (°C)</span>
              <span className="text-[#2C5F8A]">● Load (%)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="generatorTemp" name="Gen Temp" stroke="#A3312B" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="generatorLoadPct" name="Load %" stroke="#2C5F8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4 — Fuel Level & Fuel Burn Rate */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Fuel Level & Fuel Burn Rate</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#B0801E]">● Reserve (L)</span>
              <span className="text-[#B4611F]">● Burn Rate (L/h)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="fuelLevelLiters" name="Fuel Reserve" stroke="#B0801E" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="fuelBurnRateLph" name="Burn Rate" stroke="#B4611F" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5 — Battery Charge & Voltage */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Battery State of Charge & Bus Voltage</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#3F7A54]">● SOC (%)</span>
              <span className="text-[#2C5F8A]">● Voltage (V)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="batteryChargePct" name="Charge SOC" stroke="#3F7A54" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="batteryVoltageV" name="Voltage" stroke="#2C5F8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6 — Heating Demand & Total Power Consumption */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Heating Demand & Total Power Grid</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#B4611F]">● Heat (kW)</span>
              <span className="text-[#2C5F8A]">● Grid Total (kW)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="heatingDemandKw" name="Heating Demand" stroke="#B4611F" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="totalPowerKw" name="Grid Power" stroke="#2C5F8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7 — Equipment Vibration (mm/s) */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Equipment Radial Vibration (Turbine Bearings)</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#A3312B]">● Vibration (mm/s) [Threshold: 3.5]</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 8]} stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="equipmentVibrationMms" name="Radial Vibration" stroke="#A3312B" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8 — Communication Latency & Packet Loss */}
        <div className="card-polar p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Polar Satellite Latency & Packet Loss</h4>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#2C5F8A]">● Latency (ms)</span>
              <span className="text-[#B4611F]">● Packet Loss (%)</span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="commLatencyMs" name="RTT Latency" stroke="#2C5F8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="packetLossPct" name="Packet Loss" stroke="#B4611F" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DEPTH SECTIONS: FFT VIBRATION SPECTRUM & CORRELATION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* FFT 8-Band Vibration Spectrum Analysis */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                FFT 8-Band Vibration Frequency Spectrum
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                High-frequency spectral decomposition for predictive bearing defect & misfiring diagnostics.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              ISO 10816-3 CLASS II
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
            {[
              { label: 'Band 1 (1X)', hz: '25 Hz', val: 0.85, role: 'Rotational 1X' },
              { label: 'Band 2 (2X)', hz: '50 Hz', val: 0.42, role: 'Misalignment' },
              { label: 'Band 3 (3X)', hz: '75 Hz', val: 0.31, role: 'Looseness' },
              { label: 'Band 4 (BPFO)', hz: '124 Hz', val: 0.28, role: 'Outer Race' },
              { label: 'Band 5 (BPFI)', hz: '186 Hz', val: 0.22, role: 'Inner Race' },
              { label: 'Band 6 (BSF)', hz: '240 Hz', val: 0.15, role: 'Ball Spin' },
              { label: 'Band 7 (FTF)', hz: '11 Hz', val: 0.08, role: 'Cage Freq' },
              { label: 'Band 8 (HF)', hz: '1-5 kHz', val: 0.12, role: 'Cavitation/Noise' }
            ].map((band, idx) => (
              <div key={band.label} className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-center flex flex-col justify-between">
                <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">{band.label}</span>
                <div className="my-1.5 flex items-end justify-center h-12">
                  <div 
                    className="w-full bg-[var(--accent)] rounded-xs transition-all duration-300"
                    style={{ height: `${Math.min(100, (band.val / 2.0) * 100)}%` }}
                  />
                </div>
                <div className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">{band.val.toFixed(2)}</div>
                <span className="text-[8px] text-[var(--text-muted)] font-mono">{band.hz}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] flex justify-between pt-1">
            <span>Overall RMS: 1.14 mm/s (Good &lt; 2.8 mm/s)</span>
            <span>Sampling: 10 kHz anti-aliased</span>
          </div>
        </div>

        {/* Cross-Sensor Correlation Matrix */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Cross-Sensor Dynamic Correlation Matrix
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Multivariate Pearson correlation coefficients across station physical loops.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              N = 3,600 SAMPLES
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono text-center border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                  <th className="py-1 px-1.5 text-left">Variable</th>
                  <th className="py-1 px-1.5">Amb Temp</th>
                  <th className="py-1 px-1.5">Heat Dem</th>
                  <th className="py-1 px-1.5">Gen Load</th>
                  <th className="py-1 px-1.5">Fuel Burn</th>
                  <th className="py-1 px-1.5">Batt Temp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="py-1 px-1.5 text-left text-[var(--text-primary)] font-medium">Amb Temp</td>
                  <td className="py-1 px-1.5 font-bold">1.00</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/50">-0.94</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/30">-0.88</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/30">-0.87</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/30">+0.62</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-left text-[var(--text-primary)] font-medium">Heat Dem</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/50">-0.94</td>
                  <td className="py-1 px-1.5 font-bold">1.00</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/60">+0.96</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/60">+0.95</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/20">-0.55</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-left text-[var(--text-primary)] font-medium">Gen Load</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/30">-0.88</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/60">+0.96</td>
                  <td className="py-1 px-1.5 font-bold">1.00</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/70">+0.99</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/20">+0.48</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-left text-[var(--text-primary)] font-medium">Fuel Burn</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/30">-0.87</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/60">+0.95</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/70">+0.99</td>
                  <td className="py-1 px-1.5 font-bold">1.00</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/20">+0.45</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-left text-[var(--text-primary)] font-medium">Batt Temp</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/30">+0.62</td>
                  <td className="py-1 px-1.5 text-rose-600 bg-rose-50/20">-0.55</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/20">+0.48</td>
                  <td className="py-1 px-1.5 text-emerald-600 bg-emerald-50/20">+0.45</td>
                  <td className="py-1 px-1.5 font-bold">1.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
            Key Insight: Strong coupling (r = +0.96) validates waste-heat hydronic recovery loop dependency.
          </div>
        </div>
      </div>

      {/* TIME-SERIES DECOMPOSITION & POINT EXPLAINER */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Additive Time-Series Decomposition & Metric Causality Explainer
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Decomposing generator output into structural baseline trend, diurnal schedule seasonality, and stochastic physics residual.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            Y(t) = Trend(t) + Season(t) + Noise(t)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono">
          <div className="p-3 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">1. Structural Trend</span>
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">61.4 kW Mean Baseline</div>
            <p className="text-[var(--text-secondary)] font-sans text-[11px]">
              Slow thermal inertia and steady habitat HVAC base load. Drifts upward by +0.8 kW per week as winter deepens.
            </p>
          </div>

          <div className="p-3 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">2. Diurnal Seasonality</span>
            <div className="text-[13px] font-semibold text-emerald-700">±8.6 kW Diurnal Cycle</div>
            <p className="text-[var(--text-secondary)] font-sans text-[11px]">
              Crew activity peak at 08:00–12:00 UTC (galley, sauna, snow melter) and nighttime setback at 21:00 UTC.
            </p>
          </div>

          <div className="p-3 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">3. Multi-Physics Residual (Noise)</span>
            <div className="text-[13px] font-semibold text-blue-700">σ = ±1.2 kW (Gaussian)</div>
            <p className="text-[var(--text-secondary)] font-sans text-[11px]">
              Turbulent wind gusts hitting building envelope and intermittent compressor cycling on scientific freezers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
