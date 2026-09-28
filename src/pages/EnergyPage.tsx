import React from 'react';
import { useStation } from '../context/StationContext';
import { 
  Zap, 
  Flame, 
  Sun, 
  Wind, 
  BatteryCharging, 
  Droplet, 
  Gauge, 
  ArrowUpRight, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const EnergyPage: React.FC = () => {
  const { station, stationData, currentTelemetry, telemetryHistory } = useStation();
  const isMaitri = station === 'MAITRI';

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Energy Microgrid & Resource Management
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Hybrid polar generation tracking: diesel-electric, solar photovoltaic, wind turbine, and BESS storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            Grid Configuration: 415V 50Hz 3-Phase Polar Bus
          </div>
        </div>
      </div>

      {/* GENERATION SOURCE CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Diesel Generation */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[var(--warning)]" />
              Diesel Generators
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">40% Share</span>
          </div>
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Active Output</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">420 kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Units Online</span>
              <span className="font-mono text-[var(--text-primary)]">1 of 3 (Gen 01)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Burn Rate</span>
              <span className="font-mono text-[var(--text-primary)]">{currentTelemetry.fuelBurnRateLph} L/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Specific Fuel Cons.</span>
              <span className="font-mono text-[var(--text-primary)]">218 g/kWh</span>
            </div>
          </div>
        </div>

        {/* Solar PV Generation */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[var(--accent)]" />
              Solar PV Arrays
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">35% Share</span>
          </div>
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Current Output</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">{isMaitri ? '320 kW' : '410 kW'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Irradiance</span>
              <span className="font-mono text-[var(--text-primary)]">680 W/m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Array Tilt Angle</span>
              <span className="font-mono text-[var(--text-primary)]">65° Polar Optimal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Albedo Gain</span>
              <span className="font-mono text-[var(--success)] font-medium">+18% Snow Reflection</span>
            </div>
          </div>
        </div>

        {/* Wind Turbines */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[var(--success)]" />
              Wind Turbines
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">25% Share</span>
          </div>
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Current Output</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">{isMaitri ? '180 kW' : '230 kW'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Hub Wind Speed</span>
              <span className="font-mono text-[var(--text-primary)]">{currentTelemetry.windSpeed} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Turbine Status</span>
              <span className="font-mono text-[var(--success)]">Nominal (3 Online)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Cut-Out Wind Limit</span>
              <span className="font-mono text-[var(--text-muted)]">35 m/s Feathered</span>
            </div>
          </div>
        </div>

        {/* Battery Storage (BESS) */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-[var(--accent)]" />
              BESS Battery
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">500 kWh</span>
          </div>
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">State of Charge (SOC)</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">{currentTelemetry.batteryChargePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">DC Bus Voltage</span>
              <span className="font-mono text-[var(--text-primary)]">{currentTelemetry.batteryVoltageV} V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">State of Health (SOH)</span>
              <span className="font-mono text-[var(--success)]">98.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Thermal Jacket</span>
              <span className="font-mono text-[var(--text-primary)]">+21°C Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* FUEL & WATER CONSUMPTION DUAL SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Left: Fuel Reserves & Storage Bunds */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Polar Fuel Reserves & Storage Bunds
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Arctic Grade Diesel P-54 (-50°C cloud point).
              </p>
            </div>
            <span className="font-mono text-[12px] text-[var(--caution)] font-semibold">
              {currentTelemetry.fuelLevelLiters.toLocaleString()} L / 20,000 L (62%)
            </span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--caution)]" style={{ width: '62%' }} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Normal Endurance</div>
                <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">28.4 Days</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">At 18.2 L/h baseline load</div>
              </div>

              <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Blizzard Burn Endurance</div>
                <div className="text-[16px] font-mono font-semibold text-[var(--warning)] mt-0.5">8.0 Days</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">At peak 34.0 L/h storm load</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Water Generation & Snow Melters */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Potable Water System & Heat Recovery
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {isMaitri ? 'Priyadarshini trace-heated pipeline & snow melter' : 'Dual-stage seawater RO desalinator'}
              </p>
            </div>
            <span className="font-mono text-[12px] text-[var(--success)] font-semibold">
              8,400 L / 10,000 L (84%)
            </span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--success)]" style={{ width: '84%' }} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Daily Production</div>
                <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">3,200 L / Day</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">86% Combined Heat Recovery</div>
              </div>

              <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Per Capita Consumption</div>
                <div className="text-[16px] font-mono font-semibold text-[var(--text-primary)] mt-0.5">120 L / Day</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">25 Overwintering Crew</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME GENERATION VS CONSUMPTION POWER MIX CHART */}
      <div className="card-polar p-3.5 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-[13px] font-medium text-[var(--text-primary)]">Real-Time Power Demand vs Heat Exchanger Recovery</h4>
            <div className="text-[11px] text-[var(--text-muted)]">Dynamic load balancing across microgrid buses.</div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-[#2C5F8A]">● Total Power (kW)</span>
            <span className="text-[#B4611F]">● Heating Demand (kW)</span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="timeFormatted" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="totalPowerKw" name="Grid Total" stroke="#2C5F8A" fill="#2C5F8A" fillOpacity={0.12} strokeWidth={1.5} isAnimationActive={false} />
              <Area type="monotone" dataKey="heatingDemandKw" name="Heat Loop" stroke="#B4611F" fill="#B4611F" fillOpacity={0.15} strokeWidth={1.5} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEPTH SECTIONS: GRID FREQUENCY & HARMONICS / LOAD SHEDDING / BLACK START */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Grid Quality & Harmonics */}
        <div className="card-polar p-3.5 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Grid Frequency &amp; Harmonics</h4>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">IEEE 519 NOMINAL</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Bus Frequency:</span>
              <span className="text-[var(--text-primary)] font-semibold">50.02 Hz (±0.04 Hz)</span>
            </div>
            <div className="flex justify-between">
              <span>Line-to-Line Voltage:</span>
              <span className="text-[var(--text-primary)] font-semibold">415.4 V RMS</span>
            </div>
            <div className="flex justify-between">
              <span>Total Harmonic Distortion:</span>
              <span className="text-emerald-700 font-semibold">THD 1.8% (&lt;5% limit)</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Dominant Harmonics:</span>
              <span>3rd: 0.9% · 5th: 0.6% · 7th: 0.3%</span>
            </div>
          </div>
        </div>

        {/* Load Shedding Priority Ladder */}
        <div className="card-polar p-3.5 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Automatic Load Shedding Ladder</h4>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">4 TIERS ARMED</span>
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex justify-between">
              <span>Tier 1 (Guaranteed):</span>
              <span>Life Support, Medical, Habitat HVAC</span>
            </div>
            <div className="p-1.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex justify-between">
              <span>Tier 2 (Priority):</span>
              <span>Satcom Terminal, Met Sensors</span>
            </div>
            <div className="p-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex justify-between">
              <span>Tier 3 (Curtailable):</span>
              <span>FTIR Spectrometer, Water RO Plant</span>
            </div>
            <div className="p-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex justify-between">
              <span>Tier 4 (Shed First):</span>
              <span>Vehicle Workshop Heating, Sauna</span>
            </div>
          </div>
        </div>

        {/* Black Start Contingency Simulation */}
        <div className="card-polar p-3.5 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Black Start Sequence Verification</h4>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">TESTED 2026-08</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Autonomous dead-bus restoration path in case of complete station trip:
          </p>
          <div className="space-y-1 text-[10px] font-mono bg-[var(--surface-subtle)] p-2 rounded border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span>✓ Step 1:</span> 24V DC battery bank energizes compressed air valves
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span>✓ Step 2:</span> DG-1 pneumatically cranked to 1,500 RPM (12 s)
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span>✓ Step 3:</span> AVR locks excitation at 415V; Tier-1 bus closed
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span>✓ Step 4:</span> BESS inverter synchronizes to form stiff microgrid
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
