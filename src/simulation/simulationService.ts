/**
 * ANTARCTIC SENTINEL — Simulation Service
 * Manages physics engine ticks, time-travel history buffers, Monte Carlo runs,
 * parameter sweeps, bookmarks, and reproducible ZIP bundle exports.
 */

import { MultiPhysicsEngine } from './multiPhysicsEngine';
import { 
  MultiPhysicsStateVector, 
  SimulationSessionManifest, 
  UncertaintyBands, 
  EnsembleRunResult 
} from './types';
import JSZip from 'jszip';

export interface TimelineBookmark {
  id: string;
  sim_time_s: number;
  label: string;
  note: string;
  created_at: string;
}

export class SimulationService {
  private engine: MultiPhysicsEngine;
  private history: MultiPhysicsStateVector[] = [];
  private bookmarks: TimelineBookmark[] = [];
  private maxHistoryLength: number = 600; // 10 minutes of 1 Hz resolution
  private currentManifest: SimulationSessionManifest;
  private stationId: 'MAITRI' | 'BHARATI';
  private seed: number;

  constructor(stationId: 'MAITRI' | 'BHARATI' = 'MAITRI', seed: number = 42, scenario: string = 'baseline_polar') {
    this.stationId = stationId;
    this.seed = seed;
    this.engine = new MultiPhysicsEngine(stationId, seed);
    
    this.currentManifest = {
      session_id: `SIM-${new Date().toISOString().slice(0, 10)}-A`,
      name: `${stationId} Polar Operational Run`,
      scenario,
      seed,
      engine_version: 'v2.1.0-polar-physics',
      created_at: new Date().toISOString(),
      duration_sim_s: 0,
      time_step_s: 1.0,
      notes: 'Calibrated research demonstrator session with coupled thermal-electrical multi-physics.',
      subsystem_states_count: 9
    };

    // Pre-populate with initial 30 seconds of physics history
    const base = this.engine.getState();
    this.history.push(JSON.parse(JSON.stringify(base)));
    for (let i = 1; i <= 30; i++) {
      const next = this.engine.step(1.0);
      this.history.push(JSON.parse(JSON.stringify(next)));
    }
  }

  public step(dt: number = 1.0): MultiPhysicsStateVector {
    const nextState = this.engine.step(dt);
    const cloned = JSON.parse(JSON.stringify(nextState));
    this.history.push(cloned);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
    this.currentManifest.duration_sim_s = nextState.timestamp_sim_s;
    return cloned;
  }

  public getCurrentState(): MultiPhysicsStateVector {
    return this.engine.getState();
  }

  public getHistory(): MultiPhysicsStateVector[] {
    return this.history;
  }

  public getManifest(): SimulationSessionManifest {
    return this.currentManifest;
  }

  public addBookmark(label: string, note: string): TimelineBookmark {
    const bm: TimelineBookmark = {
      id: `BM-${Date.now().toString().slice(-4)}`,
      sim_time_s: this.getCurrentState().timestamp_sim_s,
      label,
      note,
      created_at: new Date().toLocaleTimeString('en-GB')
    };
    this.bookmarks.push(bm);
    return bm;
  }

  public getBookmarks(): TimelineBookmark[] {
    return this.bookmarks;
  }

  public injectFault(faultName: string) {
    this.engine.injectFault(faultName);
  }

  public clearFaults() {
    this.engine.clearFaults();
  }

  /**
   * Run Monte Carlo Ensemble (N replicates with perturbed seeds)
   */
  public runEnsemble(numRuns: number = 50): EnsembleRunResult[] {
    const results: EnsembleRunResult[] = [];
    for (let r = 0; r < numRuns; r++) {
      const runSeed = this.seed + r * 17;
      const sim = new MultiPhysicsEngine(this.stationId, runSeed);
      
      // Simulate 60 minutes (3600s) in fast-forward
      for (let s = 0; s < 60; s++) {
        sim.step(60.0);
      }
      
      const st = sim.getState();
      const fuelConsumed = 12400 - st.fuel.tank_level_l;
      const timeToFreeze = Math.max(2.0, (st.zones.living.air_temp_c - 5.0) / 1.8);

      results.push({
        run_index: r + 1,
        seed: runSeed,
        final_health_pct: Number(st.generator.health_pct.toFixed(1)),
        fuel_consumed_l: Number(fuelConsumed.toFixed(1)),
        downtime_minutes: st.generator.health_pct < 60 ? 45 : 0,
        time_to_freeze_hours: Number(timeToFreeze.toFixed(1)),
        alerts_count: st.events.length
      });
    }
    return results;
  }

