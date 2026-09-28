/**
 * ANTARCTIC SENTINEL — Hybrid Discrete-Continuous Multi-Physics Simulation Engine
 * Integrates coupled differential equations for thermal, mechanical, electrical,
 * and chemical systems with discrete stochastic events.
 */

import { MultiPhysicsStateVector, DiscreteEvent } from './types';
import { SeededPRNG } from './prng';

export class MultiPhysicsEngine {
  private state: MultiPhysicsStateVector;
  private prng: SeededPRNG;
  private initialSeed: number;
  private activeFaults: Set<string>;

  constructor(stationId: 'MAITRI' | 'BHARATI' = 'MAITRI', seed: number = 42) {
    this.initialSeed = seed;
    this.prng = new SeededPRNG(seed);
    this.activeFaults = new Set();
    this.state = this.getBaselineState(stationId, seed);
  }

  public getBaselineState(stationId: 'MAITRI' | 'BHARATI', seed: number): MultiPhysicsStateVector {
    const isMaitri = stationId === 'MAITRI';
    return {
      timestamp_sim_s: 0,
      timestamp_iso: new Date().toISOString(),
      station_id: stationId,
      engine_version: 'v2.1.0-polar-physics',
      seed,
      generator: {
        rotor_temp_c: 78.4,
        winding_temp_c: 82.1,
        bearing_temp_c: 64.5,
        // 8 frequency bands (mm/s): [0.5X, 1X, 2X, 3X, BPFO, BPFI, BSF, HighFreq]
        vibration_spectrum: [0.2, 1.4, 0.6, 0.3, 0.4, 0.2, 0.1, 0.1],
        vibration_rms_mms: 2.8,
        fuel_rail_pressure_bar: 1850.0,
        oil_pressure_bar: 4.8,
        oil_temp_c: 86.2,
        thermal_mass_temp_c: 72.0,
        health_pct: 96.0,
        cycles: 1420,
        running_hours: 4820,
        bearing_wear_microns: 14.2,
        injection_timing_deg: -12.5,
        lambda: 1.28,
        electrical_load_kw: isMaitri ? 420.0 : 480.0
      },
      battery: {
        cell_temp_c: 21.4,
        soc_pct: 65.0,
        soh_pct: 98.4,
        internal_resistance_mohm: 14.2,
        cycle_count: 320,
        thermal_jacket_temp_c: 22.0,
        voltage_v: 412.5,
        current_a: -85.0
      },
      thermal_loop: {
        glycol_temp_out_gen: 84.5,
        glycol_temp_in_hx: 82.0,
        glycol_temp_out_hx: 58.5,
        glycol_temp_in_building: 56.0,
        flow_rate_lpm: 120.0,
        pump_current_a: 8.4,
        valve_position_pct: 65.0,
        loop_pressure_bar: 2.4
      },
      zones: {
        living: {
          air_temp_c: 21.0,
          wall_temp_c: 18.2,
          thermal_mass_temp_c: 19.5,
          infiltration_rate_ach: 0.35,
          occupancy: 18,
          humidity_pct: 42.0,
          co2_ppm: 680
        },
        lab: {
          air_temp_c: 19.8,
          wall_temp_c: 17.5,
          thermal_mass_temp_c: 18.0,
          infiltration_rate_ach: 0.40,
          occupancy: 4,
          humidity_pct: 38.0,
          co2_ppm: 540
        },
        generator_room: {
          air_temp_c: 28.5,
          wall_temp_c: 22.0,
          thermal_mass_temp_c: 26.0,
          infiltration_rate_ach: 0.85,
          occupancy: 2,
          humidity_pct: 30.0,
          co2_ppm: 780
        }
      },
      fuel: {
        tank_level_l: 12400,
        tank_temp_c: -6.5,
        viscosity_cst: 3.8,
        water_content_ppm: 42,
        burn_rate_lph: 18.2
      },
      water: {
        storage_level_l: 8400,
        ro_throughput_lph: 350.0,
        heater_status: true,
        snow_melt_intake_lph: 180.0
      },
      comms: {
        link_state: 'Nominal',
        snr_db: 16.4,
        latency_ms: 118,
        jitter_ms: 12,
        packet_loss_pct: 0.02,
        buffer_occupancy_mb: 14.0,
        antenna_az_deg: 9.4,
        antenna_el_deg: 14.2,
        doppler_shift_hz: 42.0
      },
      crew: [
        { id: 'C1', name: 'Dr. Anita Sen', role: 'Station Commander', zone: 'Habitation Pod', metabolic_rate_w: 120, activity_level: 'Nominal' },
        { id: 'C2', name: 'Rajesh Sharma', role: 'Chief Engineer', zone: 'Generator Annex', metabolic_rate_w: 180, activity_level: 'Strenuous Work' },
        { id: 'C3', name: 'Dr. Vikram Joshi', role: 'Science Lead', zone: 'Science Lab', metabolic_rate_w: 110, activity_level: 'Nominal' },
        { id: 'C4', name: 'Kiran Patel', role: 'Remote Operator', zone: 'Comms Shack', metabolic_rate_w: 100, activity_level: 'Rest' }
      ],
      environment: {
        temp_c: isMaitri ? -18.4 : -14.2,
        wind_ms: isMaitri ? 16.8 : 22.4,
        wind_gust_ms: isMaitri ? 24.2 : 31.0,
        humidity_pct: 72.0,
        pressure_hpa: 984.2,
        solar_irradiance_wm2: 680.0,
        cloud_cover_pct: 25.0,
        snow_depth_m: 1.4,
        geomagnetic_kp: 3.0
      },
      events: []
    };
  }

