import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { EquipmentComponent } from '../../types';

interface StationMeshProps {
  components: EquipmentComponent[];
  selectedId: string | null;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onSelectComponent: (comp: EquipmentComponent) => void;
  multiPhysicsState?: any;
  showLabels: boolean;
  isolatedSystem: string | null;
  showFaultImpact?: boolean;
}

export const MaitriStationMesh: React.FC<StationMeshProps> = ({
  components,
  selectedId,
  hoveredId,
  setHoveredId,
  onSelectComponent,
  multiPhysicsState,
  showLabels,
  isolatedSystem,
  showFaultImpact
}) => {
  const turbineRef = useRef<THREE.Group>(null);
  const hvacFanRef = useRef<THREE.Group>(null);
  const pulseRingsRef = useRef<{ [key: string]: THREE.Mesh | null }>({});

  const getComp = (id: string) => components.find(c => c.id === id);

  const gen1 = getComp('gen-01');
  const gen2 = getComp('gen-02');
  const bess = getComp('bess-01');
  const fuel = getComp('fuel-storage');
  const comms = getComp('comms-sys');
  const sat = getComp('sat-link');
  const water = getComp('water-sys');
  const lab = getComp('lab-mod');
  const hab = getComp('living-qtr');
  const edge = getComp('edge-gateway');
  const spares = getComp('spares-store');
  const pwr = getComp('main-pwr');

  // Simulation-driven values
  const windSpeedKmh = multiPhysicsState?.ambient?.wind_speed_kmh ?? 38;
  const turbineSpeedFactor = Math.max(0.4, windSpeedKmh / 22);
  const isCommsDown = multiPhysicsState?.comms?.link_state === 'Offline' || comms?.status === 'critical' || sat?.status === 'critical';
  const fuelLevelLow = (fuel?.loadPercentage ?? 62) < 25;
  const bessSocLow = (bess?.loadPercentage ?? 65) < 30;
  const gen1Health = gen1?.healthScore ?? 96;
  const gen2Health = gen2?.healthScore ?? 72;
  const isHeatingHigh = (multiPhysicsState?.thermal_loop?.space_heating_demand_kw ?? 140) > 130;
  const solarOutputHigh = (multiPhysicsState?.electrical?.solar_pv_kw ?? 45) > 40;

  // Animation loop using useFrame for continuous 60fps smoothness
  useFrame((_, delta) => {
    if (turbineRef.current) {
      turbineRef.current.rotation.z += delta * 4.2 * turbineSpeedFactor;
    }
    if (hvacFanRef.current) {
      hvacFanRef.current.rotation.z += delta * 6.0;
    }

    // Sinusoidal pulsing highlight for faulted components
    const time = Date.now() * 0.0035;
    const pulseScale = 1.0 + Math.sin(time) * 0.14;
    Object.values(pulseRingsRef.current).forEach(ring => {
      if (ring) {
        ring.scale.set(pulseScale, 1, pulseScale);
      }
    });
  });

  const getInteractiveHandlers = (comp?: EquipmentComponent) => {
    if (!comp) return {};
    const isIsolated = isolatedSystem && isolatedSystem !== 'All' && comp.category !== isolatedSystem;
    if (isIsolated) return {};

    return {
      onClick: (e: any) => {
        e.stopPropagation();
        onSelectComponent(comp);
      },
      onPointerOver: (e: any) => {
        e.stopPropagation();
        setHoveredId(comp.id);
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: (e: any) => {
        e.stopPropagation();
        setHoveredId(null);
        document.body.style.cursor = 'auto';
      }
    };
  };

  const getVisualState = (comp?: EquipmentComponent) => {
    if (!comp) return { isSelected: false, isHovered: false, isFaulted: false, opacity: 1 };
    const isSelected = selectedId === comp.id;
    const isHovered = hoveredId === comp.id;
    const isFaulted = comp.status === 'critical' || comp.status === 'warning';
    const isIsolated = isolatedSystem && isolatedSystem !== 'All' && comp.category !== isolatedSystem;
    const opacity = isIsolated ? 0.22 : 1.0;
    return { isSelected, isHovered, isFaulted, opacity };
  };

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================== */}
      {/* 1. MAIN HABITATION COMPLEX (Maitri Main Pod with Beveled Edges)*/}
      {/* Maps to 'living-qtr'                                           */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(hab);
        return (
          <group position={[0, 1.8, 0]} {...getInteractiveHandlers(hab)}>
            {/* Structural Foundation Heavy Steel Columns */}
            {[-8, -4, 0, 4, 8].map(x => (
              <group key={`hab-stilt-${x}`}>
                <mesh position={[x, -1.2, -2.6]} castShadow>
                  <cylinderGeometry args={[0.22, 0.26, 1.3, 8]} />
                  <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.8} />
                </mesh>
                <mesh position={[x, -1.2, 2.6]} castShadow>
                  <cylinderGeometry args={[0.22, 0.26, 1.3, 8]} />
                  <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.8} />
                </mesh>
              </group>
            ))}

            {/* Main Rounded Habitation Envelope with Beveled Corners */}
            <RoundedBox
              args={[18.4, 2.5, 6.4]}
              radius={0.22}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#93C5FD" : "#E2E8F0"}
                roughness={0.55}
                metalness={0.22}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            {/* Roof Snow Cap Accumulation with Overhangs */}
            <RoundedBox
              args={[18.6, 0.35, 6.6]}
              radius={0.16}
              smoothness={3}
              position={[0, 1.35, 0]}
              receiveShadow
            >
              <meshStandardMaterial color="#F8FAFC" roughness={0.85} metalness={0.02} />
            </RoundedBox>

            {/* Architectural Blue Trim Ribbons */}
            <mesh position={[0, 0.0, 3.23]}>
              <boxGeometry args={[18.0, 0.45, 0.06]} />
              <meshStandardMaterial color="#1D4ED8" roughness={0.4} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.0, -3.23]}>
              <boxGeometry args={[18.0, 0.45, 0.06]} />
              <meshStandardMaterial color="#1D4ED8" roughness={0.4} metalness={0.4} />
            </mesh>

            {/* Double-Glazed Observation Windows with Warm Interior Glow */}
            {[-6.5, -4.5, -2.5, 0, 2.5, 4.5, 6.5].map(x => (
              <group key={`hab-win-${x}`} position={[x, 0.3, 3.24]}>
                {/* Window Frame */}
                <mesh>
                  <boxGeometry args={[1.2, 0.85, 0.04]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Real Glass Pane */}
                <mesh position={[0, 0, 0.02]}>
                  <planeGeometry args={[1.05, 0.7]} />
                  <meshStandardMaterial
                    color={isHeatingHigh ? "#FDE68A" : "#BAE6FD"}
                    emissive={isHeatingHigh ? "#D97706" : "#0284C7"}
                    emissiveIntensity={isHeatingHigh ? 0.45 : 0.08}
                    roughness={0.1}
                    metalness={0.3}
                  />
                </mesh>
              </group>
            ))}

            {/* Polar Airlock Main Entrance Door with Staircase */}
            <group position={[-1.2, -0.4, 3.24]}>
              <mesh>
                <boxGeometry args={[1.6, 2.0, 0.1]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Door Window & Push Bar */}
              <mesh position={[0, 0.4, 0.06]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial color="#93C5FD" roughness={0.1} />
              </mesh>
              <mesh position={[0, -0.1, 0.08]}>
                <boxGeometry args={[0.9, 0.06, 0.06]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
              </mesh>
            </group>

            {/* Roof Vents, Cowls, and Extraction Flues */}
            {[-6, -2, 3, 7].map(x => (
              <group key={`vent-${x}`} position={[x, 1.6, 1.2]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.18, 0.18, 0.5, 8]} />
                  <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                  <coneGeometry args={[0.28, 0.2, 8]} />
                  <meshStandardMaterial color="#475569" metalness={0.6} />
                </mesh>
              </group>
            ))}

            {/* HVAC Heat Pump Unit with Animated Fan */}
            <group position={[9.3, 0.2, 1.5]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 1.2, 1.4]} />
                <meshStandardMaterial color="#94A3B8" metalness={0.5} roughness={0.4} />
              </mesh>
              <group ref={hvacFanRef} position={[0.46, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.08, 0.08, 0.06, 8]} />
                  <meshStandardMaterial color="#1E293B" />
                </mesh>
                {[-0.3, 0.3].map(rot => (
                  <mesh key={`fan-${rot}`} rotation={[0, 0, rot]}>
                    <boxGeometry args={[0.8, 0.12, 0.02]} />
                    <meshStandardMaterial color="#334155" />
                  </mesh>
                ))}
              </group>
            </group>

            {/* Selection / Fault Ground Halo */}
            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['living-qtr'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -1.18, 0]}
              >
                <ringGeometry args={[10.2, 10.7, 32]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#EF4444"} />
              </mesh>
            )}

            {showLabels && hab && (
              <Html position={[0, 2.8, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md backdrop-blur-md">
                  {hab.name} · {hab.temperature}°C
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 2. LABORATORY MODULE (Earth Science & Atmospheric Lab)         */}
      {/* Maps to 'lab-mod'                                              */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(lab);
        return (
          <group position={[14.2, 1.5, 0]} {...getInteractiveHandlers(lab)}>
            {/* Stilts */}
            {[-2.8, 0, 2.8].map(x => (
              <mesh key={`lab-stilt-${x}`} position={[x, -1.0, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.2, 1.0, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            ))}

            {/* Beveled Lab Container */}
            <RoundedBox
              args={[7.6, 2.1, 5.2]}
              radius={0.18}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#93C5FD" : "#CBD5E1"}
                roughness={0.6}
                metalness={0.25}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            {/* Roof Snow Cap */}
            <RoundedBox
              args={[7.8, 0.28, 5.4]}
              radius={0.14}
              smoothness={3}
              position={[0, 1.15, 0]}
              receiveShadow
            >
              <meshStandardMaterial color="#F8FAFC" roughness={0.85} />
            </RoundedBox>

            {/* Spectrometer Periscope Dome on Roof */}
            <group position={[1.8, 1.4, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.6, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.35, 0]}>
                <sphereGeometry args={[0.34, 12, 12]} />
                <meshStandardMaterial color="#93C5FD" roughness={0.1} metalness={0.4} />
              </mesh>
            </group>

            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['lab-mod'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.98, 0]}
              >
                <ringGeometry args={[4.6, 4.9, 24]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#F59E0B"} />
              </mesh>
            )}

            {showLabels && lab && (
              <Html position={[0, 2.3, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  {lab.name}
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 3. GENERATOR 01 (Engine Red Container + Twin Exhaust Baffles)   */}
      {/* Maps to 'gen-01'                                               */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(gen1);
        const genColor = gen1Health < 60 ? "#994D4D" : "#DC2626";
        const ledColor = gen1Health < 30 ? "#EF4444" : gen1Health < 60 ? "#F59E0B" : "#22C55E";

        return (
          <group position={[-14.5, 1.4, 6]} {...getInteractiveHandlers(gen1)}>
            <RoundedBox
              args={[6.6, 2.3, 3.9]}
              radius={0.16}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#F87171" : genColor}
                roughness={0.55}
                metalness={0.3}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            {/* Industrial Ventilation Louvers (Intake Grille) */}
            <mesh position={[0, 0.2, 1.97]}>
              <boxGeometry args={[4.2, 1.2, 0.04]} />
              <meshStandardMaterial color="#1E293B" roughness={0.9} />
            </mesh>

            {/* Twin High-Temp Exhaust Stacks with Flanged Caps */}
            {[-0.8, 0.8].map(z => (
              <group key={`exh-1-${z}`} position={[-1.9, 1.9, z]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.2, 0.2, 1.5, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Heat expansion baffles */}
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.28, 0.28, 0.1, 12]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} />
                </mesh>
                {/* Weather spark cap */}
                <mesh position={[0, 0.8, 0]}>
                  <coneGeometry args={[0.3, 0.18, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.7} />
                </mesh>
              </group>
            ))}

            {/* Status Beacon LED */}
            <mesh position={[0, 1.25, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={1.0} />
            </mesh>

            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['gen-01'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.88, 0]}
              >
                <ringGeometry args={[4.3, 4.6, 24]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#EF4444"} />
              </mesh>
            )}

            {showLabels && gen1 && (
              <Html position={[0, 2.5, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  {gen1.name} · {gen1.loadPercentage}%
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 4. GENERATOR 02 / BACKUP GENERATOR (Orange Container)          */}
      {/* Maps to 'gen-02'                                               */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(gen2);
        const ledColor = gen2Health < 30 ? "#EF4444" : gen2Health < 75 ? "#F59E0B" : "#22C55E";

        return (
          <group position={[-14.5, 1.4, 12.5]} {...getInteractiveHandlers(gen2)}>
            <RoundedBox
              args={[6.6, 2.3, 3.9]}
              radius={0.16}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#FB923C" : "#EA580C"}
                roughness={0.55}
                metalness={0.3}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            <mesh position={[-1.9, 1.9, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 1.5, 12]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
            </mesh>

            <mesh position={[0, 1.25, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={1.0} />
            </mesh>

            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['gen-02'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.88, 0]}
              >
                <ringGeometry args={[4.3, 4.6, 24]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#F59E0B"} />
              </mesh>
            )}

            {showLabels && gen2 && (
              <Html position={[0, 2.5, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  {gen2.name} · {gen2Health}% RUL
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 5. BESS BATTERY ENERGY STORAGE (Substation Blue Container)     */}
      {/* Maps to 'bess-01'                                              */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(bess);
        const ledColor = bessSocLow ? "#F59E0B" : "#22C55E";

        return (
          <group position={[-5, 1.3, 10.5]} {...getInteractiveHandlers(bess)}>
            <RoundedBox
              args={[5.4, 2.1, 3.4]}
              radius={0.15}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#60A5FA" : "#1D4ED8"}
                roughness={0.5}
                metalness={0.35}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            {/* Battery Louvers */}
            {[-1.3, 0, 1.3].map(x => (
              <mesh key={`bess-vent-${x}`} position={[x, 0.35, 1.72]}>
                <planeGeometry args={[0.9, 0.7]} />
                <meshStandardMaterial color="#0F172A" roughness={0.9} />
              </mesh>
            ))}

            <mesh position={[0, 1.15, 0]}>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={1.0} />
            </mesh>

            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['bess-01'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.88, 0]}
              >
                <ringGeometry args={[3.5, 3.8, 24]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#3B82F6"} />
              </mesh>
            )}

            {showLabels && bess && (
              <Html position={[0, 2.2, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  BESS {bess.loadPercentage}% SoC
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 6. COMMS MAST WITH GUY WIRES & SATELLITE RADOME                */}
      {/* Maps to 'comms-sys' / 'sat-link'                               */}
      {/* ============================================================== */}
      {(() => {
        const vComms = getVisualState(comms);
        const vSat = getVisualState(sat);
        const mastLedColor = isCommsDown ? "#EF4444" : "#22C55E";

        return (
          <group position={[12, 0, 12]}>
            {/* Segmented Steel Lattice Mast */}
            <group {...getInteractiveHandlers(comms)}>
              {/* Main Structural Pole */}
              <mesh position={[0, 8.5, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.38, 17, 10]} />
                <meshStandardMaterial color={vComms.isSelected ? "#38BDF8" : "#94A3B8"} metalness={0.8} roughness={0.3} />
              </mesh>

              {/* Aviation Red/White Obstruction Stripes */}
              <mesh position={[0, 14.5, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 1.4, 8]} />
                <meshStandardMaterial color="#EF4444" roughness={0.4} />
              </mesh>
              <mesh position={[0, 15.6, 0]}>
                <cylinderGeometry args={[0.17, 0.17, 0.8, 8]} />
                <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
              </mesh>

              {/* Flashing Top Beacon LED */}
              <mesh position={[0, 17.1, 0]}>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshStandardMaterial color={mastLedColor} emissive={mastLedColor} emissiveIntensity={1.4} />
              </mesh>

              {/* Microwave Dish Transceivers at Mid-Height */}
              <mesh position={[0.6, 11, 0]} rotation={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.45, 0.1, 0.25, 12]} />
                <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.5} />
              </mesh>

              {/* 4 Guy Wires Anchoring Mast to Snow Ground */}
              {[
                [-8, 0.05, -8],
                [8, 0.05, -8],
                [-8, 0.05, 8],
                [8, 0.05, 8]
              ].map(([gx, gy, gz], wIdx) => {
                const p1 = new THREE.Vector3(0, 13, 0);
                const p2 = new THREE.Vector3(gx, gy, gz);
                const mid = p1.clone().add(p2).multiplyScalar(0.5);
                const len = p1.distanceTo(p2);
                const dir = p2.clone().sub(p1).normalize();

                return (
                  <group key={`guy-${wIdx}`}>
                    <mesh position={mid} rotation={[Math.PI / 2, Math.atan2(dir.x, dir.z), 0]}>
                      <cylinderGeometry args={[0.015, 0.015, len, 4]} />
                      <meshStandardMaterial color="#64748B" metalness={0.9} />
                    </mesh>
                    {/* Snow Anchor Pin */}
                    <mesh position={[gx, 0.2, gz]} castShadow>
                      <boxGeometry args={[0.3, 0.4, 0.3]} />
                      <meshStandardMaterial color="#334155" />
                    </mesh>
                  </group>
                );
              })}
            </group>

            {/* Satellite Tracking Radome next to mast */}
            <group position={[3.8, 1.4, 0]} {...getInteractiveHandlers(sat)}>
              <mesh castShadow>
                <cylinderGeometry args={[0.35, 0.45, 1.8, 12]} />
                <meshStandardMaterial color="#475569" roughness={0.6} />
              </mesh>
              <mesh position={[0, 1.6, 0]} castShadow>
                <sphereGeometry args={[1.4, 20, 20]} />
                <meshStandardMaterial
                  color={vSat.isSelected ? "#38BDF8" : "#F8FAFC"}
                  roughness={0.3}
                  metalness={0.15}
                />
              </mesh>
            </group>

            {showLabels && (
              <Html position={[0, 18, 0]} center distanceFactor={35} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  GSAT-7A Radome & Comms Array
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 7. SOLAR PHOTOVOLTAIC ARRAY (Tilted Monocrystalline Panels)    */}
      {/* Maps to 'main-pwr'                                             */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(pwr);
        const panelColor = solarOutputHigh ? "#1D4ED8" : "#1E3A8A";

        return (
          <group position={[-20, 0.8, -12]} {...getInteractiveHandlers(pwr)}>
            {/* 3 rows of 4 tilted solar panels on steel ground racking */}
            {[-4.8, -1.6, 1.6, 4.8].map((x, colIdx) =>
              [-2.2, 1.0, 4.2].map((z, rowIdx) => (
                <group key={`pv-${colIdx}-${rowIdx}`} position={[x, 0, z]}>
                  {/* Racking Legs */}
                  <mesh position={[-0.9, -0.2, 0]} castShadow>
                    <boxGeometry args={[0.06, 0.9, 0.06]} />
                    <meshStandardMaterial color="#64748B" metalness={0.9} />
                  </mesh>
                  <mesh position={[0.9, -0.2, 0]} castShadow>
                    <boxGeometry args={[0.06, 0.9, 0.06]} />
                    <meshStandardMaterial color="#64748B" metalness={0.9} />
                  </mesh>

                  {/* Solar Panel with Silver Frame & Dark Monocrystalline Face */}
                  <group rotation={[0.42, 0, 0]} position={[0, 0.45, 0]}>
                    {/* Frame */}
                    <mesh castShadow>
                      <boxGeometry args={[2.5, 0.08, 1.7]} />
                      <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Active Photovoltaic Glass Face */}
                    <mesh position={[0, 0.045, 0]}>
                      <planeGeometry args={[2.35, 1.55]} />
                      <meshStandardMaterial
                        color={v.isSelected ? "#38BDF8" : panelColor}
                        roughness={0.12}
                        metalness={0.8}
                        emissive={solarOutputHigh ? "#2563EB" : "#000000"}
                        emissiveIntensity={solarOutputHigh ? 0.25 : 0}
                      />
                    </mesh>
                  </group>
                </group>
              ))
            )}

            {showLabels && (
              <Html position={[0, 2.4, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  Solar PV 45 kW Array
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 8. AERODYNAMIC WIND TURBINE (Tapered Nacelle & Twisted Blades)  */}
      {/* ============================================================== */}
      <group position={[-28, 0, 8]}>
        {/* Tapered Tubular Steel Tower with Flange Rings */}
        <mesh position={[0, 5.5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.38, 11, 12]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Tower Flange Joint Rings */}
        {[3, 6, 9].map(y => (
          <mesh key={`flange-${y}`} position={[0, y, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.1, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
        ))}

        {/* Aerodynamic Nacelle */}
        <group position={[0, 11.2, 0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.36, 1.8, 12]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
          </mesh>

          {/* Rotating Rotor Hub & 3 Tapered Blades */}
          <group ref={turbineRef} position={[0, 0, 1.1]}>
            <mesh>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshStandardMaterial color="#EF4444" roughness={0.3} />
            </mesh>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
              <group key={`blade-${idx}`} rotation={[0, 0, angle]}>
                {/* Tapered Aerodynamic Blade */}
                <mesh position={[0, 2.0, 0]} rotation={[0, 0.15, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.22, 3.8, 8]} />
                  <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 9. CYLINDRICAL FUEL STORAGE TANKS ON CONCRETE BUND             */}
      {/* Maps to 'fuel-storage'                                         */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(fuel);
        const ledColor = fuelLevelLow ? "#EF4444" : "#22C55E";

        return (
          <group position={[-6, 1.2, -14]} {...getInteractiveHandlers(fuel)}>
            {/* Concrete Spill Retention Dike with Yellow Safety Perimeter */}
            <mesh position={[0, -0.6, 0]} receiveShadow>
              <boxGeometry args={[11.5, 0.6, 5.8]} />
              <meshStandardMaterial color="#334155" roughness={0.9} />
            </mesh>

            {/* 3 Heavy Cylindrical Horizontal Tanks with Dished Heads */}
            {[-3.6, 0, 3.6].map(x => (
              <group key={`fuel-tank-${x}`} position={[x, 0.45, 0]}>
                {/* Main Cylindrical Shell */}
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[1.15, 1.15, 4.0, 20]} />
                  <meshStandardMaterial
                    color={v.isSelected ? "#38BDF8" : v.isHovered ? "#FDE047" : "#EAB308"}
                    roughness={0.4}
                    metalness={0.4}
                    transparent={v.opacity < 1}
                    opacity={v.opacity}
                  />
                </mesh>
                {/* Inspection Manhole Cover on top */}
                <mesh position={[0, 1.25, 0]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} />
                </mesh>
                {/* Steel Saddles */}
                <mesh position={[0, -0.85, 0]}>
                  <boxGeometry args={[2.5, 0.45, 1.2]} />
                  <meshStandardMaterial color="#0F172A" />
                </mesh>
              </group>
            ))}

            {/* Fuel Status LED */}
            <mesh position={[0, 1.8, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={1.0} />
            </mesh>

            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['fuel-storage'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -0.55, 0]}
              >
                <ringGeometry args={[6.5, 6.9, 24]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#EAB308"} />
              </mesh>
            )}

            {showLabels && fuel && (
              <Html position={[0, 2.6, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  Fuel Reserves {fuel.loadPercentage}% (20kL)
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 10. WATER RESERVOIR (Vertical Cylinder with Conical Roof)      */}
      {/* Maps to 'water-sys'                                            */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(water);
        return (
          <group position={[6, 2.4, -12]} {...getInteractiveHandlers(water)}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[1.9, 1.9, 4.4, 20]} />
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#93C5FD" : "#0284C7"}
                roughness={0.35}
                metalness={0.45}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </mesh>

            {/* Conical Roof */}
            <mesh position={[0, 2.6, 0]} castShadow>
              <coneGeometry args={[2.0, 0.9, 20]} />
              <meshStandardMaterial color="#0369A1" roughness={0.3} metalness={0.5} />
            </mesh>

            {(v.isSelected || v.isFaulted) && (
              <mesh 
                ref={el => { pulseRingsRef.current['water-sys'] = el; }}
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -1.95, 0]}
              >
                <ringGeometry args={[2.6, 2.9, 24]} />
                <meshBasicMaterial color={v.isSelected ? "#0EA5E9" : "#0284C7"} />
              </mesh>
            )}

            {showLabels && water && (
              <Html position={[0, 3.4, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  Priyadarshini Water Plant
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 11. SPARES STORE CONTAINER                                     */}
      {/* Maps to 'spares-store'                                         */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(spares);
        return (
          <group position={[14, 1.3, -10]} {...getInteractiveHandlers(spares)}>
            <RoundedBox
              args={[6.2, 2.2, 3.2]}
              radius={0.16}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#94A3B8" : "#64748B"}
                roughness={0.65}
                metalness={0.25}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            {showLabels && spares && (
              <Html position={[0, 2.0, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  Spares Depot
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 12. EDGE GATEWAY & DATA BUFFER                                 */}
      {/* Maps to 'edge-gateway'                                         */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(edge);
        return (
          <group position={[5, 1.1, 6]} {...getInteractiveHandlers(edge)}>
            <RoundedBox
              args={[2.6, 1.8, 2.2]}
              radius={0.12}
              smoothness={3}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#CBD5E1" : "#475569"}
                roughness={0.5}
                metalness={0.5}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>
            {/* Whip antenna */}
            <mesh position={[0.9, 1.5, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.3, 6]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} />
            </mesh>
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 13. RAISED INSULATED TRANSIT CORRIDORS WITH HANDRAILS          */}
      {/* ============================================================== */}
      <group>
        {/* Hab to Lab corridor */}
        <RoundedBox args={[4.2, 1.4, 1.8]} radius={0.12} smoothness={3} position={[9.5, 1.3, 0]} castShadow>
          <meshStandardMaterial color="#94A3B8" roughness={0.5} metalness={0.3} />
        </RoundedBox>
        {/* Hab to Gen1 corridor */}
        <RoundedBox
          args={[6.2, 1.3, 1.6]}
          radius={0.12}
          smoothness={3}
          position={[-7.5, 1.1, 3.2]}
          rotation={[0, -0.6, 0]}
          castShadow
        >
          <meshStandardMaterial color="#94A3B8" roughness={0.5} metalness={0.3} />
        </RoundedBox>
      </group>

      {/* ============================================================== */}
      {/* 14. POLAR SNOW VEHICLE (PistenBully Snowcat with Cleated Tracks)*/}
      {/* ============================================================== */}
      <group position={[4, 0.75, 16.5]} rotation={[0, 0.35, 0]}>
        {/* Rubber cleated tracks */}
        <mesh position={[-0.85, 0, 0]} castShadow>
          <boxGeometry args={[0.45, 0.55, 3.4]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
        <mesh position={[0.85, 0, 0]} castShadow>
          <boxGeometry args={[0.45, 0.55, 3.4]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
        {/* Cabin */}
        <RoundedBox args={[1.9, 1.1, 2.9]} radius={0.12} smoothness={3} position={[0, 0.65, 0]} castShadow>
          <meshStandardMaterial color="#DC2626" roughness={0.4} metalness={0.3} />
        </RoundedBox>
        {/* Panoramic Windshield */}
        <mesh position={[0, 0.85, 1.05]}>
          <boxGeometry args={[1.6, 0.55, 0.4]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* Front Snow Pusher Blade */}
        <mesh position={[0, 0.1, 2.1]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[2.8, 0.6, 0.1]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 15. ELEVATED HELICOPTER LANDING DECK ('H')                     */}
      {/* ============================================================== */}
      <group position={[26, 0.12, -6]}>
        {/* Timber/Steel Deck Platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[7.2, 7.2, 0.22, 24]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* White Flight Perimeter Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
          <ringGeometry args={[6.4, 6.8, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Bold White 'H' Identification */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.3, 0.12, 0]}>
          <planeGeometry args={[0.7, 3.8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.3, 0.12, 0]}>
          <planeGeometry args={[0.7, 3.8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
          <planeGeometry args={[2.2, 0.7]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
};
