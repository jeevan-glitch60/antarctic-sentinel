import React, { useState } from 'react';
import { 
  Atom, 
  Sliders, 
  HelpCircle, 
  Code, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const SubsystemPhysicsPage: React.FC = () => {
  // 1. Building Thermal Decay Sliders
  const [thermalMass, setThermalMass] = useState<number>(1800); // kJ/K
  const [conductanceU, setConductanceU] = useState<number>(0.22); // W/m2K
  const [windVel, setWindVel] = useState<number>(20); // m/s
  const [ambientTemp, setAmbientTemp] = useState<number>(-25); // °C

  // 2. SFOC Sliders
  const [sfocLoad, setSfocLoad] = useState<number>(70); // %
  const [fuelVisc, setFuelVisc] = useState<number>(4.0); // cSt

  // 3. LiFePO4 Temperature Slider
  const [cellTemp, setCellTemp] = useState<number>(15); // °C

  // 4. MCDA Sliders
  const [wSafety, setWSafety] = useState<number>(40);
  const [wThermal, setWThermal] = useState<number>(25);
  const [wGrid, setWGrid] = useState<number>(20);
  const [wSci, setWSci] = useState<number>(10);
  const [wLog, setWLog] = useState<number>(5);

  // Generate live curve for thermal decay over 12 hours
  const thermalDecayCurve = [];
  const f_wind = 1.0 + (windVel / 50.0) * 0.8;
  const netU = conductanceU * f_wind;
  let tempCurrent = 21.0;
  for (let h = 0; h <= 12; h++) {
    thermalDecayCurve.push({
      hour: `${h}h`,
      temp: Number(tempCurrent.toFixed(1)),
      criticalThreshold: 5.0
    });
    const deltaT = tempCurrent - ambientTemp;
    const lossKw = (netU * 650 * deltaT) / 1000.0;
    const dropPerHour = (lossKw * 3600) / (thermalMass * 1000);
    tempCurrent -= dropPerHour;
  }

  // Generate SFOC Curve vs Electrical Load
  const sfocCurve = [];
  for (let l = 20; l <= 100; l += 10) {
    const baseSfoc = 210 + Math.pow(100 - l, 1.4) * 0.8;
    const viscAdd = (fuelVisc - 3.0) * 4.5;
    sfocCurve.push({
      load: `${l}%`,
      actualSfoc: Number((baseSfoc + viscAdd).toFixed(1)),
      referenceSfoc: Number(baseSfoc.toFixed(1))
    });
  }

  // Generate LiFePO4 Derating Curve vs Temperature
  const batteryCurve = [];
  for (let t = -30; t <= 30; t += 5) {
    const capPct = t >= 20 ? 100 : Math.max(20, 100 - (20 - t) * 1.6);
    batteryCurve.push({
      temp: `${t}°C`,
      capacity: Number(capPct.toFixed(1)),
      activeTempMarker: t === cellTemp ? capPct : null
    });
  }

  // MCDA calculated sample score
  const totalWeight = wSafety + wThermal + wGrid + wSci + wLog;
  const sampleMcdaScore = Math.round(
    ((95 * wSafety) + (88 * wThermal) + (75 * wGrid) + (60 * wSci) + (50 * wLog)) / (totalWeight || 1)
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Interactive Subsystem Physics & Governing Equations
            </h1>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
              DOC-PHYS-2026-ENG
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Calibrated polar engineering equations with interactive parameter perturbation and live curve synthesis.
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
          <Code className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Source: src/simulation/multiPhysicsEngine.ts</span>
        </div>
      </div>

      {/* EQUATION BLOCK A: BUILDING THERMAL DECAY */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                A. Building Thermal Decay & Newton Infiltration Equation
              </h3>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[var(--caution-soft)] text-[var(--caution)] border border-[var(--caution)]/30">
                Illustrative — Not Field Calibrated
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
              Units: Q [kW], U [W/m²K], A [m²], C [kJ/K], f_wind [dimensionless] · Validity: -60°C ≤ T_amb ≤ 0°C
            </div>
          </div>
          <a href="#src/simulation/multiPhysicsEngine.ts" className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1">
            <span>View Code Implementation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Math Equation & Sliders (6 cols) */}
          <div className="lg:col-span-6 space-y-3 text-[12px]">
            <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)] leading-relaxed">
              C_i · (dT_i / dt) = - U · A · (T_i - T_amb) · [1.0 + (V_wind / 50.0) · 0.8]
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-secondary)]">Thermal Mass (C):</span>
                  <span className="font-semibold text-[var(--text-primary)]">{thermalMass} kJ/K</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="3500"
                  step="50"
                  value={thermalMass}
                  onChange={(e) => setThermalMass(Number(e.target.value))}
                  className="w-full h-1 bg-[var(--border)] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-secondary)]">Wall Conductance (U):</span>
                  <span className="font-semibold text-[var(--text-primary)]">{conductanceU} W/m²K</span>
                </div>
                <input
                  type="range"
                  min="0.12"
                  max="0.45"
                  step="0.01"
                  value={conductanceU}
                  onChange={(e) => setConductanceU(Number(e.target.value))}
                  className="w-full h-1 bg-[var(--border)] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-secondary)]">Gale Wind Velocity:</span>
                  <span className="font-semibold text-[var(--text-primary)]">{windVel} m/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  step="1"
                  value={windVel}
                  onChange={(e) => setWindVel(Number(e.target.value))}
                  className="w-full h-1 bg-[var(--border)] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Live Chart (6 cols) */}
          <div className="lg:col-span-6 h-48 w-full bg-[var(--surface-subtle)] p-2 rounded border border-[var(--border)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={thermalDecayCurve} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={[-20, 25]} />
                <Tooltip />
                <Line type="monotone" dataKey="temp" name="Interior Temp (°C)" stroke="#2C5F8A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="criticalThreshold" name="Freeze Threshold (+5°C)" stroke="#A3312B" strokeWidth={1} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EQUATION BLOCK B: SFOC FUEL PROFILE */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                B. Specific Fuel Oil Consumption (SFOC) vs Load & Cold Viscosity
              </h3>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[var(--caution-soft)] text-[var(--caution)] border border-[var(--caution)]/30">
                Illustrative — Not Field Calibrated
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
              Units: SFOC [g/kWh], Load [%], Viscosity [cSt] · Validity: 20% ≤ Load ≤ 110%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 space-y-3 text-[12px]">
            <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)] leading-relaxed">
              SFOC = SFOC_base(P_load) + ΔSFOC_visc(ν_fuel) + ΔSFOC_injector(jitter)
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-secondary)]">Fuel Kinematic Viscosity (ASTM D341):</span>
                  <span className="font-semibold text-[var(--text-primary)]">{fuelVisc} cSt</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="12.0"
                  step="0.5"
                  value={fuelVisc}
                  onChange={(e) => setFuelVisc(Number(e.target.value))}
                  className="w-full h-1 bg-[var(--border)] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 h-48 w-full bg-[var(--surface-subtle)] p-2 rounded border border-[var(--border)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sfocCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="load" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="actualSfoc" name="Operating SFOC (g/kWh)" stroke="#B4611F" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="referenceSfoc" name="Warm Reference Curve" stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="2 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EQUATION BLOCK C: LiFePO4 CAPACITY DERATING */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                C. LiFePO4 Electrochemical Capacity Retention (Arrhenius Curve)
              </h3>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[var(--caution-soft)] text-[var(--caution)] border border-[var(--caution)]/30">
                Illustrative — Not Field Calibrated
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
              Units: Capacity [%], Temperature [°C] · Validity: -35°C ≤ T_cell ≤ +45°C
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 space-y-3 text-[12px]">
            <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)] leading-relaxed">
              C_available(T) = C_rated · [ 1.0 - 0.016 · max(0, 20.0 - T_cell) ]
            </div>

            <div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[var(--text-secondary)]">Tested Core Temperature (T_cell):</span>
                <span className="font-semibold text-[var(--text-primary)]">{cellTemp} °C</span>
              </div>
              <input
                type="range"
                min="-30"
                max="25"
                step="1"
                value={cellTemp}
                onChange={(e) => setCellTemp(Number(e.target.value))}
                className="w-full h-1 bg-[var(--border)] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 h-48 w-full bg-[var(--surface-subtle)] p-2 rounded border border-[var(--border)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="temp" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={[0, 105]} />
                <Tooltip />
                <Line type="monotone" dataKey="capacity" name="Available Capacity (%)" stroke="#3F7A54" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EQUATION BLOCK D: MULTI-CRITERIA DECISION SCORE */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
            D. Multi-Criteria Priority Formulation (MCDA)
          </h3>
          <span className="font-mono text-[11px] text-[var(--accent)] font-semibold">
            Computed Priority Index: {sampleMcdaScore} / 100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-[12px]">
          <div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Safety Weight:</span>
              <span className="font-semibold">{wSafety}%</span>
            </div>
            <input type="range" min="10" max="60" value={wSafety} onChange={(e) => setWSafety(Number(e.target.value))} className="w-full h-1 bg-[var(--border)] rounded" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Thermal Weight:</span>
              <span className="font-semibold">{wThermal}%</span>
            </div>
            <input type="range" min="10" max="50" value={wThermal} onChange={(e) => setWThermal(Number(e.target.value))} className="w-full h-1 bg-[var(--border)] rounded" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Power Grid:</span>
              <span className="font-semibold">{wGrid}%</span>
            </div>
            <input type="range" min="10" max="50" value={wGrid} onChange={(e) => setWGrid(Number(e.target.value))} className="w-full h-1 bg-[var(--border)] rounded" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Science Mission:</span>
              <span className="font-semibold">{wSci}%</span>
            </div>
            <input type="range" min="5" max="30" value={wSci} onChange={(e) => setWSci(Number(e.target.value))} className="w-full h-1 bg-[var(--border)] rounded" />
          </div>
          <div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Logistics:</span>
              <span className="font-semibold">{wLog}%</span>
            </div>
            <input type="range" min="5" max="25" value={wLog} onChange={(e) => setWLog(Number(e.target.value))} className="w-full h-1 bg-[var(--border)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
