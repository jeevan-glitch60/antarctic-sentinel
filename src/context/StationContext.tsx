import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { 
  StationId, 
  UserRole, 
  StationMetadata, 
  EquipmentComponent, 
  AlertIncident, 
  InventoryItem, 
  RecoverySOP, 
  AuditLogEntry, 
  TelemetryPoint 
} from '../types';
import { 
  STATIONS, 
  INITIAL_COMPONENTS, 
  INITIAL_ALERTS, 
  INITIAL_INVENTORY, 
  INITIAL_RECOVERY_SOPS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_CONNECTIVITY 
} from '../data/mockData';
import { SimulationService, TimelineBookmark } from '../simulation/simulationService';
import { MultiPhysicsStateVector, EnsembleRunResult } from '../simulation/types';

interface StationContextType {
  station: StationId;
  stationData: StationMetadata;
  setStation: (station: StationId) => void;
  isRefreshing: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  components: EquipmentComponent[];
  selectedComponent: EquipmentComponent | null;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  updateComponentStatus: (id: string, status: EquipmentComponent['status'], healthScore?: number) => void;
  alerts: AlertIncident[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  investigateAlert: (id: string, notes: string) => void;
  addAlert: (alert: Omit<AlertIncident, 'id' | 'timestampUtc' | 'timeline'>) => void;
  inventory: InventoryItem[];
  useInventoryItem: (id: string, qty: number) => void;
  reorderInventoryItem: (id: string, qty: number) => void;
  recoverySops: RecoverySOP[];
  toggleSopStep: (sopId: string, stepNumber: number) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (category: AuditLogEntry['category'], action: string, detail: string) => void;
  connectivity: typeof INITIAL_CONNECTIVITY['MAITRI'];
  telemetryHistory: TelemetryPoint[];
  currentTelemetry: TelemetryPoint;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  resetStream: () => void;
  simulateFault: (faultType?: string) => void;
  simulateConnectionLoss: () => void;
  restoreConnection: () => void;
  resetAllFaults: () => void;
  activeScenario: string | null;
  runScenario: (scenarioId: string) => void;
  currentTimeString: string;
  // Multi-physics engine additions
  simService: SimulationService;
  sessionChip: string;
  multiPhysicsState: MultiPhysicsStateVector;
  simHistory: MultiPhysicsStateVector[];
  bookmarks: TimelineBookmark[];
  addBookmark: (label: string, note: string) => void;
  runEnsemble: (numRuns?: number) => EnsembleRunResult[];
  runParameterSweep: (paramName: 'ambientTemp', minVal?: number, maxVal?: number, steps?: number) => { inputVal: number; timeToFreezeHours: number; fuelBurnLph: number }[];
  exportRunBundle: () => Promise<Blob>;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

// Generate initial 25 telemetry points
const generateInitialTelemetry = (station: StationId): TelemetryPoint[] => {
  const isMaitri = station === 'MAITRI';
  const baseTemp = isMaitri ? -18.4 : -14.2;
  const baseWind = isMaitri ? 16.8 : 22.4;
  const points: TelemetryPoint[] = [];
  const now = new Date();

  for (let i = 24; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60 * 1000);
    const timeFormatted = t.toISOString().substring(11, 19);
    const noise = Math.sin(i * 0.5) * 1.2;
    const temp = Number((baseTemp + noise * 0.4).toFixed(1));
    const wind = Number((baseWind + Math.cos(i * 0.4) * 2.5).toFixed(1));

    points.push({
      timestamp: t.toISOString(),
      timeFormatted,
      ambientTemp: temp,
      windSpeed: wind,
      windDirectionDeg: isMaitri ? 165 : 85,
      barometricPressure: Number((984.2 + Math.sin(i * 0.2) * 3).toFixed(1)),
      visibilityKm: Number((8.2 + Math.cos(i * 0.3) * 1.5).toFixed(1)),
      generatorTemp: Number((78 + Math.sin(i * 0.4) * 3).toFixed(1)),
      generatorLoadPct: Number((68 + Math.cos(i * 0.3) * 6).toFixed(0)),
      fuelLevelLiters: 12400 - i * 15,
      fuelBurnRateLph: Number((18.2 + Math.sin(i * 0.2) * 1.8).toFixed(1)),
      batteryChargePct: Number((65 + Math.sin(i * 0.1) * 4).toFixed(0)),
      batteryVoltageV: Number((412.5 + Math.sin(i * 0.2) * 2.2).toFixed(1)),
      heatingDemandKw: Number((140 + Math.cos(i * 0.3) * 12).toFixed(0)),
      totalPowerKw: Number((680 + Math.sin(i * 0.2) * 25).toFixed(0)),
      equipmentVibrationMms: Number((3.1 + Math.abs(Math.sin(i * 0.5)) * 1.5).toFixed(2)),
      commLatencyMs: isMaitri ? 118 + Math.floor(Math.sin(i) * 10) : 245 + Math.floor(Math.cos(i) * 35),
      heartbeatIntervalS: 1.0,
      packetLossPct: isMaitri ? 0.02 : 1.84
    });
  }
  return points;
};

export const StationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [station, setStationState] = useState<StationId>(() => {
    const saved = localStorage.getItem('antarctic_station');
    return (saved === 'BHARATI' ? 'BHARATI' : 'MAITRI') as StationId;
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('antarctic_theme');
    return (savedTheme === 'dark' ? 'dark' : 'light');
  });

