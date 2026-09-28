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

export const BharatiStationMesh: React.FC<StationMeshProps> = ({
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
  const pulseRingsRef = useRef<{ [key: string]: THREE.Mesh | null }>({});

  const getComp = (id: string) => components.find(c => c.id === id);

  const gen1 = getComp('bhr-gen-01');
  const gen2 = getComp('bhr-gen-02');
  const bess = getComp('bhr-bess-01');
  const chp = getComp('bhr-chp-01');
  const swro = getComp('bhr-swro-01');
  const sat = getComp('bhr-sat-link');
  const fuel = getComp('bhr-fuel-storage');
  const hab = getComp('bhr-living-qtr');
  const lab = getComp('bhr-lab-mod');

  useFrame(() => {
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
      {/* 1. AERODYNAMIC STILTED CANTILEVER POD (Bharati Main Envelope)  */}
      {/* Maps to 'bhr-living-qtr'                                       */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(hab);
        return (
          <group position={[0, 4.0, 0]} {...getInteractiveHandlers(hab)}>
            {/* Heavy Tubular Steel Pylons Anchored in Permafrost Bedrock */}
            {[-12, -6, 0, 6, 12].map(x => (
              <group key={`bhr-stilt-${x}`}>
                <mesh position={[x, -2.6, -4.2]} castShadow>
                  <cylinderGeometry args={[0.38, 0.42, 3.2, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[x, -2.6, 4.2]} castShadow>
                  <cylinderGeometry args={[0.38, 0.42, 3.2, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
                </mesh>
              </group>
            ))}

            {/* Aerodynamic Chamfered Envelope Body with RoundedBox */}
            <RoundedBox
              args={[30.5, 4.0, 12.4]}
              radius={0.45}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : v.isHovered ? "#93C5FD" : "#E2E8F0"}
                roughness={0.4}
                metalness={0.25}
                transparent={v.opacity < 1}
                opacity={v.opacity}
              />
            </RoundedBox>

            {/* Continuous Ribbon Panoramic Window Strip with Solar Tinted Glass */}
            <mesh position={[0, 0.45, 6.25]}>
              <boxGeometry args={[28.5, 1.3, 0.08]} />
              <meshStandardMaterial color="#0A0F1D" roughness={0.08} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.45, -6.25]}>
              <boxGeometry args={[28.5, 1.3, 0.08]} />
              <meshStandardMaterial color="#0A0F1D" roughness={0.08} metalness={0.9} />
            </mesh>

            {/* Dual Rooftop Radomes (GSAT-7A + Maritime Tracking) */}
            <group position={[-8.5, 2.9, 0]} {...getInteractiveHandlers(sat)}>
              <mesh position={[0, -0.4, 0]} castShadow>
                <cylinderGeometry args={[0.9, 1.0, 0.8, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
              </mesh>
              <mesh castShadow>
                <sphereGeometry args={[1.7, 24, 24]} />
                <meshStandardMaterial color="#F8FAFC" roughness={0.25} metalness={0.15} />
              </mesh>
            </group>
            <group position={[8.5, 2.9, 0]}>
              <mesh position={[0, -0.4, 0]} castShadow>
                <cylinderGeometry args={[0.8, 0.9, 0.8, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
              </mesh>
              <mesh castShadow>
                <sphereGeometry args={[1.5, 24, 24]} />
                <meshStandardMaterial color="#F8FAFC" roughness={0.25} metalness={0.15} />
              </mesh>
            </group>

            {showLabels && hab && (
              <Html position={[0, 4.4, 0]} center distanceFactor={35} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  Bharati Main Complex · {hab.temperature}°C
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 2. GENERATOR & CHP COMBINED HEAT AND POWER PLANT               */}
      {/* Maps to 'bhr-gen-01'                                           */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(gen1);
        return (
          <group position={[-18.5, 1.6, 14]} {...getInteractiveHandlers(gen1)}>
            <RoundedBox args={[8.4, 2.8, 5.2]} radius={0.2} smoothness={3} castShadow receiveShadow>
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : "#DC2626"}
                roughness={0.55}
                metalness={0.3}
              />
            </RoundedBox>

            {/* CHP Heat Exchangers & Exhaust Stacks */}
            {[-2.2, 2.2].map(x => (
              <group key={`chp-${x}`} position={[x, 2.2, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.24, 0.24, 1.8, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.4, 0]}>
                  <boxGeometry args={[0.8, 0.6, 0.8]} />
                  <meshStandardMaterial color="#475569" metalness={0.7} />
                </mesh>
              </group>
            ))}

            {showLabels && gen1 && (
              <Html position={[0, 3.0, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  MAN DG-01 + CHP Heat Recovery
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 3. SEAWATER REVERSE OSMOSIS (SWRO) WATER PLANT                 */}
      {/* Maps to 'bhr-swro-01'                                          */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(swro);
        return (
          <group position={[18.5, 1.5, 14]} {...getInteractiveHandlers(swro)}>
            <RoundedBox args={[7.4, 2.5, 4.8]} radius={0.18} smoothness={3} castShadow receiveShadow>
              <meshStandardMaterial
                color={v.isSelected ? "#38BDF8" : "#0284C7"}
                roughness={0.45}
                metalness={0.35}
              />
            </RoundedBox>

            {/* Trace-Heated Seawater Intake Pipe Line Running to Coast */}
            <mesh position={[0, -0.7, 8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 14, 12]} />
              <meshStandardMaterial color="#0369A1" roughness={0.5} metalness={0.6} />
            </mesh>

            {showLabels && swro && (
              <Html position={[0, 2.6, 0]} center distanceFactor={30} className="pointer-events-none select-none">
                <div className="px-2.5 py-1 rounded bg-[#0A1428]/85 text-white font-mono text-[11px] whitespace-nowrap border border-white/20 shadow-md">
                  Dual-Stage SWRO Desalination Plant
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* ============================================================== */}
      {/* 4. CANTILEVERED HELIPAD PLATFORM WITH GANGWAY                  */}
      {/* ============================================================== */}
      <group position={[28, 2.6, -4]}>
        {/* Cantilever support truss */}
        <mesh position={[-6.2, -1.0, 0]} castShadow>
          <boxGeometry args={[6.4, 0.7, 2.6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Helipad Deck */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[8.6, 8.6, 0.32, 24]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
          <ringGeometry args={[7.8, 8.2, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.6, 0.18, 0]}>
          <planeGeometry args={[0.8, 4.6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, 0.18, 0]}>
          <planeGeometry args={[0.8, 4.6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
          <planeGeometry args={[2.6, 0.8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 5. ARCTIC FUEL STORAGE FARM ON CONCRETE PAD                    */}
      {/* ============================================================== */}
      {(() => {
        const v = getVisualState(fuel);
        return (
          <group position={[-20, 1.3, -12]} {...getInteractiveHandlers(fuel)}>
            <mesh position={[0, -0.6, 0]} receiveShadow>
              <boxGeometry args={[14.5, 0.6, 6.2]} />
              <meshStandardMaterial color="#334155" roughness={0.9} />
            </mesh>
            {[-4.8, -1.6, 1.6, 4.8].map(x => (
              <mesh key={`bhr-fuel-${x}`} position={[x, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[1.2, 1.2, 4.6, 20]} />
                <meshStandardMaterial
                  color={v.isSelected ? "#38BDF8" : "#EAB308"}
                  roughness={0.4}
                  metalness={0.4}
                />
              </mesh>
            ))}
          </group>
        );
      })()}
    </group>
  );
};
