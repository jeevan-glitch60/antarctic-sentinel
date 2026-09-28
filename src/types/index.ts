export type StationId = 'MAITRI' | 'BHARATI';

export type UserRole = 
  | 'Station Commander'
  | 'Chief Engineer'
  | 'Remote Operator'
  | 'Science Lead';

export type SeverityLevel = 'Critical' | 'Warning' | 'Caution' | 'Info';

export type ComponentStatus = 
  | 'normal' 
  | 'monitor' 
  | 'warning' 
  | 'critical' 
  | 'data-issue' 
  | 'offline';

export interface StationMetadata {
  id: StationId;
  name: string;
  code: string;
  location: string;
  coordinates: string;
  lat: number;
  lng: number;
  elevation: string;
  defaultStatus: string;
  description: string;
  terrainType: string;
  establishedYear: number;
  winteringCrew: number;
  primaryWaterSource: string;
}

export interface EquipmentComponent {
  id: string;
  name: string;
  category: 'Power' | 'Thermal' | 'Comms' | 'Life Support' | 'Science' | 'Storage' | 'Computing';
  status: ComponentStatus;
  healthScore: number; // 0 - 100
  temperature: number; // °C
  powerUsageKw: number; // kW (+ for gen, - for load)
  loadPercentage: number;
  lastHeartbeat: string;
  lastMaintenance: string;
  alerts: string[];
  dependentSystems: string[];
  dependsOn: string[];
  dataQualityScore: number;
  recommendedAction: string;
  coordinates2D: { x: number; y: number; z?: number; width?: number; height?: number };
  specs?: {
    model?: string;
    serial?: string;
    redundancy?: string;
    criticality?: 'Life Critical' | 'Mission Critical' | 'Support' | 'Auxiliary';
  };
}

export interface AlertIncident {
  id: string;
  timestampUtc: string;
  stationId: StationId;
  equipmentId: string;
  equipmentName: string;
  severity: SeverityLevel;
  status: 'Active' | 'Acknowledged' | 'Investigating' | 'Resolved';
  title: string;
  description: string;
  crossSystemImpact: string;
  recommendedActions: string[];
  assignedRole: UserRole;
  relatedComponents: string[];
  investigationNotes?: string;
  telemetrySnapshot?: {
    metric: string;
    value: string;
    threshold: string;
  };
  timeline: {
    time: string;
    actor: string;
    action: string;
  }[];
}

export interface TelemetryPoint {
  timestamp: string;
  timeFormatted: string;
  ambientTemp: number; // °C
  windSpeed: number; // m/s
  windDirectionDeg: number;
  barometricPressure: number; // hPa
  visibilityKm: number;
  generatorTemp: number; // °C
  generatorLoadPct: number; // %
  fuelLevelLiters: number;
  fuelBurnRateLph: number;
  batteryChargePct: number;
  batteryVoltageV: number;
  heatingDemandKw: number;
  totalPowerKw: number;
  equipmentVibrationMms: number; // mm/s
  commLatencyMs: number;
  heartbeatIntervalS: number;
  packetLossPct: number;
}

export interface ConnectivityState {
  primaryLink: {
    type: 'GSAT-7A (Polar Uplink)' | 'Inmarsat FleetBroadband' | 'Iridium Extreme M2M';
    status: 'Nominal' | 'Degraded' | 'Offline';
    latencyMs: number;
    packetLossPct: number;
    signalSnrDb: number;
    frequencyGhz: number;
  };
  secondaryLink: {
    type: 'Iridium Polar Burst';
    status: 'Nominal' | 'Standby' | 'Offline';
    latencyMs: number;
    packetLossPct: number;
  };
  edgeBuffer: {
    status: 'Buffering' | 'Synchronized' | 'Overflow Warning';
    fillPercentage: number;
    queuedRecords: number;
    maxCapacityMb: number;
    usedCapacityMb: number;
    lastFlushTime: string;
  };
  resilienceMode: 'Full Stream' | 'Low-Bandwidth Essential' | 'Store & Forward';
}

export interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  category: 'Fuel & Fluid' | 'Mechanical Spares' | 'Electrical' | 'Thermal' | 'Medical' | 'Rations';
  currentStock: number;
  unit: string;
  minThreshold: number;
  daysRemaining: number;
  binLocation: string;
  condition: 'Optimal' | 'Cold-Storage Tested' | 'Limited Stock' | 'Critical';
  assignedSystems: string[];
}

export interface RecoverySOP {
  id: string;
  title: string;
  targetIncidentId?: string;
  equipmentId: string;
  severity: SeverityLevel;
  estimatedTimeMin: number;
  estimatedTimeFull: number;
  progressPercentage: number;
  assignedPersonnel: {
    role: UserRole;
    name: string;
    certified: boolean;
  }[];
  requiredSpares: {
    partNumber: string;
    name: string;
    qtyRequired: number;
    qtyAvailable: number;
  }[];
  steps: {
    stepNumber: number;
    instruction: string;
    cautionNote?: string;
    completed: boolean;
  }[];
  safetyProtocols: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  stationId: StationId;
  role: UserRole;
  actor: string;
  category: 'Telemetry' | 'Incident' | 'Control' | 'Simulation' | 'Security';
  action: string;
  detail: string;
}
