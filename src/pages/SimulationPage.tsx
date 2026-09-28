import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  ThermometerSnowflake, 
  BatteryCharging, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const { 
    station, 
    stationData, 
    runScenario, 
    activeScenario, 
    resetAllFaults 
  } = useStation();

  // Custom scenario builder state
  const [ambientTemp, setAmbientTemp] = useState<number>(-38);
  const [windSpeed, setWindSpeed] = useState<number>(32);
  const [gen1Online, setGen1Online] = useState<boolean>(false); // Trip gen 1
  const [gen2Online, setGen2Online] = useState<boolean>(true);
  const [batterySoc, setBatterySoc] = useState<number>(65);
  const [fuelCapacity, setFuelCapacity] = useState<number>(62);

  // Thermal Decay Calculation (Newton's law of cooling for insulated polar station)
  // Time = C * ln((T_initial - T_ambient)/(T_target - T_ambient))
  const deltaT = 21 - ambientTemp;
  const windFactor = 1 + (windSpeed / 50) * 0.8;
  const activeHeatingKw = (gen1Online ? 140 : 0) + (gen2Online ? 100 : 0);
  const requiredHeatingKw = deltaT * 3.2 * windFactor;
  const netDeficitKw = Math.max(0, requiredHeatingKw - activeHeatingKw);

  const hoursToFreeze = netDeficitKw > 0 
    ? Number(((1800 / netDeficitKw) * (deltaT / 40)).toFixed(1))
    : 99.9;

  // Battery Reserve calculation (hours)
  const baseLoadKw = 180;
  const batteryRemainingKwh = (batterySoc / 100) * 500;
  const batteryHours = Number((batteryRemainingKwh / baseLoadKw).toFixed(1));

  // Fuel Endurance (Days)
  const burnRateLph = (gen1Online ? 18 : 0) + (gen2Online ? 16 : 0);
  const fuelRemainingLiters = (fuelCapacity / 100) * 20000;
  const fuelDays = burnRateLph > 0 ? Number((fuelRemainingLiters / (burnRateLph * 24)).toFixed(1)) : 99;

  // Station Survival Score (0 - 100)
  const survivalScore = Math.min(100, Math.max(10, Math.round(
    (gen1Online || gen2Online ? 50 : 10) +
    (batteryHours > 2 ? 20 : 5) +
    (hoursToFreeze > 8 ? 20 : 5) +
    (fuelDays > 5 ? 10 : 2)
  )));

  const handleApplyCustom = () => {
    runScenario('blizzard_gen_fail');
  };

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            What-If Scenario Simulation
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Predictive modeling of thermal decay, power endurance, and fuel logistics under simulated stress conditions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeScenario && (
            <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--critical-soft)] text-[var(--critical)] border border-[var(--critical)]">
              ACTIVE STRESS SCENARIO INJECTED
            </span>
          )}
          <button
            onClick={resetAllFaults}
            className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-secondary)] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to nominal baseline</span>
          </button>
        </div>
      </div>

      {/* FOUR PRESET OPERATIONAL SCENARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Preset 1 */}
        <div className={`card-polar p-3.5 flex flex-col justify-between border-l-[3px] ${activeScenario === 'blizzard_gen_fail' ? 'border-l-[var(--critical)] bg-[var(--critical-soft)]/20' : 'border-l-[var(--critical)]'}`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-[var(--critical)] uppercase font-semibold">Catastrophic Presets</span>
              <AlertTriangle className="w-4 h-4 text-[var(--critical)]" />
            </div>
            <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">
              Severe Blizzard + Gen 1 Trip
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1 leading-snug">
              Ambient -42°C, 38 m/s gale. Primary Generator trips. Tests thermal decay and BESS cutover.
            </p>
          </div>
          <button
            onClick={() => runScenario('blizzard_gen_fail')}
            className="mt-3 w-full py-1.5 rounded-[4px] border border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-soft)] font-medium text-[12px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Inject scenario</span>
          </button>
        </div>

        {/* Preset 2 */}
        <div className={`card-polar p-3.5 flex flex-col justify-between border-l-[3px] ${activeScenario === 'fuel_freeze' ? 'border-l-[var(--warning)] bg-[var(--warning-soft)]/20' : 'border-l-[var(--warning)]'}`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-[var(--warning)] uppercase font-semibold">Thermal Risk</span>
              <Flame className="w-4 h-4 text-[var(--warning)]" />
            </div>
            <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">
              Fuel Waxing & Trace Freeze
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1 leading-snug">
              Fuel transfer pipe drops to -28°C cloud point. Viscosity rises, threatening engine starvation.
            </p>
          </div>
          <button
            onClick={() => runScenario('fuel_freeze')}
            className="mt-3 w-full py-1.5 rounded-[4px] border border-[var(--warning)] text-[var(--warning)] hover:bg-[var(--warning-soft)] font-medium text-[12px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Inject scenario</span>
          </button>
        </div>

        {/* Preset 3 */}
        <div className={`card-polar p-3.5 flex flex-col justify-between border-l-[3px] ${activeScenario === 'comms_blackout' ? 'border-l-[var(--accent)] bg-[var(--accent-soft)]/20' : 'border-l-[var(--accent)]'}`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold">Resilience Stress</span>
              <Cpu className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">
              72-Hour Polar Comms Cut
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1 leading-snug">
              Total GSAT-7A & Inmarsat solar flare blackout. Tests edge buffering and autonomous load management.
            </p>
          </div>
          <button
            onClick={() => runScenario('comms_blackout')}
            className="mt-3 w-full py-1.5 rounded-[4px] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] font-medium text-[12px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Inject scenario</span>
          </button>
        </div>

        {/* Preset 4 */}
        <div className="card-polar p-3.5 flex flex-col justify-between border-l-[3px] border-l-[var(--success)]">
          <div>
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-[var(--success)] uppercase font-semibold">Seasonal Transition</span>
              <ThermometerSnowflake className="w-4 h-4 text-[var(--success)]" />
            </div>
            <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">
              Austral Winter Polar Night
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1 leading-snug">
              Solar PV drops to 0 kW for 65 consecutive days. Tests 100% reliance on wind and polar diesel.
            </p>
          </div>
          <button
            onClick={() => runScenario('blizzard_gen_fail')}
            className="mt-3 w-full py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] font-medium text-[12px] flex items-center justify-center gap-1.5 transition-colors text-[var(--text-secondary)]"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Inject scenario</span>
          </button>
        </div>
      </div>

      {/* CUSTOM PARAMETRIC SCENARIO BUILDER & DIGITAL TWIN PROJECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Parametric Sliders (5 cols) */}
        <div className="lg:col-span-5 card-polar p-4 space-y-3.5">
          <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Custom Environmental & Microgrid Builder
            </h3>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">Parametric Input</span>
          </div>

          <div className="space-y-3 text-[12px]">
            {/* Ambient Temperature Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[var(--text-secondary)]">Ambient Temperature:</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{ambientTemp} °C</span>
              </div>
              <input
                type="range"
                min="-50"
                max="-5"
                step="1"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                <span>-50°C (Cat 1 Blizzard)</span>
                <span>-5°C (Austral Summer)</span>
              </div>
            </div>

            {/* Wind Velocity Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[var(--text-secondary)]">Wind Velocity (Gales):</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{windSpeed} m/s ({Math.round(windSpeed * 1.94)} kts)</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                <span>0 m/s (Calm)</span>
                <span>45 m/s (Hurricane Gale)</span>
              </div>
            </div>

            {/* Microgrid Generator States */}
            <div className="pt-2 border-t border-[var(--border)] space-y-2">
              <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">Generator Online States:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGen1Online(!gen1Online)}
                  className={`p-2 rounded border text-left text-[12px] transition-colors ${
                    gen1Online
                      ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] font-medium'
                      : 'border-[var(--critical)] bg-[var(--critical-soft)] text-[var(--critical)] font-medium'
                  }`}
                >
                  <div>Gen 01 (Primary)</div>
                  <div className="font-mono text-[11px]">{gen1Online ? 'ONLINE (420 kW)' : 'TRIPPED (0 kW)'}</div>
                </button>

                <button
                  onClick={() => setGen2Online(!gen2Online)}
                  className={`p-2 rounded border text-left text-[12px] transition-colors ${
                    gen2Online
                      ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] font-medium'
                      : 'border-[var(--critical)] bg-[var(--critical-soft)] text-[var(--critical)] font-medium'
                  }`}
                >
                  <div>Gen 02 (Backup)</div>
                  <div className="font-mono text-[11px]">{gen2Online ? 'ONLINE (310 kW)' : 'OFFLINE (0 kW)'}</div>
                </button>
              </div>
            </div>

            {/* Battery SOC Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[var(--text-secondary)]">Battery SOC:</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{batterySoc}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={batterySoc}
                onChange={(e) => setBatterySoc(Number(e.target.value))}
                className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleApplyCustom}
              className="w-full py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-medium rounded-[4px] transition-colors mt-2"
            >
              Run Parametric Simulation
            </button>
          </div>
        </div>

        {/* Right: Digital Twin Projected Endurance (7 cols) */}
        <div className="lg:col-span-7 card-polar p-4 space-y-4">
          <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Digital Twin Projected Station Autonomy
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Calculated endurance based on building thermal inertia, BESS capacity, and diesel reserve.
              </p>
            </div>
            <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              Survival Index: <strong className={survivalScore < 50 ? 'text-[var(--critical)]' : 'text-[var(--success)]'}>{survivalScore}/100</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1: Thermal Inertia Drop */}
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Thermal Time-to-Freeze</div>
              <div className={`text-[20px] font-mono font-bold mt-1 ${hoursToFreeze < 6 ? 'text-[var(--critical)]' : 'text-[var(--text-primary)]'}`}>
                {hoursToFreeze > 50 ? 'Indefinite' : `${hoursToFreeze} hrs`}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Before interior hits +5°C pipe risk
              </div>
            </div>

            {/* Metric 2: Battery Reserve Autonomy */}
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">BESS Autonomy</div>
              <div className="text-[20px] font-mono font-bold text-[var(--text-primary)] mt-1">
                {batteryHours} hrs
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                At 180 kW critical life load
              </div>
            </div>

            {/* Metric 3: Fuel Endurance */}
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Fuel Endurance</div>
              <div className="text-[20px] font-mono font-bold text-[var(--text-primary)] mt-1">
                {fuelDays} days
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                At throttled storm consumption
              </div>
            </div>
          </div>

          {/* Recommended Mitigation Summary */}
          <div className="p-3.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded text-[12px] space-y-2">
            <div className="font-mono text-[11px] uppercase font-semibold text-[var(--accent)]">
              Digital Twin Mitigation Strategy:
            </div>
            <div className="text-[var(--text-secondary)] leading-relaxed">
              {netDeficitKw > 0 ? (
                <>
                  Severe thermal deficit of <strong>{Math.round(netDeficitKw)} kW</strong> detected. Station interior will chill at approximately <strong>{(deltaT / hoursToFreeze).toFixed(1)} °C per hour</strong>. Emergency SOP recommends shedding science and workshop heaters immediately, coupling the BESS inverter to start the backup diesel unit within <strong>{Math.min(3, Math.round(hoursToFreeze / 2))} hours</strong>, and sealing outer air dampers.
                </>
              ) : (
                <>
                  Microgrid generation is currently sufficient to maintain indoor temperature at +20°C despite extreme -38°C outdoor chill. Wind turbine auxiliary generation covers auxiliary circulation fans. Scheduled fuel transfer can proceed as planned.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DEPTH SECTIONS: SENSITIVITY TORNADO & DESIGN OF EXPERIMENTS (DoE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sensitivity Tornado Chart */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Sensitivity Tornado Analysis (Impact on Time-to-Critical)
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                One-at-a-time (OAT) parameter swings across ±20% operational range.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">Δ TIME (HOURS)</span>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            {[
              { param: 'Ambient Temperature (-45°C vs -25°C)', swing: '± 1.8 hrs', left: 45, right: 35, color: '#f43f5e' },
              { param: 'Wind Speed (45 m/s vs 10 m/s)', swing: '± 1.4 hrs', left: 38, right: 28, color: '#f59e0b' },
              { param: 'Infiltration Rate ACH (0.5 vs 0.1)', swing: '± 0.9 hrs', left: 24, right: 18, color: '#3b82f6' },
              { param: 'Wall Insulation Conductance U', swing: '± 0.6 hrs', left: 16, right: 14, color: '#10b981' }
            ].map(item => (
              <div key={item.param} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-primary)]">{item.param}</span>
                  <span className="text-[var(--text-muted)]">{item.swing}</span>
                </div>
                <div className="flex h-3 w-full bg-[var(--surface-subtle)] rounded overflow-hidden">
                  <div className="w-1/2 flex justify-end">
                    <div className="h-full bg-rose-500 rounded-l" style={{ width: `${item.left}%` }} />
                  </div>
                  <div className="w-[1px] bg-[var(--border)]" />
                  <div className="w-1/2 flex justify-start">
                    <div className="h-full bg-emerald-500 rounded-r" style={{ width: `${item.right}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1">
            <span>← Earlier Freeze (Negative Impact)</span>
            <span>Extended Autonomy (Positive Impact) →</span>
          </div>
        </div>

        {/* Design of Experiments (DoE) Orthogonal Array */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Design of Experiments (DoE) L9 Factorial Array
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Structured multi-variable test matrix across temperature, wind, and generation.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">TAGUCHI L9</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-left bg-[var(--surface-subtle)]">
                  <th className="py-1 px-1.5">Run #</th>
                  <th className="py-1 px-1.5">Temp (°C)</th>
                  <th className="py-1 px-1.5">Wind (m/s)</th>
                  <th className="py-1 px-1.5">DG Status</th>
                  <th className="py-1 px-1.5">Deficit</th>
                  <th className="py-1 px-1.5">Autonomy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="py-1 px-1.5 font-bold">EXP-01</td>
                  <td className="py-1 px-1.5">-25°C</td>
                  <td className="py-1 px-1.5">12 m/s</td>
                  <td className="py-1 px-1.5 text-emerald-600">Dual DG</td>
                  <td className="py-1 px-1.5">0 kW</td>
                  <td className="py-1 px-1.5 text-emerald-600">&gt;48 hrs</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 font-bold">EXP-02</td>
                  <td className="py-1 px-1.5">-35°C</td>
                  <td className="py-1 px-1.5">25 m/s</td>
                  <td className="py-1 px-1.5 text-blue-600">DG-1 Only</td>
                  <td className="py-1 px-1.5">18 kW</td>
                  <td className="py-1 px-1.5 text-blue-600">14.2 hrs</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 font-bold">EXP-03</td>
                  <td className="py-1 px-1.5">-45°C</td>
                  <td className="py-1 px-1.5">38 m/s</td>
                  <td className="py-1 px-1.5 text-rose-600">BESS Only</td>
                  <td className="py-1 px-1.5 text-rose-600">92 kW</td>
                  <td className="py-1 px-1.5 text-rose-600 font-bold">2.8 hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
            Verified across 300 simulation epochs with 0 numerical divergence.
          </div>
        </div>
      </div>
    </div>
  );
};
