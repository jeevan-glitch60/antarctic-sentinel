import React from 'react';
import { EquipmentComponent } from '../../types';

interface StationTopDownMapProps {
  isMaitri: boolean;
  components: EquipmentComponent[];
  selectedId: string | null;
  onSelectComponent: (comp: EquipmentComponent) => void;
  showLabels: boolean;
}

export const StationTopDownMap: React.FC<StationTopDownMapProps> = ({
  isMaitri,
  components,
  selectedId,
  onSelectComponent,
  showLabels
}) => {
  const getComp = (id: string) => components.find(c => c.id === id);

  return (
    <div className="w-full h-full bg-[#0F172A] relative overflow-hidden flex items-center justify-center p-4">
      <svg
        viewBox="0 0 900 480"
        className="w-full h-full max-h-[520px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Background Engineering Grid */}
        <rect width="900" height="480" fill="#0B132B" />
        <rect width="900" height="480" fill="url(#grid)" />

        {/* Top-Down Map Header */}
        <text x="30" y="36" fill="#94A3B8" fontSize="11" fontFamily="monospace" letterSpacing="1">
          TOP-DOWN 2D SCHEMATIC · {isMaitri ? 'MAITRI NUNATAK SECTOR' : 'BHARATI LARSEMANN SECTOR'}
        </text>

        {isMaitri ? (
          <g transform="translate(100, 40)">
            {/* Frozen Lake Priyadarshini outline */}
            <path
              d="M 50 320 C 150 280, 220 360, 320 340 C 400 320, 480 390, 450 420 C 250 440, 100 410, 50 320 Z"
              fill="#0369A1"
              opacity="0.25"
              stroke="#0EA5E9"
              strokeDasharray="4 4"
            />
            <text x="180" y="380" fill="#38BDF8" fontSize="10" fontFamily="monospace">LAKE PRIYADARSHINI (WATER INTAKE)</text>

            {/* Heated Trace Pipeline to Station */}
            <path d="M 320 340 L 420 220" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="3 3" />

            {/* Main Habitat Complex */}
            {(() => {
              const comp = getComp('living-qtr');
              const isSelected = selectedId === 'living-qtr';
              return (
                <g 
                  onClick={() => comp && onSelectComponent(comp)} 
                  className="cursor-pointer"
                >
                  <rect
                    x="360"
                    y="180"
                    width="180"
                    height="60"
                    rx="4"
                    fill={isSelected ? '#0284C7' : '#1E293B'}
                    stroke={isSelected ? '#38BDF8' : '#334155'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  <text x="450" y="215" fill="#F8FAFC" fontSize="12" fontWeight="600" textAnchor="middle">
                    LIVING QUARTERS (HAB-01)
                  </text>
                </g>
              );
            })()}

            {/* Laboratory Module */}
            {(() => {
              const comp = getComp('lab-mod');
              const isSelected = selectedId === 'lab-mod';
              return (
                <g onClick={() => comp && onSelectComponent(comp)} className="cursor-pointer">
                  <rect
                    x="560"
                    y="185"
                    width="90"
                    height="50"
                    rx="3"
                    fill={isSelected ? '#0284C7' : '#1E293B'}
                    stroke={isSelected ? '#38BDF8' : '#334155'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  <text x="605" y="215" fill="#F8FAFC" fontSize="11" textAnchor="middle">
                    LABORATORY
                  </text>
                </g>
              );
            })()}

            {/* Generator 1 & 2 */}
            {(() => {
              const comp1 = getComp('gen-01');
              const comp2 = getComp('gen-02');
              return (
                <g>
                  <g onClick={() => comp1 && onSelectComponent(comp1)} className="cursor-pointer">
                    <rect x="230" y="150" width="70" height="42" rx="3" fill="#991B1B" stroke="#DC2626" strokeWidth="1.5" />
                    <text x="265" y="175" fill="#FFFFFF" fontSize="10" textAnchor="middle">GEN-01</text>
                  </g>
                  <g onClick={() => comp2 && onSelectComponent(comp2)} className="cursor-pointer">
                    <rect x="230" y="202" width="70" height="42" rx="3" fill="#C2410C" stroke="#EA580C" strokeWidth="1.5" />
                    <text x="265" y="227" fill="#FFFFFF" fontSize="10" textAnchor="middle">GEN-02</text>
                  </g>
                </g>
              );
            })()}

            {/* BESS Battery Container */}
            {(() => {
              const comp = getComp('bess-01');
              return (
                <g onClick={() => comp && onSelectComponent(comp)} className="cursor-pointer">
                  <rect x="230" y="260" width="70" height="38" rx="3" fill="#1E3A8A" stroke="#2563EB" strokeWidth="1.5" />
                  <text x="265" y="284" fill="#FFFFFF" fontSize="10" textAnchor="middle">BESS 500kWh</text>
                </g>
              );
            })()}

            {/* Fuel Storage Tanks */}
            {(() => {
              const comp = getComp('fuel-storage');
              return (
                <g onClick={() => comp && onSelectComponent(comp)} className="cursor-pointer">
                  <rect x="130" y="150" width="75" height="70" rx="3" fill="#854D0E" stroke="#EAB308" strokeWidth="1.5" />
                  <text x="167" y="188" fill="#FFFFFF" fontSize="10" textAnchor="middle">FUEL (20kL)</text>
                </g>
              );
            })()}

            {/* Comms & Radome */}
            {(() => {
              const comp = getComp('sat-link');
              return (
                <g onClick={() => comp && onSelectComponent(comp)} className="cursor-pointer">
                  <circle cx="580" cy="110" r="22" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
                  <circle cx="580" cy="110" r="14" fill="#F8FAFC" />
                  <text x="580" y="146" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">GSAT-7A</text>
                </g>
              );
            })()}

            {/* Helipad */}
            <g transform="translate(670, 260)">
              <circle cx="40" cy="40" r="38" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
              <text x="40" y="48" fill="#FFFFFF" fontSize="24" fontWeight="bold" textAnchor="middle">H</text>
            </g>
          </g>
        ) : (
          <g transform="translate(100, 60)">
            {/* Bharati Pod Top Down */}
            <rect x="250" y="140" width="280" height="90" rx="20" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <text x="390" y="190" fill="#F8FAFC" fontSize="14" fontWeight="600" textAnchor="middle">
              BHARATI AERODYNAMIC ENVELOPE
            </text>
            {/* Radomes */}
            <circle cx="310" cy="185" r="18" fill="#F8FAFC" stroke="#64748B" />
            <circle cx="470" cy="185" r="16" fill="#F8FAFC" stroke="#64748B" />
            {/* Helipad */}
            <g transform="translate(580, 150)">
              <circle cx="40" cy="40" r="38" fill="#1E293B" stroke="#64748B" />
              <text x="40" y="48" fill="#FFFFFF" fontSize="24" fontWeight="bold" textAnchor="middle">H</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
