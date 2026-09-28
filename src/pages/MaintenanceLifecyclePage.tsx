import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Wrench, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const MaintenanceLifecyclePage: React.FC = () => {
  const { station, stationData } = useStation();

  const [deferralDays, setDeferralDays] = useState<number>(14);

  const assets = [
    { id: 'GEN-01', name: 'Primary Diesel Engine QSK19', installDate: '2020-11-15', runningHours: 12480, cycles: 2840, lastMaint: '18 days ago', nextDue: '12 days', criticality: 'Life Critical', rulHours: 18500, rulConfidence: '±650h' },
    { id: 'GEN-02', name: 'Backup Diesel Engine QSK19', installDate: '2020-11-15', runningHours: 8940, cycles: 1950, lastMaint: '4 days ago', nextDue: '8 days', criticality: 'Life Critical', rulHours: 14200, rulConfidence: '±850h' },
    { id: 'BESS-01', name: 'LiFePO4 500 kWh Energy Storage', installDate: '2022-01-10', runningHours: 35000, cycles: 820, lastMaint: '32 days ago', nextDue: '28 days', criticality: 'Mission Critical', rulHours: 42000, rulConfidence: '±1200h' },
    { id: 'CHP-HX-01', name: 'Flue Gas Shell & Tube Heat Exchanger', installDate: '2019-12-05', runningHours: 24500, cycles: 640, lastMaint: '14 days ago', nextDue: '16 days', criticality: 'Life Critical', rulHours: 12000, rulConfidence: '±400h' },
    { id: 'RO-WTR-02', name: 'Desalination Membrane High-Pressure Pump', installDate: '2021-02-18', runningHours: 9400, cycles: 1120, lastMaint: '10 days ago', nextDue: '20 days', criticality: 'Life Critical', rulHours: 8500, rulConfidence: '±300h' },
    { id: 'RAD-SAT-01', name: 'Cobham 2.4m Azimuth Drive Servo', installDate: '2021-12-20', runningHours: 18200, cycles: 4500, lastMaint: '7 days ago', nextDue: '23 days', criticality: 'Mission Critical', rulHours: 9200, rulConfidence: '±500h' },
  ];

  // Parts consumption data: historical vs forecast
  const partsConsumption = [
    { part: 'Fuel Filter', historical: 12, forecast: 18, reorderPoint: 6 },
    { part: 'Bearing Coupler', historical: 2, forecast: 4, reorderPoint: 2 },
    { part: 'Glycol 200L', historical: 4, forecast: 6, reorderPoint: 3 },
    { part: 'Lube Oil Drum', historical: 16, forecast: 22, reorderPoint: 8 },
    { part: 'Sensor RTD', historical: 3, forecast: 5, reorderPoint: 2 },
  ];

  // Deferral Simulator Calculations
  const riskDelta = Math.round(deferralDays * 2.8);
  const costDelta = Math.round(deferralDays * 350);
  const downtimeRiskHours = (deferralDays * 0.4).toFixed(1);

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Maintenance, Asset Lifecycle & Reliability
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Asset register, Remaining Useful Life (RUL) forecasting, parts burn rate, and maintenance deferral risk simulation.
          </p>
        </div>

        <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
          ASSET MANAGEMENT STANDARD: ISO 55001 POLAR SPEC
        </div>
      </div>

      {/* A. ASSET REGISTER TABLE */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              A. Station Master Asset Register & RUL Projections
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Remaining Useful Life (RUL) computed from cumulative operating hours, thermal cycles, and vibration harmonics.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Total Tracked Assets: 6
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-polar text-[12px]">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Equipment Description</th>
                <th>Operating Hours</th>
                <th>Cycles</th>
                <th>Last Maint</th>
                <th>Next Due</th>
                <th>Criticality</th>
                <th>RUL Projection</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id}>
                  <td className="font-mono font-bold text-[11px] text-[var(--text-primary)]">{a.id}</td>
                  <td className="font-medium text-[var(--text-primary)]">{a.name}</td>
                  <td className="font-mono text-[11px]">{a.runningHours.toLocaleString()} hrs</td>
                  <td className="font-mono text-[11px] text-[var(--text-muted)]">{a.cycles}</td>
                  <td className="font-mono text-[11px] text-[var(--text-secondary)]">{a.lastMaint}</td>
                  <td className="font-mono text-[11px] text-[var(--warning)] font-semibold">{a.nextDue}</td>
                  <td>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]">
                      {a.criticality}
                    </span>
                  </td>
                  <td className="font-mono text-[11px] font-medium text-[var(--accent)]">
                    {a.rulHours.toLocaleString()}h <span className="text-[var(--text-muted)] text-[10px]">({a.rulConfidence})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B. MAINTENANCE CALENDAR & D. DEFERRAL SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Maintenance Calendar (7 cols) */}
        <div className="lg:col-span-7 card-polar p-4 space-y-3">
          <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                B. Scheduled Interventions & Deferred Backlog
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Preventive servicing windows synchronized with weather forecasts.
              </p>
            </div>
            <span className="font-mono text-[11px] text-[var(--warning)]">
              Backlog Risk Score: 48/100
            </span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex justify-between items-center">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">Generator 2 Bearing Coupler Alignment</div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">SOP-01 Intervention · Due in 8 days</div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--critical)] text-[var(--critical)] bg-[var(--critical-soft)]">
                HIGH PRIORITY
              </span>
            </div>

            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex justify-between items-center">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">Hydronic Loop Filter Screen Flush</div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">Routine servicing · Due in 16 days</div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)]">
                SCHEDULED
              </span>
            </div>

            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex justify-between items-center">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">Satellite Radome Azimuth Gearbox Greasing</div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">Preventive lubrication · Due in 23 days</div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)]">
                SCHEDULED
              </span>
            </div>
          </div>
        </div>

        {/* Deferral Simulator (5 cols) */}
        <div className="lg:col-span-5 card-polar p-4 space-y-3">
          <div className="border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              D. Maintenance Deferral Simulator
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              "What happens if bad weather defers maintenance by N days?"
            </p>
          </div>

          <div className="space-y-3 text-[12px]">
            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-[var(--text-secondary)]">Inspection Deferral Window:</span>
                <span className="font-semibold text-[var(--text-primary)]">{deferralDays} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={deferralDays}
                onChange={(e) => setDeferralDays(Number(e.target.value))}
                className="w-full h-1 bg-[var(--border)] rounded cursor-pointer"
              />
            </div>

            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Cumulative Risk Delta:</span>
                <span className="font-mono font-bold text-[var(--critical)]">+{riskDelta}% failure hazard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Projected Cost Escalation:</span>
                <span className="font-mono font-bold text-[var(--warning)]">+${costDelta.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Unscheduled Downtime Risk:</span>
                <span className="font-mono font-bold text-[var(--accent)]">+{downtimeRiskHours} Hours</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] italic">
              Extending maintenance past 21 days during polar winter transitions doubles the probability of sudden bearing seizure.
            </p>
          </div>
        </div>
      </div>

      {/* C. PARTS CONSUMPTION FORECAST CHART */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          C. Critical Spares Consumption: Past Season vs Projected Expedition Need
        </h3>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={partsConsumption} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="part" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <Tooltip />
              <Bar dataKey="historical" name="Past Season Used" fill="#8A94A6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="forecast" name="Expedition Forecast" fill="#2C5F8A" radius={[2, 2, 0, 0]} />
              <Bar dataKey="reorderPoint" name="Minimum Reorder Threshold" fill="#B4611F" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
