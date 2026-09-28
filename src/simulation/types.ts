/**
 * ANTARCTIC SENTINEL — Multi-Physics Simulation Engine State Vector & Types
 * Rigorous discrete-continuous state vector definition across all station subsystems.
 */

export interface GeneratorPhysicsState {
  rotor_temp_c: number;
  winding_temp_c: number;
  bearing_temp_c: number;
  // 8 frequency bands: [Sub-harmonic 0.5X, 1X Unbalance, 2X Misalignment, 3X, BPFO outer race, BPFI inner race, BSF ball spin, High-freq gear mesh]
  vibration_spectrum: number[];
  vibration_rms_mms: number;
  fuel_rail_pressure_bar: number;
  oil_pressure_bar: number;
  oil_temp_c: number;
  thermal_mass_temp_c: number;
  health_pct: number;
  cycles: number;
  running_hours: number;
  bearing_wear_microns: number;
  injection_timing_deg: number;
  lambda: number;
  electrical_load_kw: number;
}

export interface BatteryPhysicsState {
  cell_temp_c: number;
  soc_pct: number;
  soh_pct: number;
  internal_resistance_mohm: number;
  cycle_count: number;
  thermal_jacket_temp_c: number;
  voltage_v: number;
  current_a: number;
}

export interface ThermalLoopState {
  // 4-Node hydronic loop temperatures
  glycol_temp_out_gen: number;
  glycol_temp_in_hx: number;
  glycol_temp_out_hx: number;
  glycol_temp_in_building: number;
  flow_rate_lpm: number;
  pump_current_a: number;
  valve_position_pct: number;
  loop_pressure_bar: number;
}

export interface BuildingZoneState {
  air_temp_c: number;
  wall_temp_c: number;
  thermal_mass_temp_c: number;
  infiltration_rate_ach: number;
  occupancy: number;
  humidity_pct: number;
  co2_ppm: number;
}

export interface FuelPhysicsState {
  tank_level_l: number;
  tank_temp_c: number;
  viscosity_cst: number;
  water_content_ppm: number;
  burn_rate_lph: number;
}

export interface WaterPhysicsState {
  storage_level_l: number;
  ro_throughput_lph: number;
  heater_status: boolean;
  snow_melt_intake_lph: number;
}

export interface CommsPhysicsState {
  link_state: 'Nominal' | 'Degraded' | 'Offline';
  snr_db: number;
  latency_ms: number;
  jitter_ms: number;
  packet_loss_pct: number;
  buffer_occupancy_mb: number;
  antenna_az_deg: number;
  antenna_el_deg: number;
  doppler_shift_hz: number;
}

export interface CrewMemberState {
  id: string;
  name: string;
  role: string;
  zone: 'Habitation Pod' | 'Generator Annex' | 'Science Lab' | 'Comms Shack' | 'Cold Storage' | 'EVA Field';
  metabolic_rate_w: number;
  activity_level: 'Rest' | 'Nominal' | 'Strenuous Work' | 'EVA Walk';
}

export interface EnvironmentPhysicsState {
  temp_c: number;
  wind_ms: number;
  wind_gust_ms: number;
  humidity_pct: number;
  pressure_hpa: number;
  solar_irradiance_wm2: number;
  cloud_cover_pct: number;
  snow_depth_m: number;
  geomagnetic_kp: number;
}

export interface DiscreteEvent {
  id: string;
  timestamp_sim_s: number;
  type: 'INJECTOR_JITTER' | 'VALVE_ACTUATION' | 'PUMP_TOGGLE' | 'RELAY_SWITCH' | 'SAT_ACQUIRE' | 'SAT_LOSS' | 'FAULT_ONSET' | 'ALARM_TRIGGER';
  subsystem: string;
  description: string;
  severity?: 'Info' | 'Caution' | 'Warning' | 'Critical';
}

export interface MultiPhysicsStateVector {
  timestamp_sim_s: number;
  timestamp_iso: string;
  station_id: 'MAITRI' | 'BHARATI';
  engine_version: string;
  seed: number;
  generator: GeneratorPhysicsState;
  battery: BatteryPhysicsState;
  thermal_loop: ThermalLoopState;
  zones: {
    living: BuildingZoneState;
    lab: BuildingZoneState;
    generator_room: BuildingZoneState;
  };
  fuel: FuelPhysicsState;
  water: WaterPhysicsState;
  comms: CommsPhysicsState;
  crew: CrewMemberState[];
  environment: EnvironmentPhysicsState;
  events: DiscreteEvent[];
}

export interface SimulationSessionManifest {
  session_id: string;
  name: string;
  scenario: string;
  seed: number;
  engine_version: string;
  created_at: string;
  duration_sim_s: number;
  time_step_s: number;
  notes: string;
  subsystem_states_count: number;
}

export interface UncertaintyBands {
  p5: number;
  p50: number;
  p95: number;
}

export interface EnsembleRunResult {
  run_index: number;
  seed: number;
  final_health_pct: number;
  fuel_consumed_l: number;
  downtime_minutes: number;
  time_to_freeze_hours: number;
  alerts_count: number;
}
