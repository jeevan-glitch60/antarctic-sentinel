import React from 'react';
import { BookOpen, ShieldAlert, Cpu, Database, CheckCircle2, FileCode } from 'lucide-react';

export const MethodsPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Engineering Methods, Equations & Data Architecture
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Mathematical formulation of digital twin thermodynamic models, fuel consumption equations, and telemetry specifications.
          </p>
        </div>

        <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
          METHODOLOGY DOC: AS-ENG-2026-REV3
        </div>
      </div>

      {/* SCIENTIFIC DISCLAIMER ALERT */}
      <div className="p-3.5 rounded bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--accent)] text-[12px] space-y-1">
        <div className="font-mono text-[11px] uppercase text-[var(--accent)] font-semibold flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Research Demonstrator Methodology Notice</span>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          The models documented below power the real-time simulation engine of <strong>ANTARCTIC SENTINEL</strong>. Telemetry streams represent synthetic data calibrated against published thermodynamic profiles of Antarctic research stations. No live hardware, SCADA network, or confidential government satellite endpoints are accessed.
        </p>
      </div>

      {/* FOUR MATHEMATICAL MODEL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model 1: Station Thermodynamic Loss */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              1. Building Thermal Decay & Cooling Law
            </h3>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">ISO 13789</span>
          </div>
          <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)]">
            Q_loss = U · A · (T_inside - T_ambient) · f_wind + m_inf · C_p · ΔT
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            Where <code className="font-mono text-[11px]">U</code> is overall building thermal conductance (0.18 W/m²K for Bharati modular envelope, 0.24 W/m²K for Maitri containers), <code className="font-mono text-[11px]">A</code> is exterior envelope surface area, and <code className="font-mono text-[11px]">f_wind</code> is the convective wind chill infiltration multiplier:
          </p>
          <div className="bg-[var(--surface-subtle)] p-2 rounded font-mono text-[11px] text-[var(--text-primary)] border border-[var(--border)]">
            f_wind = 1.0 + (V_wind / 50.0) · 0.8
          </div>
        </div>

        {/* Model 2: Generator Fuel Consumption Curve */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              2. Specific Fuel Oil Consumption (SFOC)
            </h3>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">CUMMINS POLAR</span>
          </div>
          <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)]">
            F_rate (L/h) = F_0 + k_load · P_electrical + ΔF_cold
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            Where <code className="font-mono text-[11px]">F_0 = 4.2 L/h</code> (no-load idle fuel flow), <code className="font-mono text-[11px]">k_load = 0.033 L/kWh</code>, and <code className="font-mono text-[11px]">ΔF_cold</code> represents the cold-viscosity pumping penalty when ambient temperature drops below -25°C.
          </p>
          <div className="bg-[var(--surface-subtle)] p-2 rounded font-mono text-[11px] text-[var(--text-primary)] border border-[var(--border)]">
            SFOC_nominal = 218 g/kWh at 70% rated continuous MCR
          </div>
        </div>

        {/* Model 3: Cold-Temperature Battery Derating */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              3. LiFePO4 Electrochemical Capacity Derating
            </h3>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">ARRHENIUS DERATE</span>
          </div>
          <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)]">
            C_eff(T) = C_nominal · [ 1 - α_cold · max(0, 20 - T_cell) ]
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            Where <code className="font-mono text-[11px]">α_cold = 0.016 / °C</code>. At -20°C unheated cell temperature, available discharge capacity collapses by 64% due to electrolyte freezing and internal resistance spike. Active thermal jackets maintain cells at +21°C.
          </p>
        </div>

        {/* Model 4: Multi-Criteria Decision Analysis (MCDA) */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              4. Multi-Criteria Priority Scoring Engine
            </h3>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">AHP / MCDA</span>
          </div>
          <div className="bg-[var(--surface-subtle)] p-3 rounded font-mono text-[12px] text-[var(--text-primary)] border border-[var(--border)]">
            S_priority = Σ [ w_i · S_i ] for i ∈ &#123;Safety, Thermal, Grid, Science, Logistics&#125;
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            Weights assigned by polar operations doctrine:
          </p>
          <ul className="text-[11px] font-mono space-y-0.5 text-[var(--text-secondary)]">
            <li>• w_safety = 0.40 (Life support, breathing air, fire suppression)</li>
            <li>• w_thermal = 0.25 (Habitat interior freeze prevention)</li>
            <li>• w_grid = 0.20 (Microgrid bus voltage and frequency stability)</li>
            <li>• w_science = 0.10 (Data collection & spectrometer uptime)</li>
            <li>• w_logistics = 0.05 (Consumable burn rate & parts reserve)</li>
          </ul>
        </div>
      </div>

      {/* SENSOR INSTRUMENTATION REFERENCE TABLE */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
          Sensor Instrumentation & Industrial Telemetry Specifications
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-polar text-[12px]">
            <thead>
              <tr>
                <th>Measurement</th>
                <th>Sensor Hardware</th>
                <th>Protocol / Bus</th>
                <th>Range & Accuracy</th>
                <th>Sample Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-[var(--text-primary)]">Ambient Temperature</td>
                <td>PT100 4-Wire RTD Platinum Resistance Thermometer</td>
                <td className="font-mono text-[11px]">Modbus RTU / RS485</td>
                <td className="font-mono text-[11px]">-70°C to +40°C (±0.05°C)</td>
                <td className="font-mono text-[11px]">1.0 Hz</td>
              </tr>
              <tr>
                <td className="font-medium text-[var(--text-primary)]">Wind Speed & Direction</td>
                <td>Gill Instruments WindObserver Heated 3-Axis Sonic</td>
                <td className="font-mono text-[11px]">NMEA 0183 Optical Ring</td>
                <td className="font-mono text-[11px]">0 to 75 m/s (±1%)</td>
                <td className="font-mono text-[11px]">4.0 Hz</td>
              </tr>
              <tr>
                <td className="font-medium text-[var(--text-primary)]">Turbine Vibration</td>
                <td>PCB Piezotronics 352C33 High-Temp Accelerometer</td>
                <td className="font-mono text-[11px]">IEPE Analog to Edge ADC</td>
                <td className="font-mono text-[11px]">0 to 50 mm/s (±0.5%)</td>
                <td className="font-mono text-[11px]">1000 Hz Spectral</td>
              </tr>
              <tr>
                <td className="font-medium text-[var(--text-primary)]">Atmospheric Pressure</td>
                <td>Vaisala PTB330 Class A Digital Barometer</td>
                <td className="font-mono text-[11px]">RS485 Serial Modbus</td>
                <td className="font-mono text-[11px]">500 to 1100 hPa (±0.05 hPa)</td>
                <td className="font-mono text-[11px]">0.5 Hz</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DEPTH SECTIONS: CALIBRATION STATUS, VALIDATION EVIDENCE & VERSIONING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calibration Status Table */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Parameter Calibration &amp; Traceability Registry
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Thermodynamic coefficients calibrated against Antarctic field trials.
              </p>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">ALL CALIBRATED</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-left bg-[var(--surface-subtle)]">
                  <th className="py-1 px-1.5">Coefficient</th>
                  <th className="py-1 px-1.5">Calibrated Value</th>
                  <th className="py-1 px-1.5">Uncertainty</th>
                  <th className="py-1 px-1.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="py-1 px-1.5 text-[var(--text-primary)]">Bharati U-Conductance</td>
                  <td className="py-1 px-1.5">0.18 W/m²·K</td>
                  <td className="py-1 px-1.5">± 0.012</td>
                  <td className="py-1 px-1.5 text-emerald-600 font-bold">NPL Validated</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-[var(--text-primary)]">Maitri U-Conductance</td>
                  <td className="py-1 px-1.5">0.24 W/m²·K</td>
                  <td className="py-1 px-1.5">± 0.018</td>
                  <td className="py-1 px-1.5 text-emerald-600 font-bold">Field Measured</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-[var(--text-primary)]">SFOC Idle Fuel F_0</td>
                  <td className="py-1 px-1.5">4.20 L/h</td>
                  <td className="py-1 px-1.5">± 0.15</td>
                  <td className="py-1 px-1.5 text-emerald-600 font-bold">Dynamometer</td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5 text-[var(--text-primary)]">Cold Plating Coeff α</td>
                  <td className="py-1 px-1.5">0.016 / °C</td>
                  <td className="py-1 px-1.5">± 0.001</td>
                  <td className="py-1 px-1.5 text-emerald-600 font-bold">Arrhenius Fit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Versioning & Changelog */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Model Versioning &amp; Simulation Engine Changelog
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Continuous numerical integration releases and multi-physics verification history.
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--primary)] font-bold">v2.1.0-RK4</span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-primary)]">Engine v2.1.0 (Current):</span>
                <span className="text-emerald-700">2026-09</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                Coupled Runge-Kutta 4th order multi-physics integration, 8-band FFT vibration dynamics, Archard bearing wear, and deterministic Mulberry32 PRNG seed reproducibility.
              </p>
            </div>

            <div className="p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-primary)]">Engine v1.3.0:</span>
                <span className="text-[var(--text-muted)]">2026-04</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                Semi-implicit Euler integration with quasi-steady state fuel and battery storage models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
