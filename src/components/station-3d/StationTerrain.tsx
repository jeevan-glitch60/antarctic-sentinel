import React, { useMemo } from 'react';
import * as THREE from 'three';

interface StationTerrainProps {
  isMaitri: boolean;
}

export const StationTerrain: React.FC<StationTerrainProps> = ({ isMaitri }) => {
  // Mountain peaks generation
  const mountains = useMemo(() => {
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI + 0.15;
      const dist = 110 + (i % 4) * 18;
      const x = Math.cos(angle) * dist * 1.6;
      const z = -Math.abs(Math.sin(angle) * dist) - 35;
      const height = 28 + ((i * 7) % 24);
      const radius = 22 + ((i * 5) % 18);
      list.push({ x, z, height, radius, segments: 6 + (i % 3) });
    }
    return list;
  }, []);

  // Exposed bedrock nunatak patches (Schirmacher Oasis)
  const rockPatches = useMemo(() => {
    if (!isMaitri) {
      return [
        { x: -22, z: 10, sx: 18, sz: 14, rot: 0.35, h: 0.4 },
        { x: 26, z: 14, sx: 20, sz: 15, rot: -0.4, h: 0.5 },
        { x: -8, z: -18, sx: 14, sz: 12, rot: 0.75, h: 0.35 },
      ];
    }
    return [
      { x: -16, z: 8, sx: 22, sz: 16, rot: 0.25, h: 0.5 },
      { x: 18, z: -6, sx: 26, sz: 18, rot: -0.3, h: 0.6 },
      { x: 4, z: 20, sx: 18, sz: 14, rot: 0.6, h: 0.4 },
      { x: -26, z: -12, sx: 16, sz: 12, rot: -0.45, h: 0.45 },
      { x: 32, z: 18, sx: 20, sz: 14, rot: 0.35, h: 0.55 },
    ];
  }, [isMaitri]);

  // Rolling snow drift dunes
  const snowDrifts = useMemo(() => [
    { x: -42, z: -30, sx: 32, sy: 4.8, sz: 22, rot: 0.2 },
    { x: 45, z: -25, sx: 36, sy: 5.2, sz: 24, rot: -0.25 },
    { x: -48, z: 24, sx: 28, sy: 4.0, sz: 20, rot: 0.45 },
    { x: 50, z: 30, sx: 32, sy: 4.2, sz: 22, rot: -0.2 },
    { x: 0, z: -55, sx: 45, sy: 6.5, sz: 28, rot: 0.1 },
    { x: -15, z: -35, sx: 24, sy: 3.5, sz: 18, rot: -0.3 },
    { x: 20, z: -38, sx: 26, sy: 3.8, sz: 18, rot: 0.2 },
  ], []);

  // Utility pipe runs across the snow
  const utilityPipes = useMemo(() => [
    // Main fuel line from fuel farm to generators
    { start: [-6, 0.25, -14], end: [-14, 0.25, 6], diam: 0.14 },
    // Heated glycol water line from water tank to living quarters
    { start: [6, 0.25, -12], end: [2, 0.25, 0], diam: 0.18 },
    // Main power bus duct from BESS to power house and hab
    { start: [-5, 0.25, 10], end: [0, 0.25, 2], diam: 0.15 },
  ], []);

  return (
    <group>
      {/* 1. Main Snow Ground Plane with PBR roughness & polar specular tone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[320, 320, 64, 64]} />
        <meshStandardMaterial 
          color="#F4F8FB" 
          roughness={0.88} 
          metalness={0.02} 
        />
      </mesh>

      {/* 2. Blue Ice Surface (Lake Priyadarshini or Larsemann Coastal Shelf) */}
      {isMaitri ? (
        <group position={[-36, 0.04, 32]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[44, 30]} />
            <meshStandardMaterial 
              color="#93C5FD" 
              roughness={0.15} 
              metalness={0.4} 
              transparent 
              opacity={0.85} 
            />
          </mesh>
          {/* Faint ice fractures */}
          <mesh rotation={[-Math.PI / 2, 0, 0.4]} position={[0, 0.01, 0]}>
            <planeGeometry args={[36, 0.3]} />
            <meshBasicMaterial color="#E0F2FE" transparent opacity={0.6} />
          </mesh>
        </group>
      ) : (
        <group position={[0, -0.02, 52]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[280, 70]} />
            <meshStandardMaterial 
              color="#60A5FA" 
              roughness={0.18} 
              metalness={0.45} 
              transparent 
              opacity={0.82} 
            />
          </mesh>
        </group>
      )}

      {/* 3. Surface Conduits, Fuel Pipelines, and Cable Trays on Snow */}
      {utilityPipes.map((pipe, idx) => {
        const p1 = new THREE.Vector3(...pipe.start);
        const p2 = new THREE.Vector3(...pipe.end);
        const length = p1.distanceTo(p2);
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const dir = p2.clone().sub(p1).normalize();
        const orientation = new THREE.Matrix4();
        orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));

        return (
          <group key={`pipe-${idx}`}>
            {/* Insulated Pipe Cylinder */}
            <mesh position={mid} rotation={[Math.PI / 2, Math.atan2(dir.x, dir.z), 0]} castShadow receiveShadow>
              <cylinderGeometry args={[pipe.diam, pipe.diam, length, 12]} />
              <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Pipe Support Sleepers on Snow */}
            {[0.2, 0.5, 0.8].map((pct, sIdx) => {
              const pos = p1.clone().lerp(p2, pct);
              return (
                <mesh key={`sleep-${idx}-${sIdx}`} position={[pos.x, 0.1, pos.z]} castShadow>
                  <boxGeometry args={[0.5, 0.2, 0.3]} />
                  <meshStandardMaterial color="#334155" roughness={0.8} />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* 4. Snow Vehicle Track Impressions */}
      <group position={[12, 0.01, 14]} rotation={[0, -0.3, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.6, 28]} />
          <meshStandardMaterial color="#DCE7F0" roughness={0.95} />
        </mesh>
        <mesh position={[1.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.6, 28]} />
          <meshStandardMaterial color="#DCE7F0" roughness={0.95} />
        </mesh>
      </group>

      {/* 5. Exposed Rock Nunataks with Stratified Rock Layers */}
      {rockPatches.map((rock, idx) => (
        <group key={`rock-${idx}`} position={[rock.x, 0.02, rock.z]} rotation={[0, rock.rot, 0]}>
          {/* Main Rock Mass */}
          <mesh position={[0, rock.h * 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[rock.sx * 0.45, rock.sx * 0.52, rock.h, 7]} />
            <meshStandardMaterial 
              color="#3B434E" 
              roughness={0.95} 
              metalness={0.08} 
              flatShading 
            />
          </mesh>
          {/* Secondary Layering Ledge */}
          <mesh position={[rock.sx * 0.15, rock.h * 0.7, 0]} castShadow>
            <boxGeometry args={[rock.sx * 0.6, rock.h * 0.5, rock.sz * 0.5]} />
            <meshStandardMaterial 
              color="#2F3640" 
              roughness={0.92} 
              metalness={0.1} 
              flatShading 
            />
          </mesh>
        </group>
      ))}

      {/* 6. Rolling Snow Drifts (Organic Dunes) */}
      {snowDrifts.map((drift, idx) => (
        <mesh 
          key={`drift-${idx}`} 
          position={[drift.x, drift.sy * 0.35, drift.z]} 
          rotation={[0, drift.rot, 0]}
          receiveShadow
        >
          <coneGeometry args={[drift.sx * 0.5, drift.sy, 10]} />
          <meshStandardMaterial 
            color="#EBF1F7" 
            roughness={0.92} 
            metalness={0.01} 
          />
        </mesh>
      ))}

      {/* 7. Majestic Antarctic Mountain Range in Background */}
      {mountains.map((m, idx) => (
        <group key={`mountain-${idx}`} position={[m.x, m.height * 0.48 - 1, m.z]}>
          {/* Dark Exposed Rock Mountain Body */}
          <mesh receiveShadow>
            <coneGeometry args={[m.radius, m.height, m.segments]} />
            <meshStandardMaterial 
              color={idx % 2 === 0 ? "#333C48" : "#28303A"} 
              roughness={0.96} 
              metalness={0.04} 
              flatShading 
            />
          </mesh>
          {/* Snow Cap with Jagged Overhangs */}
          <mesh position={[0, m.height * 0.26, 0]}>
            <coneGeometry args={[m.radius * 0.5, m.height * 0.5, m.segments]} />
            <meshStandardMaterial 
              color="#F8FAFC" 
              roughness={0.85} 
              metalness={0.02} 
              flatShading 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
