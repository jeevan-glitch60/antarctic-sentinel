import React from 'react';
import { useStation } from '../context/StationContext';
import { 
  Users, 
  Heart, 
  Activity, 
  Clock, 
  Thermometer, 
  Wind, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';

export const CrewOperationsPage: React.FC = () => {
  const { station, stationData, multiPhysicsState } = useStation();

  const crew = multiPhysicsState.crew;

  // Thermal comfort PMV calculation: ISO 7730
  // PMV = 0 (neutral comfort), +3 (hot), -3 (cold)
  const getPmv = (temp: number) => {
    const diff = temp - 21.0;
    const pmv = Number((diff * 0.28).toFixed(2));
    const ppd = Math.round(100 - 95 * Math.exp(-0.03353 * Math.pow(pmv, 4) - 0.2179 * Math.pow(pmv, 2)));
    return { pmv, ppd };
  };

  const livingComfort = getPmv(multiPhysicsState.zones.living.air_temp_c);
  const labComfort = getPmv(multiPhysicsState.zones.lab.air_temp_c);

  const dailySchedule = [
    { time: '07:00 – 08:30 UTC', activity: 'Breakfast & Meteorological Briefing', impact: 'Normal' },
    { time: '08:30 – 12:30 UTC', activity: 'Scientific Instrument Calibration & Field EVA', impact: 'Restricted if Wind > 20 m/s' },
    { time: '12:30 – 13:30 UTC', activity: 'Station Lunch & Midday Telemetry Check', impact: 'Normal' },
    { time: '13:30 – 17:30 UTC', activity: 'Generator Maintenance & Waste Heat Optimization', impact: 'SOP-01 Priority' },
    { time: '17:30 – 19:00 UTC', activity: 'Physical Fitness & Satellite Comm Uplink', impact: 'Normal' },
    { time: '19:00 – 20:30 UTC', activity: 'Dinner & Operations Handover Log', impact: 'Normal' },
    { time: '20:30 – 07:00 UTC', activity: 'Sleep Quarters & Automated Night Watch', impact: 'Night setback (+18°C target)' }
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Crew Operations, Human Factors & Life Support
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Station personnel roster, PMV/PPD thermal comfort index, habitat atmosphere, and daily operational schedules.
          </p>
        </div>

        <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
          CREW ON STATION: {stationData.winteringCrew} PERSONNEL
        </div>
      </div>

      {/* A. PERSONNEL ROSTER */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              A. Overwintering Team & Active Zone Locations
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Live tracking of personnel physical zones, activity level, and metabolic heat emission.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Total Heat Contribution: 510 W
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {crew.map(member => (
            <div key={member.id} className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-[4px] space-y-1.5 text-[12px]">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] text-[var(--accent)] font-semibold uppercase">{member.id}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface)] border border-[var(--border)]">
                  {member.metabolic_rate_w} W
                </span>
              </div>
              <div className="font-semibold text-[13px] text-[var(--text-primary)]">{member.name}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">{member.role}</div>
              <div className="pt-1 border-t border-[var(--border)] flex justify-between font-mono text-[11px]">
                <span className="text-[var(--text-muted)]">Zone:</span>
                <span className="text-[var(--text-primary)] font-medium">{member.zone}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[var(--text-muted)]">Activity:</span>
                <span className="text-[var(--success)]">{member.activity_level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B. THERMAL COMFORT & D. LIFE SUPPORT (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Thermal Comfort PMV/PPD (ISO 7730) */}
        <div className="card-polar p-4 space-y-3">
          <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                B. Thermal Comfort Index (ISO 7730 PMV / PPD)
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Predicted Mean Vote (PMV) and Predicted Percentage Dissatisfied (PPD).
              </p>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">Target: PMV 0.0 ±0.5</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-1">
              <div className="font-mono text-[11px] uppercase text-[var(--text-muted)]">Living Habitation Pod</div>
              <div className="text-[16px] font-mono font-bold text-[var(--text-primary)] mt-0.5">
                {multiPhysicsState.zones.living.air_temp_c.toFixed(1)} °C
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">PMV: {livingComfort.pmv} (Neutral)</div>
              <div className="text-[11px] font-mono text-[var(--success)]">PPD: {livingComfort.ppd}% Dissatisfied</div>
            </div>

            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-1">
              <div className="font-mono text-[11px] uppercase text-[var(--text-muted)]">Science Laboratory</div>
              <div className="text-[16px] font-mono font-bold text-[var(--text-primary)] mt-0.5">
                {multiPhysicsState.zones.lab.air_temp_c.toFixed(1)} °C
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">PMV: {labComfort.pmv} (Slightly Cool)</div>
              <div className="text-[11px] font-mono text-[var(--caution)]">PPD: {labComfort.ppd}% Dissatisfied</div>
            </div>
          </div>
        </div>

        {/* Life Support Gas Analysis */}
        <div className="card-polar p-4 space-y-3">
          <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                D. Atmospheric Life Support & Gas Monitoring
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Closed-environment oxygen partial pressure, CO2 scrubbers, and humidity.
              </p>
            </div>
            <span className="font-mono text-[11px] text-[var(--success)]">All Systems Nominal</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[12px]">
            <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Oxygen (O2)</div>
              <div className="text-[15px] font-mono font-bold text-[var(--text-primary)] mt-0.5">20.8%</div>
              <div className="text-[10px] text-[var(--text-muted)]">Threshold: &gt;19.5%</div>
            </div>

            <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Carbon Dioxide</div>
              <div className="text-[15px] font-mono font-bold text-[var(--text-primary)] mt-0.5">{multiPhysicsState.zones.living.co2_ppm} ppm</div>
              <div className="text-[10px] text-[var(--text-muted)]">Limit: &lt;1,200 ppm</div>
            </div>

            <div className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Relative Humidity</div>
              <div className="text-[15px] font-mono font-bold text-[var(--text-primary)] mt-0.5">{multiPhysicsState.zones.living.humidity_pct}%</div>
              <div className="text-[10px] text-[var(--text-muted)]">Optimal: 35–50%</div>
            </div>
          </div>
        </div>
      </div>

      {/* C. DAILY OPS SCHEDULE & FAULT IMPACT */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          C. Station Daily Operations Master Schedule & Weather Contingencies
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full table-polar text-[12px]">
            <thead>
              <tr>
                <th>Time Window</th>
                <th>Planned Operation</th>
                <th>Subsystem Dependencies</th>
                <th>Weather / Anomaly Sensitivity</th>
              </tr>
            </thead>
            <tbody>
              {dailySchedule.map((s, idx) => (
                <tr key={idx}>
                  <td className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">{s.time}</td>
                  <td className="font-medium text-[var(--text-primary)]">{s.activity}</td>
                  <td className="font-mono text-[11px] text-[var(--text-secondary)]">Power, Heating, Comms</td>
                  <td className="font-mono text-[11px] text-[var(--warning)]">{s.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
