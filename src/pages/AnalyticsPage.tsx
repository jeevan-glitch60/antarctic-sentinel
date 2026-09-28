import React from 'react';
import { useStation } from '../context/StationContext';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { station, stationData } = useStation();

  // Multi-month seasonal fuel burn and temperature comparison
  const seasonalData = [
    { month: 'Jan', fuelBurn: 15.2, avgTemp: -4.2, solarKw: 380 },
    { month: 'Feb', fuelBurn: 16.8, avgTemp: -8.5, solarKw: 320 },
    { month: 'Mar', fuelBurn: 21.4, avgTemp: -14.1, solarKw: 180 },
    { month: 'Apr', fuelBurn: 26.5, avgTemp: -19.4, solarKw: 60 },
    { month: 'May', fuelBurn: 31.2, avgTemp: -24.8, solarKw: 0 },
    { month: 'Jun', fuelBurn: 35.8, avgTemp: -29.2, solarKw: 0 },
    { month: 'Jul', fuelBurn: 38.4, avgTemp: -33.5, solarKw: 0 },
    { month: 'Aug', fuelBurn: 36.1, avgTemp: -31.2, solarKw: 0 },
    { month: 'Sep', fuelBurn: 29.5, avgTemp: -25.4, solarKw: 80 },
    { month: 'Oct', fuelBurn: 23.2, avgTemp: -18.2, solarKw: 210 },
    { month: 'Nov', fuelBurn: 17.5, avgTemp: -11.0, solarKw: 340 },
    { month: 'Dec', fuelBurn: 14.1, avgTemp: -3.8, solarKw: 410 },
  ];

  // MTBF by subsystem
  const mtbfData = [
    { system: 'Diesel Gen', mtbfHours: 2420, target: 2000 },
    { system: 'Hydronic Heat', mtbfHours: 4180, target: 3500 },
    { system: 'Sat Radome', mtbfHours: 1840, target: 2200 },
    { system: 'Water RO/Melt', mtbfHours: 3200, target: 3000 },
    { system: 'BESS Battery', mtbfHours: 8500, target: 8000 },
    { system: 'Edge IPC', mtbfHours: 12000, target: 10000 },
  ];

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Station Analytics, Reliability & Trends
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Mean Time Between Failures (MTBF), seasonal polar fuel burn profiles, and predictive degradation models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            Sample Scope: 12-Month Antarctic Expedition Cycle
          </div>
        </div>
      </div>

      {/* THREE PREDICTIVE HEALTH METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="card-polar p-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-mono uppercase text-[var(--text-muted)]">
            <span>Bearing Vibration Drift Rate</span>
            <span className="text-[var(--warning)]">+0.14 mm/s / month</span>
          </div>
          <div className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">
            Generator 2 Bearing Imbalance
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-snug">
            Predictive spectral FFT models forecast bearing fatigue threshold reach in 42 days unless coupling realigned.
          </p>
        </div>

        <div className="card-polar p-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-mono uppercase text-[var(--text-muted)]">
            <span>Heat Exchanger Fouling</span>
            <span className="text-[var(--success)]">1.2% Drift (Normal)</span>
          </div>
          <div className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">
            Thermal CHP Heat Transfer U-Value
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-snug">
            Exhaust gas heat recovery operating at 86.4% efficiency. Chemical descaling recommended next summer season.
          </p>
        </div>

        <div className="card-polar p-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-mono uppercase text-[var(--text-muted)]">
            <span>BESS Capacity Fade Rate</span>
            <span className="text-[var(--success)]">0.8% / Year</span>
          </div>
          <div className="text-[18px] font-mono font-semibold text-[var(--text-primary)]">
            LiFePO4 Cold Chemistry Retention
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-snug">
            Active thermal jacket prevents sub-zero lithium plating. Projected 10-year operational cell life.
          </p>
        </div>
      </div>

      {/* SEASONAL FUEL BURN PROFILE & MTBF CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Chart 1: Seasonal Fuel Burn vs Temperature */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[13px] font-medium text-[var(--text-primary)]">
                Annual Fuel Burn Rate (L/h) vs Ambient Temp (°C)
              </h4>
              <div className="text-[11px] text-[var(--text-muted)]">
                Illustrates dramatic 2.7x fuel consumption jump during polar winter deep freeze.
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#B4611F]">● Fuel Burn (L/h)</span>
              <span className="text-[#2C5F8A]">● Solar PV (kW)</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="fuelBurn" name="Fuel Burn Rate (L/h)" fill="#B4611F" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: MTBF by Subsystem vs Target Threshold */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[13px] font-medium text-[var(--text-primary)]">
                Subsystem MTBF Operating Hours
              </h4>
              <div className="text-[11px] text-[var(--text-muted)]">
                Comparison of actual runtime hours between maintenance interventions against targets.
              </div>
            </div>
            <div className="font-mono text-[11px] text-[var(--accent)]">
              ● Mean Time Between Failures
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mtbfData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis dataKey="system" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="mtbfHours" name="MTBF (Hours)" fill="#2C5F8A" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DEPTH SECTIONS: RUL CONFIDENCE BANDS & CHANGE POINT DETECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RUL with Confidence Bands */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Remaining Useful Life (RUL) with Uncertainty Bands
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Weibull degradation survival probabilities (P5 lower bound, P50 median, P95 upper bound).
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">WEIBULL β=2.1</span>
          </div>

          <div className="space-y-2.5 font-mono text-[11px]">
            {[
              { asset: 'DG-1 Main Journal Bearings', p5: 380, p50: 520, p95: 710, unit: 'hours', status: 'monitor' },
              { asset: 'Alfa Laval Plate Heat Exchanger', p5: 1800, p50: 2400, p95: 3100, unit: 'hours', status: 'good' },
              { asset: 'LiFePO4 Battery Cell String #3', p5: 2800, p50: 3600, p95: 4400, unit: 'cycles', status: 'good' },
              { asset: 'GSAT-7A Stepper Motor Gimbal', p5: 840, p50: 1100, p95: 1450, unit: 'hours', status: 'monitor' }
            ].map(r => (
              <div key={r.asset} className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-medium font-sans text-[12px]">{r.asset}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${r.status === 'good' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>P5: <strong className="text-rose-600">{r.p5} {r.unit}</strong></span>
                  <span>P50: <strong className="text-[var(--text-primary)]">{r.p50} {r.unit}</strong></span>
                  <span>P95: <strong className="text-emerald-600">{r.p95} {r.unit}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Point Detection & Forecast vs Actual */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Statistical Change Point Detection (CUSUM)
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Cumulative Sum algorithm flagging structural regime shifts in station microgrid data.
              </p>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">CUSUM k=0.5, h=4.0</span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-primary)]">Detected Change Point #1:</span>
                <span className="text-amber-700">2026-09-24 04:12 UTC</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                Shift in DG-1 cylinder #3 exhaust gas temperature (+18.4°C baseline jump). Attributed to fuel injector tip carbon accumulation.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-primary)]">Detected Change Point #2:</span>
                <span className="text-blue-700">2026-09-21 16:30 UTC</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                Hydronic return loop thermal loss increased by +4.2%. Correlated with blizzard wind onset and increased exterior wall convection.
              </p>
            </div>

            <div className="p-2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px]">
              Forecast Accuracy: Mean Absolute Percentage Error (MAPE) = 2.4% vs actual 1 Hz integration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
