import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Station3DOverlaysProps {
  showEnergy: boolean;
  showLogistics: boolean;
  showEnvironment: boolean;
  showComms?: boolean;
  windSpeedKmh?: number;
}

export const Station3DOverlays: React.FC<Station3DOverlaysProps> = ({
  showEnergy,
  showLogistics,
  showEnvironment,
  showComms = false,
  windSpeedKmh = 38
}) => {
  const snowParticlesRef = useRef<THREE.Points>(null);
  const windArrowsRef = useRef<THREE.Group>(null);
  const energyDashOffsetRef = useRef(0);

  // 1. Snow Particles Setup
  const snowData = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 25 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      speeds[i] = 0.08 + Math.random() * 0.12;
    }

    return { positions, speeds, count };
  }, []);

  // 2. Energy Flow Arcs Geometry (Genset -> BESS -> Living Quarters -> Lab)
  const energyCurves = useMemo(() => {
    const genToBess = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 2.5, 6),
      new THREE.Vector3(-9, 4.0, 8),
      new THREE.Vector3(-5, 2.5, 10),
    ]);
    const bessToHab = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 2.5, 10),
      new THREE.Vector3(-2, 4.5, 5),
      new THREE.Vector3(0, 3.2, 0),
    ]);
    const habToLab = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.2, 0),
      new THREE.Vector3(7, 4.0, 0),
      new THREE.Vector3(14, 2.6, 0),
    ]);

    return [
      genToBess.getPoints(24),
      bessToHab.getPoints(24),
      habToLab.getPoints(24),
    ];
  }, []);

  // 3. Comms Beam Arc (GSAT-7A look-angle beam towards sky)
  const commsBeamCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(15.5, 3.2, 12),
      new THREE.Vector3(25, 18, 30),
      new THREE.Vector3(40, 38, 55),
    ]).getPoints(20);
  }, []);

  // 4. Logistics Ground Waypoint Lines
  const logisticsRoute = useMemo(() => {
    // Helipad to Spares Store, and Fuel Tanks to Genset
    return [
      [new THREE.Vector3(26, 0.2, -6), new THREE.Vector3(14, 0.2, -10)],
      [new THREE.Vector3(-6, 0.2, -14), new THREE.Vector3(-14, 0.2, 6)]
    ];
  }, []);

  // Animation Loop via useFrame
  useFrame((_, delta) => {
    // Drifting Snow & Wind Speed
    if (showEnvironment && snowParticlesRef.current) {
      const positions = snowParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const windDrift = (windSpeedKmh / 20) * delta * 4;

      for (let i = 0; i < snowData.count; i++) {
        // Fall down
        positions[i * 3 + 1] -= snowData.speeds[i];
        // Drift with wind along X
        positions[i * 3] += windDrift;

        // Reset if below ground
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 24;
          positions[i * 3] = (Math.random() - 0.5) * 80;
        }
        if (positions[i * 3] > 40) {
          positions[i * 3] = -40;
        }
      }
      snowParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Energy Arcs Flow Dash
    if (showEnergy) {
      energyDashOffsetRef.current += delta * 2;
    }
  });

  return (
    <group>
      {/* ============================================================== */}
      {/* A. ENERGY FLOW VECTORS                                         */}
      {/* ============================================================== */}
      {showEnergy && (
        <group>
          {energyCurves.map((pts, idx) => (
            <group key={`energy-arc-${idx}`}>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...(() => {
                    const geom = new THREE.BufferGeometry().setFromPoints(pts);
                    return geom;
                  })()}
                />
                <lineBasicMaterial
                  attach="material"
                  color="#22C55E"
                  linewidth={2}
                  transparent
                  opacity={0.85}
                />
              </line>

              {/* Pulsing Energy Nodes along the arc */}
              {pts.filter((_, i) => i % 6 === 0).map((pt, pIdx) => (
                <mesh key={`en-node-${idx}-${pIdx}`} position={pt}>
                  <sphereGeometry args={[0.22, 8, 8]} />
                  <meshBasicMaterial color="#4ADE80" />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}

      {/* ============================================================== */}
      {/* B. COMMS BEAM VECTOR (Satellite Tracking Arc)                  */}
      {/* ============================================================== */}
      {showComms && (
        <group>
          <line>
            <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(commsBeamCurve)} />
            <lineBasicMaterial color="#38BDF8" transparent opacity={0.65} linewidth={2} />
          </line>
          <mesh position={[40, 38, 55]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>
        </group>
      )}

      {/* ============================================================== */}
      {/* C. LOGISTICS SUPPLY ROUTE TRAILS                               */}
      {/* ============================================================== */}
      {showLogistics && (
        <group>
          {logisticsRoute.map((pts, rIdx) => (
            <group key={`log-route-${rIdx}`}>
              <line>
                <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(pts)} />
                <lineBasicMaterial color="#F59E0B" linewidth={2} />
              </line>
              {/* Waypoint pins */}
              <mesh position={pts[0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
              <mesh position={pts[1]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ============================================================== */}
      {/* D. ENVIRONMENT: SNOW PARTICLES & WIND ARROWS                   */}
      {/* ============================================================== */}
      {showEnvironment && (
        <group>
          {/* Snow Particles */}
          <points ref={snowParticlesRef}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                args={[snowData.positions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              attach="material"
              size={0.24}
              color="#FFFFFF"
              transparent
              opacity={0.82}
            />
          </points>

          {/* Translucent Wind Flow Vectors */}
          <group ref={windArrowsRef}>
            {[-15, 0, 15].map(z => (
              <mesh key={`wind-${z}`} position={[-20, 6, z]} rotation={[0, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 22, 6]} />
                <meshBasicMaterial color="#7DD3FC" transparent opacity={0.35} />
              </mesh>
            ))}
          </group>
        </group>
      )}
    </group>
  );
};