  const [activeRole, setActiveRole] = useState<UserRole>('Station Commander');
  const [componentsMap, setComponentsMap] = useState<Record<string, EquipmentComponent[]>>(INITIAL_COMPONENTS);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('gen-01');
  const [alerts, setAlerts] = useState<AlertIncident[]>(INITIAL_ALERTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [recoverySops, setRecoverySops] = useState<RecoverySOP[]>(INITIAL_RECOVERY_SOPS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [connectivityMap, setConnectivityMap] = useState<Record<string, any>>(INITIAL_CONNECTIVITY);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => generateInitialTelemetry(station));
  const [isStreaming, setIsStreaming] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [currentTimeString, setCurrentTimeString] = useState('');

  // Multi-physics simulation engine instance
  const simServiceRef = useRef<SimulationService>(new SimulationService(station, 42, 'baseline_polar'));
  const [multiPhysicsState, setMultiPhysicsState] = useState<MultiPhysicsStateVector>(simServiceRef.current.getCurrentState());
  const [simHistory, setSimHistory] = useState<MultiPhysicsStateVector[]>(simServiceRef.current.getHistory());
  const [bookmarks, setBookmarks] = useState<TimelineBookmark[]>([]);

  const sessionChip = `${simServiceRef.current.getManifest().session_id} · seed ${simServiceRef.current.getManifest().seed} · ${simServiceRef.current.getManifest().engine_version}`;

  // Handle Theme application
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('antarctic_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Keep live time clock formatted for Antarctica / UTC
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setCurrentTimeString(`${datePart} · ${timePart} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Station switcher with 300ms simulated refresh transition
  const setStation = useCallback((newStation: StationId) => {
    if (newStation === station) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setStationState(newStation);
      localStorage.setItem('antarctic_station', newStation);
      setTelemetryHistory(generateInitialTelemetry(newStation));
      setSelectedComponentId(newStation === 'MAITRI' ? 'gen-01' : 'bhr-gen-01');
      simServiceRef.current = new SimulationService(newStation, 42, 'baseline_polar');
      setMultiPhysicsState(simServiceRef.current.getCurrentState());
      setSimHistory(simServiceRef.current.getHistory());
      setIsRefreshing(false);
    }, 300);
  }, [station]);

  const stationData = STATIONS[station];
  const components = componentsMap[station] || [];
  const selectedComponent = components.find(c => c.id === selectedComponentId) || null;
  const connectivity = connectivityMap[station] || connectivityMap['MAITRI'];
  const currentTelemetry = telemetryHistory[telemetryHistory.length - 1] || telemetryHistory[0];

  const addAuditLog = useCallback((category: AuditLogEntry['category'], action: string, detail: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC';
    const newEntry: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeFormatted,
      stationId: station,
      role: activeRole,
      actor: activeRole.split(' ')[0],
      category,
      action,
      detail
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 49)]);
  }, [station, activeRole]);

  // Live Multi-Physics Integration step ticker
  useEffect(() => {
    if (!isStreaming) return;

    const intervalTime = Math.max(200, Math.floor(1000 / simulationSpeed));
    const interval = setInterval(() => {
      const nextPhysics = simServiceRef.current.step(1.0);
      setMultiPhysicsState(nextPhysics);
      setSimHistory([...simServiceRef.current.getHistory()]);

      // Synchronize primary live telemetry history array with multi-physics state
      setTelemetryHistory(prev => {
        const now = new Date();
        const timeFormatted = now.toISOString().substring(11, 19);
        const newPoint: TelemetryPoint = {
          timestamp: now.toISOString(),
          timeFormatted,
          ambientTemp: Number(nextPhysics.environment.temp_c.toFixed(1)),
          windSpeed: Number(nextPhysics.environment.wind_ms.toFixed(1)),
          windDirectionDeg: 165,
          barometricPressure: Number(nextPhysics.environment.pressure_hpa.toFixed(1)),
          visibilityKm: Number(Math.max(1, 12 - (nextPhysics.environment.wind_ms / 4)).toFixed(1)),
          generatorTemp: Number(nextPhysics.generator.bearing_temp_c.toFixed(1)),
          generatorLoadPct: Math.round((nextPhysics.generator.electrical_load_kw / 500) * 100),
          fuelLevelLiters: Math.round(nextPhysics.fuel.tank_level_l),
          fuelBurnRateLph: nextPhysics.fuel.burn_rate_lph,
          batteryChargePct: Math.round(nextPhysics.battery.soc_pct),
          batteryVoltageV: nextPhysics.battery.voltage_v,
          heatingDemandKw: Math.round(nextPhysics.thermal_loop.glycol_temp_out_gen * 1.6),
          totalPowerKw: Math.round(nextPhysics.generator.electrical_load_kw + 180),
          equipmentVibrationMms: nextPhysics.generator.vibration_rms_mms,
          commLatencyMs: nextPhysics.comms.latency_ms,
          heartbeatIntervalS: 1.0,
          packetLossPct: nextPhysics.comms.packet_loss_pct
        };
        return [...prev.slice(1), newPoint];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isStreaming, simulationSpeed]);

  const updateComponentStatus = (id: string, status: EquipmentComponent['status'], healthScore?: number) => {
    setComponentsMap(prev => {
      const currentList = prev[station] || [];
      const updatedList = currentList.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status,
            healthScore: healthScore !== undefined ? healthScore : c.healthScore
          };
        }
        return c;
      });
      return { ...prev, [station]: updatedList };
    });
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Acknowledged',
          timeline: [
            ...a.timeline,
            {
              time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC',
              actor: activeRole,
              action: `Alert marked Acknowledged by ${activeRole}`
            }
          ]
        };
      }
      return a;
    }));
    addAuditLog('Incident', 'Alert Acknowledged', `Alert ${id} acknowledged by ${activeRole}`);
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Resolved',
          timeline: [
            ...a.timeline,
            {
              time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC',
              actor: activeRole,
              action: `Incident marked Resolved by ${activeRole}`
            }
          ]
        };
      }
      return a;
    }));
    addAuditLog('Incident', 'Alert Resolved', `Alert ${id} marked Resolved`);
  };

  const investigateAlert = (id: string, notes: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Investigating',
          investigationNotes: notes,
          timeline: [
            ...a.timeline,
            {
              time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC',
              actor: activeRole,
              action: `Investigation note logged: ${notes.slice(0, 40)}...`
            }
          ]
        };
      }
      return a;
    }));
    addAuditLog('Incident', 'Investigation Updated', `Notes added to Alert ${id}`);
  };

  const addAlert = (alert: Omit<AlertIncident, 'id' | 'timestampUtc' | 'timeline'>) => {
    const id = `ALT-${Date.now().toString().slice(-4)}`;
    const newAlert: AlertIncident = {
      ...alert,
      id,
      timestampUtc: new Date().toISOString(),
      timeline: [
        {
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC',
          actor: activeRole,
          action: 'Alert manually triggered or simulated'
        }
      ]
    };
    setAlerts(prev => [newAlert, ...prev]);
    addAuditLog('Incident', 'New Alert Generated', `${newAlert.title} (${newAlert.severity})`);
  };

  const useInventoryItem = (id: string, qty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock - qty);
        return {
          ...item,
          currentStock: newStock,
          condition: newStock < item.minThreshold ? 'Critical' : item.condition
        };
      }
      return item;
    }));
    addAuditLog('Control', 'Inventory Dispatched', `Issued ${qty} units of item ${id}`);
  };

  const reorderInventoryItem = (id: string, qty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          currentStock: item.currentStock + qty,
          condition: 'Optimal'
        };
      }
      return item;
    }));
    addAuditLog('Control', 'Inventory Reordered', `Added ${qty} units to item ${id}`);
  };

  const toggleSopStep = (sopId: string, stepNumber: number) => {
    setRecoverySops(prev => prev.map(sop => {
      if (sop.id === sopId) {
        const updatedSteps = sop.steps.map(s => {
          if (s.stepNumber === stepNumber) {
            return { ...s, completed: !s.completed };
          }
          return s;
        });
        const completedCount = updatedSteps.filter(s => s.completed).length;
        const progressPercentage = Math.round((completedCount / updatedSteps.length) * 100);

        return {
          ...sop,
          steps: updatedSteps,
          progressPercentage
        };
      }
      return sop;
    }));
    addAuditLog('Control', 'SOP Step Toggled', `SOP ${sopId} step ${stepNumber} toggled`);
  };

  const resetStream = () => {
    setTelemetryHistory(generateInitialTelemetry(station));
    addAuditLog('Telemetry', 'Stream Reset', 'Simulated telemetry stream buffer refreshed');
  };

  // Simulation & Fault Injection Controls
  const simulateFault = (faultType = 'Generator Bearing Vibration') => {
    const targetCompId = station === 'MAITRI' ? 'gen-02' : 'bhr-gen-02';
    updateComponentStatus(targetCompId, 'critical', 48);

    // Inject into multi-physics engine
    simServiceRef.current.injectFault('BEARING_WEAR');

    addAlert({
      stationId: station,
      equipmentId: targetCompId,
      equipmentName: station === 'MAITRI' ? 'Backup Generator 2' : 'Backup Generator',
      severity: 'Critical',
      status: 'Active',
      title: `${faultType} Spike in Extreme Cold`,
      description: `Simulated injection: Radial vibration accelerated past 5.8 mm/s due to bearing housing oil cavitation in -22°C conditions.`,
      crossSystemImpact: 'Backup Gen → Secondary Heating Circuit → Lab Thermal Stability',
      recommendedActions: [
        'Shift load immediately to Primary Generator 01.',
        'Engage BESS 60 kW discharge support.',
        'Execute Recovery SOP-01 bearing replacement checklist.'
      ],
      assignedRole: 'Chief Engineer',
      relatedComponents: ['Generator 2', 'Cooling loop', 'Power distribution', 'BESS']
    });

    addAuditLog('Simulation', 'Fault Injected', `Injected ${faultType} on ${targetCompId}`);
  };

  const simulateConnectionLoss = () => {
    simServiceRef.current.injectFault('COMMS_BLACKOUT');
    setConnectivityMap(prev => ({
      ...prev,
      [station]: {
        ...prev[station],
        primaryLink: {
          ...prev[station].primaryLink,
          status: 'Offline',
          latencyMs: 9999,
          packetLossPct: 100
        },
        secondaryLink: {
          ...prev[station].secondaryLink,
          status: 'Nominal',
          latencyMs: 850,
          packetLossPct: 4.5
        },
        edgeBuffer: {
          ...prev[station].edgeBuffer,
          status: 'Buffering',
          fillPercentage: 38,
          queuedRecords: 840
        },
        resilienceMode: 'Store & Forward'
      }
    }));
    addAuditLog('Simulation', 'Connection Loss Injected', `Primary GSAT-7A uplink dropped. Auto-switched to Store & Forward buffer mode.`);
  };

  const restoreConnection = () => {
    setConnectivityMap(INITIAL_CONNECTIVITY);
    addAuditLog('Control', 'Connection Restored', `Primary satellite link re-synchronized. Buffer drained.`);
  };

  const resetAllFaults = () => {
    setComponentsMap(INITIAL_COMPONENTS);
    setAlerts(INITIAL_ALERTS);
    setConnectivityMap(INITIAL_CONNECTIVITY);
    setActiveScenario(null);
    simServiceRef.current.clearFaults();
    addAuditLog('Control', 'Faults Reset', 'All simulated station systems restored to nominal baseline.');
  };

  const runScenario = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    if (scenarioId === 'blizzard_gen_fail') {
      simulateFault('Blizzard Severe Bearing Stall');
      simulateConnectionLoss();
      addAuditLog('Simulation', 'What-If Scenario Run', 'Executed: Severe Blizzard (-42°C, 38m/s) with Generator Trip.');
    } else if (scenarioId === 'fuel_freeze') {
      updateComponentStatus(station === 'MAITRI' ? 'fuel-storage' : 'bhr-fuel-storage', 'warning', 60);
      addAlert({
        stationId: station,
        equipmentId: station === 'MAITRI' ? 'fuel-storage' : 'bhr-fuel-storage',
        equipmentName: 'Fuel Storage & Manifold',
        severity: 'Warning',
        status: 'Active',
        title: 'Fuel Line Waxing Risk at -45°C Chill',
        description: 'Trace heating element temperature sensor below threshold. Fuel viscosity rising in outdoor transfer loop.',
        crossSystemImpact: 'Fuel Storage → Generator Inlets → Entire Station Microgrid',
        recommendedActions: [
          'Verify trace heater circuit breaker 4B.',
          'Inject glycol heat boost from secondary boiler circuit.',
          'Throttle non-essential lab experiment power.'
        ],
        assignedRole: 'Station Commander',
        relatedComponents: ['Fuel Storage', 'Heating Loop', 'Power Distribution']
      });
      addAuditLog('Simulation', 'What-If Scenario Run', 'Executed: Fuel Line Waxing & Viscosity Hazard.');
    } else if (scenarioId === 'comms_blackout') {
      simulateConnectionLoss();
      addAuditLog('Simulation', 'What-If Scenario Run', 'Executed: 72-Hour Polar Ionospheric Blackout.');
    }
  };

  const addBookmark = (label: string, note: string) => {
    const bm = simServiceRef.current.addBookmark(label, note);
    setBookmarks([...simServiceRef.current.getBookmarks()]);
    addAuditLog('Simulation', 'Bookmark Added', `Saved snapshot: ${label}`);
  };

  const runEnsemble = (numRuns: number = 50) => {
    return simServiceRef.current.runEnsemble(numRuns);
  };

  const runParameterSweep = (paramName: 'ambientTemp', minVal: number = -50, maxVal: number = -10, steps: number = 10) => {
    return simServiceRef.current.runParameterSweep(paramName, minVal, maxVal, steps);
  };

  const exportRunBundle = async () => {
    addAuditLog('Simulation', 'Bundle Exported', 'Downloaded manifest.json and run archive');
    return await simServiceRef.current.exportRunBundle();
  };

  return (
    <StationContext.Provider
      value={{
        station,
        stationData,
        setStation,
        isRefreshing,
        theme,
        setTheme,
        toggleTheme,
        activeRole,
        setActiveRole,
        components,
        selectedComponent,
        selectedComponentId,
        setSelectedComponentId,
        updateComponentStatus,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        investigateAlert,
        addAlert,
        inventory,
        useInventoryItem,
        reorderInventoryItem,
        recoverySops,
        toggleSopStep,
        auditLogs,
        addAuditLog,
        connectivity,
        telemetryHistory,
        currentTelemetry,
        isStreaming,
        setIsStreaming,
        simulationSpeed,
        setSimulationSpeed,
        resetStream,
        simulateFault,
        simulateConnectionLoss,
        restoreConnection,
        resetAllFaults,
        activeScenario,
        runScenario,
        currentTimeString,
        simService: simServiceRef.current,
        sessionChip,
        multiPhysicsState,
        simHistory,
        bookmarks,
        addBookmark,
        runEnsemble,
        runParameterSweep,
        exportRunBundle
      }}
    >
      {children}
    </StationContext.Provider>
  );
};

export const useStation = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStation must be used within a StationProvider');
  }
  return context;
};
