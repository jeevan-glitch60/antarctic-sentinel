# ANTARCTIC SENTINEL

> **"From Remote Monitoring to Intelligent Station Management."**
> 
> *A Digital Twin–based remote monitoring, operations, resilience, maintenance, logistics, and decision-support platform for Indian Antarctic research stations (Maitri & Bharati).*

---

## ⚠️ Institutional Demonstrator Notice

```text
================================================================================================
DEMONSTRATOR MODE — SIMULATED DATA — NOT CONNECTED TO LIVE STATION SYSTEMS.
This platform operates in synthetic demonstrator mode for research and operational planning.
It is not connected to real NCPOR, MoES, or active Maitri / Bharati telemetry buses.
================================================================================================
```

---

## Table of Contents

1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Station Profiles: Maitri vs Bharati](#2-station-profiles-maitri-vs-bharati)
3. [Hybrid Discrete-Continuous Multi-Physics Simulation Architecture](#3-hybrid-discrete-continuous-multi-physics-simulation-architecture)
   - [Numerical Integration & State Vector](#numerical-integration--state-vector)
   - [Subsystem Couplings & Positive/Negative Feedback Loops](#subsystem-couplings--positive-negative-feedback-loops)
   - [Deterministic PRNG & Uncertainty Quantification](#deterministic-prng--uncertainty-quantification)
   - [Reproducibility, Bookmarks & ZIP Run Bundles](#reproducibility-bookmarks--zip-run-bundles)
4. [Complete 24-Page Catalog](#4-complete-24-page-catalog)
5. [Key Subsystems & Engineering Formulations](#5-key-subsystems--engineering-formulations)
6. [Design Aesthetics & Research Institutional Palette](#6-design-aesthetics--research-institutional-palette)
7. [Getting Started & Local Execution](#7-getting-started--local-execution)
8. [Comprehensive Manual Test Checklist](#8-comprehensive-manual-test-checklist)
9. [Project Directory Topology](#9-project-directory-topology)

---

## 1. Executive Summary & Purpose

**ANTARCTIC SENTINEL** provides an integrated operational view of two simulated Indian Antarctic research stations — **Maitri** (Schirmacher Oasis, Queen Maud Land) and **Bharati** (Larsemann Hills, East Antarctica). 

The platform combines real-time infrastructure telemetry, microgrid energy tracking, environmental monitoring, satellite connectivity resilience, cascading impact triage, standard operating recovery procedures (SOPs), scientific payload coordination, and supply-chain logistics into a unified decision-support console.

### Operational Problem Solved
Operating scientific stations in Antarctica presents extreme constraints:
- **Severe Isolation**: Complete winter physical isolation from March to October; no emergency physical resupply.
- **Intermittent Satellite Visibility**: Low look-angles ($<12^\circ$ elevation), geostationary keyhole attenuation, and ionospheric scintillation blizzards.
- **Tightly Coupled Subsystems**: A minor generator fuel filter wax clog cascades into power bus voltage sag, which trips life-support space heaters, drops habitat temperatures below $-15^\circ\text{C}$, and freezes Priyadarshini intake water conduits.
- **Strict Safety Triage**: Balancing limited diesel reserves, battery cycles, and critical life-support heating against ongoing atmospheric science observations.

ANTARCTIC SENTINEL bridges remote monitoring and automated decision support, allowing expedition leaders, engineers, and NCPOR scientists in Goa to anticipate failures before they compromise station viability.

---

## 2. Station Profiles: Maitri vs Bharati

| Parameter | Maitri Station (MTR-01) | Bharati Station (BHR-01) |
| :--- | :--- | :--- |
| **Location** | Schirmacher Oasis, Queen Maud Land | Larsemann Hills, Prydz Bay, East Antarctica |
| **Coordinates** | $70^\circ 45' 58''\text{ S},\; 11^\circ 44' 09''\text{ E}$ | $69^\circ 24' 28''\text{ S},\; 76^\circ 11' 14''\text{ E}$ |
| **Elevation** | 1,610 m MSL (Inland rocky nunatak oasis) | ~35 m MSL (Coastal promontory) |
| **Commissioned** | 1989 (36+ seasons in continuous service) | 2012 (Modern state-of-the-art facility) |
| **Structural Envelope** | High-density insulated container modules on rock foundation | Aerodynamic stilted cantilever envelope (wind-shedding) |
| **Primary Power** | $3\times 62.5\text{ kVA}$ Kirloskar Gensets + Solar PV array | $3\times 100\text{ kVA}$ MAN/Volvo Gensets + Combined CHP + BESS |
| **Water Source** | Lake Priyadarshini (3.2 km trace-heated pipeline) | Dual-stage Seawater Reverse Osmosis (SWRO) |
| **Heating Circuit** | Central water-glycol circulation loop + radiant electric | Combined Heat & Power (CHP) engine exhaust recovery + heat pumps |
| **Satellite Uplink** | GSAT-7A C-Band Radome ($9.4^\circ$ elevation look-angle) | GSAT-7A + Maritime Tracking Tracking Radome ($12.1^\circ$ look-angle) |
| **Edge Storage** | 2.5 TB NVMe Store-and-Forward Array | 10.0 TB NVMe Store-and-Forward Array |
| **Overwinter Crew** | 25 Expedition Personnel (Winter 2026) | 23 Expedition Personnel (Winter 2026) |

---

## 3. Hybrid Discrete-Continuous Multi-Physics Simulation Architecture

Unlike conventional UI mockups that update isolated random numbers, ANTARCTIC SENTINEL is driven by a deterministic, hybrid discrete-continuous simulation engine (`src/simulation/multiPhysicsEngine.ts` and `src/simulation/simulationService.ts`).

```
                    ┌──────────────────────────────────────────────┐
                    │       Mulberry32 PRNG (Deterministic)         │
                    │        Seed = 42 · Box-Muller Gaussian       │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
┌──────────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐
│ Discrete Event Queue │ ───► │  1 Hz RK4 / Euler Loop  │ ◄─── │ Interactive Controls │
│ • Fault Injections   │      │  State Vector X(t)      │      │ • Temperature Bias   │
│ • Blackout Schedules │      │  18 Coupled Subsystems  │      │ • Wind Velocity Bias │
│ • Load Shedding Steps│      └────────────┬────────────┘      │ • Degradation Rate   │
└──────────────────────┘                   │                   └──────────────────────┘
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    Station State Vector Update (1 Hz)   │
                      │  • Vibration 8-Band FFT Spectrum        │
                      │  • Archard Bearing Mechanical Wear      │
                      │  • LiFePO4 Internal Resistance & SoC    │
                      │  • 4-Node Lumped Thermal Circuit        │
                      │  • ASTM D341 Fuel Viscosity             │
                      │  • Edge Comms Store-and-Forward Buffer  │
                      └────────────────────┬────────────────────┘
                                           │
                     ┌─────────────────────┴────────────────────┐
                     ▼                                          ▼
      ┌─────────────────────────────┐            ┌─────────────────────────────┐
      │  Monte Carlo Ensemble Runs  │            │  Deterministic Run Exporter │
      │  P5 / P50 / P95 Uncertainty │            │  JSZip Bundle (CSV/JSON/MD) │
      └─────────────────────────────┘            └─────────────────────────────┘
```

### Numerical Integration & State Vector
The engine models continuous physical state dynamics at 1 Hz using 4th-order Runge-Kutta (RK4) integration for stiff differential equations (such as generator rotational dynamics and capacitor discharge) and adaptive Euler stepping for thermal networks:

$$\mathbf{X}(t) = \big[ \omega_{gen},\, T_{core},\, T_{zone},\, SoC,\, R_{int},\, V_{fuel},\, W_{bearing},\, B_{comms} \big]^T$$

- **Generator Dynamics**: Multi-harmonic mechanical vibrations sampled across 8 frequency bands ($1\times, 2\times, 3\times$ shaft order harmonics, unbalance, misalignment, looseness, blade-pass, and bearing cage/ball pass defect frequencies).
- **Archard Mechanical Wear Model**: 
  $$W(t) = W_0 + \int k \cdot \frac{F_N \cdot v}{H} \, dt$$
  Tracks cumulative sub-micron bearing degradation, causing gradual mechanical efficiency loss, vibration amplitude escalation, and specific fuel consumption (SFOC) increases.
- **LiFePO4 Electrochemical Cell**: State-of-Charge (SoC), internal resistance $R_{int}(T, SoC)$ as a function of electrolyte temperature, rate-capacity Peukert effect, and temperature-dependent charging rate limits.
- **4-Node Lumped Thermal Network**:
  $$C_i \frac{dT_i}{dt} = \dot{Q}_{source, i} - \sum_{j} \frac{T_i - T_j}{R_{ij}} - \dot{Q}_{infiltration}(v_{wind}) - \dot{Q}_{radiative}$$
  Nodes: Generator Core $\rightarrow$ Glycol Circuit $\rightarrow$ Main Living/Working Module $\rightarrow$ Exterior Ambient Air.

### Subsystem Couplings & Positive/Negative Feedback Loops
The engine captures realistic cascading feedbacks:
1. **Electrical Overload $\rightarrow$ Thermal $\rightarrow$ Battery Derating Loop**:
   Increased electrical load causes generator core heating and battery current spikes. If ambient temperature drops, battery internal resistance rises, generating internal $I^2 R$ heat, reducing effective discharge capacity and triggering the 4-tier load shedding ladder.
2. **Bearing Degradation $\rightarrow$ Fuel Inefficiency Loop**:
   Bearing wear induces structural micro-vibrations, increasing mechanical friction losses. The engine governor injects more fuel to maintain 1500 RPM (50.0 Hz), elevating Specific Fuel Oil Consumption (SFOC from 208 to $>235\text{ g/kWh}$) and driving up exhaust temperatures.
3. **Environmental Infiltration $\rightarrow$ Heating Demand Loop**:
   High wind gusts ($>85\text{ km/h}$) increase building envelope infiltration, accelerating zone temperature decay and forcing trace-heating relays to draw maximum power from the microgrid.

### Deterministic PRNG & Uncertainty Quantification
All stochastic elements (sensor jitter, wind micro-turbulence, ionospheric fading) use the deterministic **Mulberry32 PRNG** algorithm initialized with seed `42`. Gaussian perturbations are generated via Box-Muller transformation.

- **Monte Carlo Ensembles**: Fast-forward simulations run 50–100 stochastic trajectory runs over a 48-hour horizon to calculate **P5 (optimistic)**, **P50 (median)**, and **P95 (worst-case)** probability bounds for fuel exhaustion, battery depletion, and freezing thresholds.

### Reproducibility, Bookmarks & ZIP Run Bundles
Every simulation run state is fully reproducible. The platform includes a unified time-travel scrub bar, snapshot bookmarks, and instant **JSZip** packaging:
- `manifest.json`: Station identifier, PRNG seed, scenario tag, engine version, and timestamp.
- `telemetry.csv`: High-resolution 1 Hz multi-channel physical parameters.
- `events.json`: Chronological audit log of fault injections, load shedding events, and operator actions.
- `summary.md`: Human-readable engineering handover briefing with P50 metrics and open alerts.

---

## 4. Complete 24-Page Catalog

ANTARCTIC SENTINEL is organized into 5 logical navigation groups containing 24 purpose-built pages:

```
ANTARCTIC SENTINEL
├── 1. OPERATIONS & MONITORING
│   ├── Page 1:  Mission Gateway                 (/)
│   ├── Page 2:  Command Center                  (/dashboard)
│   ├── Page 3:  Station Digital Twin            (/digital-twin)
│   ├── Page 4:  Live Telemetry                  (/telemetry)
│   ├── Page 5:  Alerts & Incidents              (/alerts)
│   └── Page 6:  Connectivity Resilience        (/connectivity)
├── 2. ANALYSIS & PLANNING
│   ├── Page 7:  Impact & Priority Engine        (/impact)
│   ├── Page 8:  What-If Simulation              (/simulation)
│   ├── Page 9:  Recovery Planner                (/recovery)
│   ├── Page 10: Energy & Resources              (/energy)
│   ├── Page 11: Environment & Weather          (/environment)
│   └── Page 12: Logistics & Inventory           (/logistics)
├── 3. SIMULATION & ENGINEERING LAB
│   ├── Page 13: Analytics & Trends              (/analytics)
│   ├── Page 14: Simulation Lab                 (/simulation-lab)
│   ├── Page 15: Subsystem Physics               (/physics)
│   └── Page 16: Coupled Systems Dynamics        (/coupled)
├── 4. STATION OPERATIONS & SCIENCE
│   ├── Page 17: Maintenance Lifecycle           (/lifecycle)
│   ├── Page 18: Crew Operations & Life Support  (/crew)
│   ├── Page 19: Science Payloads & Experiments  (/science)
│   ├── Page 20: Geographic & Remote Sensing     (/geo)
│   └── Page 21: Multi-Station Coordination      (/coordination)
└── 5. SYSTEM & GOVERNANCE
    ├── Page 22: Report Generator & Handover     (/reports)
    ├── Page 23: Methods, Equations & Data       (/methods)
    ├── Page 24: Security & Access Control       (/security)
    └── Settings Modal / Console Config          (/settings)
```

### Detailed View Descriptions

#### 1. Operations & Monitoring
- **Page 1: Mission Gateway (`/`)**: Entry landing page introducing the institutional mission, real-time station cards (Maitri vs Bharati), station quick-switcher, and direct workflow launchpads.
- **Page 2: Command Center (`/dashboard`)**: Primary station overview screen featuring the Station Subsystem Matrix, live 4-metric primary strip, "Just changed (last 60s)" multi-physics delta panel, active alerts counter, and quick fault injector.
- **Page 3: Station Digital Twin (`/digital-twin`)**: Interactive 2.5D isometric SVG canvas modeling 15 structural modules. Features 4 switchable multi-physics layers (Thermal Blooms, Airflow Streamlines, Acoustic dBA Contours, Comms Line-of-Sight Tracking Arcs) and a live Component Inspector with sparkline charts.
- **Page 4: Live Telemetry (`/telemetry`)**: High-frequency streaming sensor charts with interactive time-range selector (1h to 30d), FFT 8-Band Vibration Spectrum card, Cross-Sensor Correlation Heatmap ($10\times 10$), and Additive Time-Series Decomposition (Trend + Seasonality + Residual).
- **Page 5: Alerts & Incidents (`/alerts`)**: Incident response board with automated Root-Cause Cascade Tree Clustering, 4-tier severity triage, interactive telemetry freeze-frames, snooze with rationale, and 1-click Post-Incident Review (PIR) report drafting.
- **Page 6: Connectivity Resilience (`/connectivity`)**: Ground station radome gimbal polar tracking dial (Az/El/Polarization), LEO satellite Doppler shift predictor ($\pm 42\text{ kHz}$ S-band), ionospheric blackout forecasting calendar, cryptographic SHA-256 telemetry frame verification, and NVMe store-and-forward edge buffer management.

#### 2. Analysis & Planning
- **Page 7: Impact & Priority Engine (`/impact`)**: Multi-Criteria Decision Analysis (MCDA) matrix with adjustable objective weights, interactive dependency cascade graph, Time-to-Critical thermal decay curves with P5/P50/P95 uncertainty envelopes, and optimal operator intervention windows.
- **Page 8: What-If Simulation (`/simulation`)**: Interactive scenario testing workbench with Sensitivity Tornado Diagram (evaluating parameter elasticity on Time-to-Critical) and a Taguchi L9 Orthogonal Design of Experiments (DoE) array for multi-variable stress testing.
- **Page 9: Recovery Planner (`/recovery`)**: Field-proven Standard Operating Procedure (SOP) execution checklists (SOP-01 to SOP-03), certified technician assignment validator, stock reserve availability verifier, resource-leveling timeline, rollback safeguard actions, and recovery cost estimation.
- **Page 10: Energy & Resources (`/energy`)**: Hybrid microgrid dispatch monitor with IEEE 519 Grid Frequency (50.02 Hz) and THD harmonic spectrum, fuel burn rate vs remaining wintering days, water tank levels, 4-tier automatic load shedding priority ladder, and interactive Black Start sequence simulation.
- **Page 11: Environment & Weather (`/environment`)**: Antarctic meteorology station with Blowing Snow Index (BSI), wind chill equivalent temperature, Antarctic Blizzard Classifications (Condition 1 to 3), frostbite exposure safety threshold table, Heating Degree Days (HDD) accumulation, and astronomical solar elevation ephemeris.
- **Page 12: Logistics & Inventory (`/logistics`)**: Cold-storage warehouse depot bin locator, critical spare parts inventory, consumption rate vs wintering endurance, and annual Indian Scientific Expedition to Antarctica (ISEA) resupply vessel voyage timeline.

#### 3. Simulation & Engineering Lab
- **Page 13: Analytics & Trends (`/analytics`)**: Historical reliability tracking, Remaining Useful Life (RUL) Weibull hazard estimation with $90\%$ confidence bounds, and CUSUM (Cumulative Sum) statistical change-point detection for early sensor drift anomaly alerting.
- **Page 14: Simulation Lab (`/simulation-lab`)**: Advanced simulator workbench featuring interactive playback scrub bar (rewind, pause, step, fast-forward $1\times$ to $50\times$), multi-run ensemble comparison, parameter sweep 2D contour heatmap, P5/P50/P95 uncertainty fan charts, snapshot bookmarks, and instant **JSZip** run bundle exporter.
- **Page 15: Subsystem Physics (`/physics`)**: Comprehensive mathematical physics textbook view detailing governing differential equations (Newton-Richmann cooling, diesel SFOC, LiFePO4 Arrhenius derating, and MCDA TOPSIS formulas) with interactive parameter sliders, live dynamic Recharts response curves, units, and direct codebase references.
- **Page 16: Coupled Systems Dynamics (`/coupled`)**: Holistic macro-system view featuring interactive SVG Energy Sankey diagram (fuel chemical energy $\rightarrow$ shaft work $\rightarrow$ electricity + heat recovery $\rightarrow$ building loads $\rightarrow$ thermal loss), Mass Balance ledger (fuel, air, water, and greywater), 4-Node Thermal Network schematic, and dynamic feedback loop gain analysis.

#### 4. Station Operations & Science
- **Page 17: Maintenance Lifecycle (`/lifecycle`)**: Engineering asset register tracking 18 physical subsystems, degradation trajectories with Weibull hazard curves, calendar-based preventative maintenance schedules, spare parts consumption forecasts, and interactive maintenance deferral risk simulator.
- **Page 18: Crew Operations & Life Support (`/crew`)**: Overwintering personnel roster with zone assignments, metabolic rate outputs, ISO 7730 PMV (Predicted Mean Vote) and PPD (Predicted Percentage of Dissatisfied) thermal comfort indices, closed-loop life support atmospheric monitoring ($\text{O}_2, \text{CO}_2$, volatile compounds, VOCs), and 24-hour daily station schedule.
- **Page 19: Science Payloads & Experiments (`/science`)**: Real-time monitoring of active Antarctic scientific payloads (FTIR atmospheric trace gas spectrometer, broad-band seismometer, fluxgate magnetometer, digital ionosonde, air chemistry sampling), operating power/thermal envelopes, fault-to-science cascade matrix, and end-to-end science data acquisition pipeline.
- **Page 20: Geographic & Remote Sensing (`/geo`)**: Interactive Polar Stereographic projection map of the Antarctic continent (featuring Maitri, Bharati, Novolazarevskaya, Princess Elisabeth, Zhongshan, Progress II, and Davis stations), satellite sea ice concentration extent, katabatic storm track overlays, satellite pass Gantt prediction, and inter-station resupply corridors.
- **Page 21: Multi-Station Coordination (`/coordination`)**: Dual-station comparative operational console comparing Maitri and Bharati side-by-side, shared emergency spares inventory pool, expedition specialist cross-deployment matrix, and inter-station emergency fuel/airlift transfer simulator.

#### 5. System & Governance
- **Page 22: Report Generator & Handover (`/reports`)**: Automated operational report builder generating Shift Handover Watch Logs, Incident Investigation Dossiers, and Weekly Station Engineering Summaries with seed metadata, Markdown export, and print/PDF-optimized layout.
- **Page 23: Methods, Equations & Data (`/methods`)**: Mathematical formulation documentation, sensor calibration statuses, NIST/ISO calibration traceability certificates, empirical validation test benchmarks, and simulation engine revision history.
- **Page 24: Security & Access Control (`/security`)**: Role-Based Access Control (RBAC) permissions matrix, role switcher (Commander, Chief Engineer, Remote Scientist, Auditor), cryptographic key rotation schedules, X.509 satellite certificate expiry countdowns, NCPOR data security classifications, and immutable command audit trail.
- **Settings Modal (`/settings`)**: Station global configuration dialog for theme switching (light/dark mode), simulation tick rate tuning, and alarm buzzer muting.

---

## 5. Key Subsystems & Engineering Formulations

### 1. Newton-Richmann Lumped Capacitance Thermal Decay
Used in `/physics`, `/coupled`, and `/impact`:

$$T(t) = T_{ambient} + \big(T_0 - T_{ambient}\big) \cdot \exp\left(-\frac{U \cdot A}{m \cdot c_p} \cdot t\right)$$

- $U$: Overall heat transfer coefficient ($0.22\text{ W/m}^2\text{K}$ for insulated Antarctic sandwich panels).
- $A$: Exposed surface area ($850\text{ m}^2$).
- $m \cdot c_p$: Effective building thermal capacitance ($1.42 \times 10^7\text{ J/K}$).

### 2. Diesel Generator Specific Fuel Consumption (SFOC)
Used in `/physics` and `/energy`:

$$\text{SFOC}(L) = \text{SFOC}_{rated} \cdot \left(1 + \alpha_{wear} \cdot \frac{t_{hours}}{8760} + \beta \cdot (1 - L)^2\right)$$

- Models efficiency penalties at low load ($L < 0.40$) due to incomplete combustion and cylinder bore glazing, amplified by bearing wear $\alpha_{wear}$.

### 3. Fuel Viscosity Variation (ASTM D341 Walther Equation)
Used in `/simulation/multiPhysicsEngine.ts`:

$$\log_{10}\big(\log_{10}(\nu + 0.7)\big) = A - B \cdot \log_{10}(T_K)$$

- Accounts for sub-zero fuel wax crystallization and viscosity increases when fuel temperature drops below $-10^\circ\text{C}$ in external storage day-tanks.

### 4. LiFePO4 Low-Temperature Arrhenius Capacity Derating
Used in `/physics` and `/energy`:

$$C_{eff}(T) = C_{nom} \cdot \left[ 1 - \gamma \cdot \max(0, T_{ref} - T_{batt}) \right] \cdot \exp\left(-\frac{E_a}{R} \left( \frac{1}{T_{batt}} - \frac{1}{T_{ref}} \right)\right)$$

- Disables high-rate charging below $0^\circ\text{C}$ to prevent lithium plating and dendrite shorts.

### 5. Multi-Criteria Decision Analysis (MCDA / TOPSIS)
Used in `/impact`:

$$\text{Priority Score} = w_1 S_{life\_safety} + w_2 S_{thermal} + w_3 S_{power} + w_4 S_{comms} + w_5 S_{science}$$

- Dynamically re-ranks incoming maintenance alarms and triggers automated load shedding.

---

## 6. Design Aesthetics & Research Institutional Palette

ANTARCTIC SENTINEL follows strict visual guidelines tailored for scientific consoles:

- **Calm & Dense**: High information density without visual clutter. Zero neon glows, zero playful gamification.
- **Light Mode Default**: Crisp research console palette (`#F7F8FA` background, `#FFFFFF` cards, `#E2E5EA` hairline borders, `#2C5F8A` research blue).
- **Tabular Numerals**: Numeric telemetry uses `IBM Plex Mono` / `ui-monospace` with `font-variant-numeric: tabular-nums` to eliminate jitter during real-time streaming.
- **Subtle Status Encoding**: 3px hairline left borders on cards indicate status (`#2563EB` nominal, `#D97706` warning, `#DC2626` critical); filled solid pills are reserved strictly for high-severity alerts.
- **Persistent Demonstrator Notice**: Displayed on all views, report exports, and printed summaries.

---

## 7. Getting Started & Local Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
# 1. Clone or navigate to the repository directory
cd "c:/Users/Jeevan/OneDrive/Desktop/Artic Sentinel"

# 2. Install project dependencies
npm install
```

### Development Server
```bash
# Start Vite development server
npm run dev
```
Open your browser and navigate to: **[http://localhost:5173/](http://localhost:5173/)**

### Production Build
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Comprehensive Manual Test Checklist

Use this structured verification protocol to validate all 24 pages and multi-physics features:

| Step | Page / Component | Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **01** | **Mission Gateway (`/`)** | Click "Maitri Station" or "Bharati Station" | Switches active station context across all headers and telemetry streams. |
| **02** | **Command Center (`/dashboard`)** | Inspect Subsystem Matrix and Delta Panel | Displays 6 primary subsystems with real-time micro-physics changes (last 60s). |
| **03** | **Digital Twin (`/digital-twin`)** | Toggle layers: Thermal, Airflow, Acoustic, Comms | Interactive overlays render on 2.5D SVG canvas; clicking any module opens inspector. |
| **04** | **Live Telemetry (`/telemetry`)** | Scroll to FFT Spectrum and Correlation Matrix | 8-band vibration spectrum renders with harmonic markers; matrix displays sensor Pearson coefficients. |
| **05** | **Alerts (`/alerts`)** | Click "Trigger Emergency Test Cascade" | Injects Generator 2 trip; generates alert tree with root-cause clustering and PIR report link. |
| **06** | **Connectivity (`/connectivity`)** | Observe Radome Gimbal and LEO Doppler curve | Polar tracking indicator moves; Doppler curve reflects $\pm 42\text{ kHz}$ shift; NVMe buffer displays live MB. |
| **07** | **Impact Engine (`/impact`)** | Adjust MCDA weight sliders (Life Safety, Power, Comms) | Cascade priority rankings recalculate live; Time-to-Critical curve displays P5/P50/P95 uncertainty. |
| **08** | **What-If Simulation (`/simulation`)** | Adjust Ambient Temp slider to $-45^\circ\text{C}$ and Wind to $90\text{ km/h}$ | Sensitivity Tornado chart updates; Taguchi L9 array shows worst-case scenario. |
| **09** | **Recovery Planner (`/recovery`)** | Open SOP-01 (Generator Auto-Start) and tick steps | Live technician validation tags update; resource leveling timeline reflects crew workload. |
| **10** | **Energy & Resources (`/energy`)** | Check Grid Frequency card and Load Shedding ladder | Frequency displays nominal $50.02\text{ Hz}$ with THD spectrum; Tier 1–4 shedding triggers dynamically. |
| **11** | **Environment (`/environment`)** | Inspect Blowing Snow Index (BSI) and Blizzard level | Displays Condition 1–3 classification; frostbite table shows threshold in minutes. |
| **12** | **Logistics (`/logistics`)** | Filter spare parts by "Critical" and inspect Bin Locations | Displays warehouse depot rack/bin codes and days of remaining endurance. |
| **13** | **Analytics & Trends (`/analytics`)** | Inspect RUL Hazard curve and CUSUM Drift card | Shows cumulative failure probability curve and automated changepoint detection. |
| **14** | **Simulation Lab (`/simulation-lab`)** | Click Play, scrub timeline slider, click "Export Run (.ZIP)" | Simulator scrubs backward/forward; downloads deterministic `.zip` containing CSV, JSON, and Markdown files. |
| **15** | **Subsystem Physics (`/physics`)** | Select "Thermal Infiltration" and drag Ambient Temp slider | Mathematical equation renders with live Recharts curve and units documentation. |
| **16** | **Coupled Systems (`/coupled`)** | View Energy Sankey Diagram and Mass Balance ledger | SVG Sankey flows render energy distributions; Mass balance shows net inputs vs outputs. |
| **17** | **Maintenance (`/lifecycle`)** | Select Generator Bearing asset and click "Simulate 30d Deferral" | Displays increased failure probability and accelerated wear trajectory. |
| **18** | **Crew Operations (`/crew`)** | Check Thermal Comfort panel and Life Support atmospheric gases | ISO 7730 PMV/PPD gauge displays comfort score; $\text{O}_2/\text{CO}_2$ bars update dynamically. |
| **19** | **Science Payloads (`/science`)** | Click "FTIR Spectrometer" and inspect Fault Cascade | Shows instrument power budget ($1,200\text{ W}$) and dependency on station warm-circuit power. |
| **20** | **Geographic View (`/geo`)** | Hover over polar map stations and inspect Satellite Gantt | Antarctic stereographic map renders stations; satellite passes show Az/El acquisition windows. |
| **21** | **Coordination (`/coordination`)** | Toggle "Transfer 500L Fuel MTR $\rightarrow$ BHR" | Simulates logistical transfer flight window and calculates net station endurance balance. |
| **22** | **Report Generator (`/reports`)** | Select "Shift Handover Log" and click "Download Markdown" | Exports formatted markdown handover dossier stamped with engine seed and timestamp. |
| **23** | **Methods & Equations (`/methods`)** | Review Sensor Calibration Statuses and NIST Traceability | Displays sensor calibration certificate dates, validation test bench data, and engine changelog. |
| **24** | **Security & Access (`/security`)** | Switch role to "Remote Scientist" then "Chief Engineer" | Interface adapts available privileges; displays cryptographic satellite certificate expiry. |

---

## 9. Project Directory Topology

```
c:/Users/Jeevan/OneDrive/Desktop/Artic Sentinel/
├── public/                     # Static assets and station schematics
├── src/
│   ├── assets/                 # Brand assets and graphics
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Badges, metric cards, status indicators, tabs
│   │   ├── digital-twin/       # 2.5D Isometric SVG canvas, layers, component inspector
│   │   └── layout/             # Header, Navigation Sidebar (5 groups), Footer disclaimer
│   ├── context/                # Global station state (StationContext.tsx)
│   ├── pages/                  # 24 Functional Page Views
│   │   ├── MissionGatewayPage.tsx          (Page 1)
│   │   ├── CommandCenterPage.tsx           (Page 2)
│   │   ├── DigitalTwinPage.tsx             (Page 3)
│   │   ├── TelemetryPage.tsx               (Page 4)
│   │   ├── AlertsPage.tsx                  (Page 5)
│   │   ├── ConnectivityPage.tsx            (Page 6)
│   │   ├── ImpactEnginePage.tsx            (Page 7)
│   │   ├── SimulationPage.tsx              (Page 8)
│   │   ├── RecoveryPlannerPage.tsx         (Page 9)
│   │   ├── EnergyPage.tsx                  (Page 10)
│   │   ├── EnvironmentPage.tsx             (Page 11)
│   │   ├── LogisticsPage.tsx               (Page 12)
│   │   ├── AnalyticsPage.tsx               (Page 13)
│   │   ├── SimulationLabPage.tsx           (Page 14)
│   │   ├── SubsystemPhysicsPage.tsx        (Page 15)
│   │   ├── CoupledSystemsPage.tsx          (Page 16)
│   │   ├── MaintenanceLifecyclePage.tsx    (Page 17)
│   │   ├── CrewOperationsPage.tsx          (Page 18)
│   │   ├── SciencePayloadPage.tsx          (Page 19)
│   │   ├── GeographicRemoteSensingPage.tsx (Page 20)
│   │   ├── MultiStationCoordinationPage.tsx(Page 21)
│   │   ├── ReportGeneratorPage.tsx         (Page 22)
│   │   ├── MethodsPage.tsx                 (Page 23)
│   │   ├── SecurityPage.tsx                (Page 24)
│   │   └── SettingsModal.tsx               (Console Configuration)
│   ├── simulation/             # Hybrid Discrete-Continuous Multi-Physics Core
│   │   ├── types.ts            # State vector, coupled subsystem, and event interfaces
│   │   ├── prng.ts             # Deterministic Mulberry32 PRNG & Box-Muller generator
│   │   ├── multiPhysicsEngine.ts # 1 Hz RK4/Euler integration, Archard wear, thermal loop
│   │   ├── simulationService.ts# History buffers, Monte Carlo runner, JSZip bundle exporter
│   │   └── mockData.ts         # Station baseline parameters, spares inventory, SOP catalog
│   ├── App.tsx                 # Route declarations & top-level layout wrapper
│   ├── main.tsx                # Application entry point
│   └── index.css               # Design tokens, typography, and hairline styling
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler build settings
└── README.md                   # Comprehensive technical documentation
```

---

## License & Attribution

Developed as a demonstration platform for Indian Antarctic research station monitoring and operations.  
All technical specifications for **Maitri** and **Bharati** stations are synthesized from public scientific expedition literature (National Centre for Polar and Ocean Research - NCPOR / Ministry of Earth Sciences, Government of India).