  /**
   * Run Parameter Sweep (e.g. Ambient Temp vs Time-to-Critical Freeze)
   */
  public runParameterSweep(
    paramName: 'ambientTemp',
    minVal: number = -50,
    maxVal: number = -10,
    steps: number = 10
  ): { inputVal: number; timeToFreezeHours: number; fuelBurnLph: number }[] {
    const sweepResults = [];
    const stepSize = (maxVal - minVal) / (steps - 1);

    for (let i = 0; i < steps; i++) {
      const inputVal = Number((minVal + i * stepSize).toFixed(1));
      const deltaT = 21.0 - inputVal;
      // High wind convective multiplier
      const timeToFreeze = Number((1800 / (deltaT * 3.2 * 1.35) * (deltaT / 40.0)).toFixed(1));
      const fuelBurn = Number((18.2 + (Math.abs(inputVal) / 50.0) * 8.5).toFixed(1));

      sweepResults.push({
        inputVal,
        timeToFreezeHours: Math.max(1.5, timeToFreeze),
        fuelBurnLph: fuelBurn
      });
    }
    return sweepResults;
  }

  /**
   * Generate and download complete reproducible ZIP Bundle:
   * manifest.json, telemetry.csv, events.json, summary.md
   */
  public async exportRunBundle(): Promise<Blob> {
    const zip = new JSZip();

    // 1. Manifest
    zip.file("manifest.json", JSON.stringify(this.currentManifest, null, 2));

    // 2. Events Log
    zip.file("events.json", JSON.stringify(this.getCurrentState().events, null, 2));

    // 3. Telemetry CSV
    const headers = "sim_time_s,gen_vibration_rms,gen_bearing_temp,gen_load_kw,fuel_level_l,battery_soc,living_temp_c,ambient_temp_c,comms_latency_ms\n";
    const csvRows = this.history.map(s => 
      `${s.timestamp_sim_s},${s.generator.vibration_rms_mms},${s.generator.bearing_temp_c},${s.generator.electrical_load_kw},${s.fuel.tank_level_l.toFixed(1)},${s.battery.soc_pct.toFixed(1)},${s.zones.living.air_temp_c.toFixed(1)},${s.environment.temp_c.toFixed(1)},${s.comms.latency_ms}`
    ).join("\n");
    zip.file("telemetry.csv", headers + csvRows);

    // 4. Summary Report Markdown
    const summaryMd = `# ANTARCTIC SENTINEL — SIMULATION RUN SUMMARY REPORT
Session ID: ${this.currentManifest.session_id}
Scenario: ${this.currentManifest.scenario}
Seed: ${this.currentManifest.seed}
Engine Version: ${this.currentManifest.engine_version}
Station: ${this.stationId}
Duration: ${this.currentManifest.duration_sim_s} seconds

## Executive Finding:
Coupled multi-physics integration performed across thermal, generator, fuel, and comms domains.
Current Generator Health: ${this.getCurrentState().generator.health_pct}%
Living Habitat Temperature: ${this.getCurrentState().zones.living.air_temp_c.toFixed(1)} °C
Fuel Level Remaining: ${this.getCurrentState().fuel.tank_level_l.toFixed(1)} Liters

⚠️ DEMONSTRATOR MODE — SIMULATED DATA — NOT CONNECTED TO LIVE STATION SYSTEMS.
`;
    zip.file("summary.md", summaryMd);

    return await zip.generateAsync({ type: "blob" });
  }
}