  public injectFault(faultName: string) {
    this.activeFaults.add(faultName);
    this.state.events.unshift({
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp_sim_s: this.state.timestamp_sim_s,
      type: 'FAULT_ONSET',
      subsystem: 'Dynamics Modification',
      description: `Injected state fault: ${faultName}`,
      severity: 'Critical'
    });
  }

  public clearFaults() {
    this.activeFaults.clear();
  }

  /**
   * 1 Hz Physics Step Integration (Semi-Implicit Euler & Coupled Differential Dynamics)
   */
  public step(dt_seconds: number = 1.0): MultiPhysicsStateVector {
    const s = this.state;
    const p = this.prng;
    s.timestamp_sim_s += dt_seconds;

    // 1. Environmental Weather Dynamics (Random walk + diurnal variation)
    const tempNoise = p.gaussian(0, 0.05);
    const windNoise = p.gaussian(0, 0.15);
    s.environment.temp_c += tempNoise;
    s.environment.wind_ms = Math.max(2.0, s.environment.wind_ms + windNoise);
    s.environment.wind_gust_ms = s.environment.wind_ms * 1.45 + p.range(0, 2);

    // 2. Convective Infiltration Multiplier (Coupling: Wind -> Building Loss)
    // f_wind = 1 + (V_wind / 50) * 0.8
    const f_wind = 1.0 + (s.environment.wind_ms / 50.0) * 0.8;
    const deltaT_living = s.zones.living.air_temp_c - s.environment.temp_c;
    const deltaT_lab = s.zones.lab.air_temp_c - s.environment.temp_c;

    // 3. Generator Differential Equations
    const hasBearingFault = this.activeFaults.has('BEARING_WEAR');
    const hasInjectorFault = this.activeFaults.has('INJECTOR_JITTER');
    const hasCoolantLeak = this.activeFaults.has('COOLANT_LEAK');

    // Archard Bearing Wear Rate: dW/dt = k * Fn * v / H
    const wear_rate = (hasBearingFault ? 0.08 : 0.0002) * dt_seconds;
    s.generator.bearing_wear_microns += wear_rate;

    if (hasBearingFault) {
      // Elevate BPFO (outer race) and 2X harmonics
      s.generator.vibration_spectrum[4] = Math.min(6.5, s.generator.vibration_spectrum[4] + 0.02 * dt_seconds);
      s.generator.vibration_spectrum[2] = Math.min(3.2, s.generator.vibration_spectrum[2] + 0.01 * dt_seconds);
      s.generator.bearing_temp_c = Math.min(105, s.generator.bearing_temp_c + 0.08 * dt_seconds);
      s.generator.health_pct = Math.max(30, s.generator.health_pct - 0.05 * dt_seconds);
    } else {
      s.generator.vibration_spectrum[4] = Math.max(0.4, s.generator.vibration_spectrum[4] - 0.01 * dt_seconds);
      s.generator.bearing_temp_c += (64.5 - s.generator.bearing_temp_c) * 0.02 * dt_seconds;
    }

    // RMS Vibration is root sum of 8 spectral bands
    const sumSquares = s.generator.vibration_spectrum.reduce((acc, v) => acc + v * v, 0);
    s.generator.vibration_rms_mms = Number(Math.sqrt(sumSquares).toFixed(2));

    // 4. Fuel Viscosity vs Temperature (ASTM D341 Equation)
    // As fuel chills, viscosity rises exponentially, increasing pumping work
    const fuelTemp = s.fuel.tank_temp_c;
    s.fuel.viscosity_cst = Number((3.2 + Math.exp(-0.06 * fuelTemp)).toFixed(2));

    // Specific Fuel Oil Consumption (SFOC) with temperature & viscosity penalties
    const loadFactor = s.generator.electrical_load_kw / 500.0;
    const sfoc_base = 0.033 * s.generator.electrical_load_kw + 4.2;
    const visc_penalty = s.fuel.viscosity_cst > 5.0 ? (s.fuel.viscosity_cst - 5.0) * 0.8 : 0;
    s.fuel.burn_rate_lph = Number((sfoc_base + visc_penalty + (hasInjectorFault ? 3.5 : 0)).toFixed(2));

    // Fuel tank level depletion
    const fuelConsumedThisStep = (s.fuel.burn_rate_lph / 3600.0) * dt_seconds;
    s.fuel.tank_level_l = Math.max(0, s.fuel.tank_level_l - fuelConsumedThisStep);

    // 5. Thermal Loop Dynamics (4-Node Combined Heat & Power)
    // C_i * dT_i/dt = Q_gen - Q_hx - Q_building
    const heatGenKw = s.generator.electrical_load_kw * 0.42; // ~42% waste heat captured
    const hxCoolingKw = hasCoolantLeak ? 40.0 : 140.0;
    s.thermal_loop.glycol_temp_out_gen += ((heatGenKw * 0.15) - (s.thermal_loop.glycol_temp_out_gen - 84.5) * 0.05) * dt_seconds;
    s.thermal_loop.glycol_temp_out_hx = s.thermal_loop.glycol_temp_out_gen - (hxCoolingKw * 0.18);

    // 6. Building Thermal Balance & Crew Comfort
    // Heat in from glycol loop + crew metabolic heat - envelope heat loss
    const totalCrewHeatKw = s.crew.reduce((acc, c) => acc + c.metabolic_rate_w, 0) / 1000.0;
    const livingLossKw = (deltaT_living * 0.22 * f_wind);
    const labLossKw = (deltaT_lab * 0.28 * f_wind);

    const netHeatLiving = (s.thermal_loop.glycol_temp_out_hx * 0.4) + totalCrewHeatKw - livingLossKw;
    s.zones.living.air_temp_c += (netHeatLiving * 0.005) * dt_seconds;

    const netHeatLab = (s.thermal_loop.glycol_temp_out_hx * 0.3) - labLossKw;
    s.zones.lab.air_temp_c += (netHeatLab * 0.005) * dt_seconds;

    // 7. Battery Electrochemical Model
    // V = OCV(SoC, T) - I * R_internal
    const r_int = s.battery.internal_resistance_mohm * (1 + Math.max(0, 20 - s.battery.cell_temp_c) * 0.016);
    const v_drop = (s.battery.current_a * r_int) / 1000.0;
    s.battery.voltage_v = Number((415.0 - (100 - s.battery.soc_pct) * 0.18 - v_drop).toFixed(1));

    // Joulean Heating: Q_joule = I^2 * R
    const jouleHeatW = Math.pow(s.battery.current_a, 2) * (r_int / 1000.0);
    s.battery.cell_temp_c += ((jouleHeatW * 0.0004) - (s.battery.cell_temp_c - s.battery.thermal_jacket_temp_c) * 0.02) * dt_seconds;

    // 8. Satellite Link Budget & Polar Scintillation
    // SNR drops with high wind gusts and low elevation
    const windDegradation = Math.max(0, (s.environment.wind_gust_ms - 25.0) * 0.3);
    s.comms.snr_db = Number(Math.max(6.0, 16.4 - windDegradation - p.range(0, 0.4)).toFixed(1));
    s.comms.packet_loss_pct = s.comms.snr_db < 10.0 ? Number(((12.0 - s.comms.snr_db) * 1.5).toFixed(2)) : 0.02;

    if (this.activeFaults.has('COMMS_BLACKOUT')) {
      s.comms.link_state = 'Offline';
      s.comms.latency_ms = 9999;
      s.comms.packet_loss_pct = 100.0;
      s.comms.buffer_occupancy_mb = Math.min(10240, s.comms.buffer_occupancy_mb + 0.12 * dt_seconds);
    } else {
      s.comms.link_state = s.comms.snr_db > 12.0 ? 'Nominal' : 'Degraded';
      s.comms.latency_ms = Math.round(118 + (16.4 - s.comms.snr_db) * 15);
      s.comms.buffer_occupancy_mb = Math.max(0, s.comms.buffer_occupancy_mb - 0.25 * dt_seconds);
    }

    // 9. Rare Discrete Events (Poisson arrival)
    if (p.poisson(0.02) > 0) {
      s.events.unshift({
        id: `EVT-${s.timestamp_sim_s}`,
        timestamp_sim_s: s.timestamp_sim_s,
        type: 'INJECTOR_JITTER',
        subsystem: 'Generator Fuel Injection',
        description: 'Micro-cavitation pulse detected on fuel injector solenoid line.',
        severity: 'Info'
      });
      if (s.events.length > 50) s.events.pop();
    }

    return s;
  }

  public getState(): MultiPhysicsStateVector {
    return this.state;
  }
}
