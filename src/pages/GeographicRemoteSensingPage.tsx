import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Compass, 
  MapPin, 
  Globe, 
  Satellite, 
  Ship, 
  Plane, 
  CloudSnow, 
  Wind, 
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface StationLocation {
  id: string;
  name: string;
  country: string;
  lat: string;
  lon: string;
  coordinates: { x: number; y: number }; // Relative percentage on Polar Stereographic SVG
  elevationM: number;
  distanceToMaitriKm: number;
  distanceToBharatiKm: number;
  established: number;
  status: 'active' | 'seasonal' | 'unmanned';
}

interface SatellitePass {
  id: string;
  satellite: string;
  band: string;
  elevationMaxDeg: number;
  startTimeUtc: string;
  endTimeUtc: string;
  durationMin: number;
  status: 'active' | 'upcoming' | 'completed';
  stationTarget: 'Maitri' | 'Bharati' | 'Both';
}

export const GeographicRemoteSensingPage: React.FC = () => {
  const { station, stationData, multiPhysicsState } = useStation();

  const [selectedStation, setSelectedStation] = useState<string>(station === 'MAITRI' ? 'maitri' : 'bharati');
  const [mapLayer, setMapLayer] = useState<'stations' | 'sea_ice' | 'storm_tracks'>('stations');

  // Realistic Antarctic Research Stations
  const stations: StationLocation[] = [
    {
      id: 'maitri',
      name: 'Maitri (India)',
      country: 'India',
      lat: '70°46′00″ S',
      lon: '11°43′56″ E',
      coordinates: { x: 38, y: 35 },
      elevationM: 117,
      distanceToMaitriKm: 0,
      distanceToBharatiKm: 3100,
      established: 1989,
      status: 'active'
    },
    {
      id: 'bharati',
      name: 'Bharati (India)',
      country: 'India',
      lat: '69°24′28″ S',
      lon: '76°11′14″ E',
      coordinates: { x: 68, y: 44 },
      elevationM: 35,
      distanceToMaitriKm: 3100,
      distanceToBharatiKm: 0,
      established: 2012,
      status: 'active'
    },
    {
      id: 'novo',
      name: 'Novolazarevskaya (Russia)',
      country: 'Russia',
      lat: '70°46′37″ S',
      lon: '11°49′26″ E',
      coordinates: { x: 39, y: 35 },
      elevationM: 102,
      distanceToMaitriKm: 5,
      distanceToBharatiKm: 3105,
      established: 1961,
      status: 'active'
    },
    {
      id: 'princess_elisabeth',
      name: 'Princess Elisabeth (Belgium)',
      country: 'Belgium',
      lat: '71°57′00″ S',
      lon: '23°20′50″ E',
      coordinates: { x: 44, y: 39 },
      elevationM: 1372,
      distanceToMaitriKm: 430,
      distanceToBharatiKm: 2750,
      established: 2009,
      status: 'active'
    },
    {
      id: 'zhongshan',
      name: 'Zhongshan (China)',
      country: 'China',
      lat: '69°22′24″ S',
      lon: '76°22′40″ E',
      coordinates: { x: 69, y: 44 },
      elevationM: 11,
      distanceToMaitriKm: 3102,
      distanceToBharatiKm: 2,
      established: 1989,
      status: 'active'
    },
    {
      id: 'progress',
      name: 'Progress II (Russia)',
      country: 'Russia',
      lat: '69°22′44″ S',
      lon: '76°23′13″ E',
      coordinates: { x: 69, y: 45 },
      elevationM: 15,
      distanceToMaitriKm: 3103,
      distanceToBharatiKm: 3,
      established: 1988,
      status: 'active'
    },
    {
      id: 'davis',
      name: 'Davis Station (Australia)',
      country: 'Australia',
      lat: '68°34′36″ S',
      lon: '77°58′03″ E',
      coordinates: { x: 72, y: 42 },
      elevationM: 13,
      distanceToMaitriKm: 3180,
      distanceToBharatiKm: 120,
      established: 1957,
      status: 'active'
    }
  ];

  const satellitePasses: SatellitePass[] = [
    {
      id: 'SAT-01',
      satellite: 'GSAT-7A (Geostationary Indian MilCom)',
      band: 'C-Band Direct',
      elevationMaxDeg: 12.4,
      startTimeUtc: '2026-09-28 00:00',
      endTimeUtc: '2026-09-28 23:59',
      durationMin: 1440,
      status: 'active',
      stationTarget: 'Maitri'
    },
    {
      id: 'SAT-02',
      satellite: 'Intelsat 33e (Spot Polar)',
      band: 'Ku-Band High Throughput',
      elevationMaxDeg: 14.8,
      startTimeUtc: '2026-09-28 00:00',
      endTimeUtc: '2026-09-28 23:59',
      durationMin: 1440,
      status: 'active',
      stationTarget: 'Bharati'
    },
    {
      id: 'SAT-03',
      satellite: 'Iridium NEXT SV-142 (LEO Polar)',
      band: 'L-Band SBD Data',
      elevationMaxDeg: 78.2,
      startTimeUtc: '2026-09-28 21:15',
      endTimeUtc: '2026-09-28 21:29',
      durationMin: 14,
      status: 'active',
      stationTarget: 'Both'
    },
    {
      id: 'SAT-04',
      satellite: 'NOAA-20 VIIRS / ATMS (LEO Weather)',
      band: 'Direct HRPT Downlink',
      elevationMaxDeg: 62.0,
      startTimeUtc: '2026-09-28 22:40',
      endTimeUtc: '2026-09-28 22:54',
      durationMin: 14,
      status: 'upcoming',
      stationTarget: 'Both'
    },
    {
      id: 'SAT-05',
      satellite: 'MetOp-C (EUMETSAT Polar)',
      band: 'X-Band Science',
      elevationMaxDeg: 51.5,
      startTimeUtc: '2026-09-29 00:12',
      endTimeUtc: '2026-09-29 00:25',
      durationMin: 13,
      status: 'upcoming',
      stationTarget: 'Both'
    }
  ];

  const currentStationObj = stations.find(s => s.id === selectedStation) || stations[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Geographic Context & Remote Sensing Telemetry
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Polar stereographic geospatial visualization, international research station neighbors, satellite pass geometry, and intercontinental supply corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            ACTIVE STATION: {station.toUpperCase()} ({stationData.coordinates})
          </span>
        </div>
      </div>

      {/* A. ANTARCTICA MAP & POLAR CONTEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vector Map Canvas */}
        <div className="card-polar p-4 lg:col-span-2 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                A. Polar Stereographic Projection (South Pole Datum)
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Relative coordinates, sea ice concentration zone, and polar storm track corridors.
              </p>
            </div>

            {/* Layer Toggles */}
            <div className="inline-flex rounded border border-[var(--border)] p-0.5 bg-[var(--surface-subtle)] text-[11px]">
              {(['stations', 'sea_ice', 'storm_tracks'] as const).map(layer => (
                <button
                  key={layer}
                  onClick={() => setMapLayer(layer)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    mapLayer === layer 
                      ? 'bg-[var(--surface)] text-[var(--primary)] font-medium shadow-xs' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {layer === 'stations' ? 'Stations' : layer === 'sea_ice' ? 'Sea Ice Extent' : 'Storm Vortex'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map of Antarctica */}
          <div className="relative w-full h-[400px] bg-slate-900 rounded-lg overflow-hidden border border-[var(--border)] flex items-center justify-center p-4">
            {/* Polar Graticule Circles & Lines */}
            <svg viewBox="0 0 500 500" className="w-full h-full max-w-[480px]">
              <defs>
                <radialGradient id="antarcticaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="85%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <filter id="iceGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background */}
              <circle cx="250" cy="250" r="235" fill="url(#antarcticaGlow)" stroke="#334155" strokeWidth="1" />
              
              {/* Latitude Rings (60°S, 70°S, 80°S) */}
              <circle cx="250" cy="250" r="210" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x="255" y="45" fill="#64748b" fontSize="8" fontFamily="monospace">60°S</text>

              <circle cx="250" cy="250" r="145" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x="255" y="110" fill="#64748b" fontSize="8" fontFamily="monospace">70°S</text>

              <circle cx="250" cy="250" r="75" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x="255" y="180" fill="#64748b" fontSize="8" fontFamily="monospace">80°S</text>

              {/* Longitude Crosshairs */}
              <line x1="250" y1="15" x2="250" y2="485" stroke="#334155" strokeWidth="0.5" />
              <line x1="15" y1="250" x2="485" y2="250" stroke="#334155" strokeWidth="0.5" />
              <text x="255" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace">0° (Prime)</text>
              <text x="255" y="480" fill="#94a3b8" fontSize="8" fontFamily="monospace">180°</text>
              <text x="445" y="245" fill="#94a3b8" fontSize="8" fontFamily="monospace">90°E</text>
              <text x="20" y="245" fill="#94a3b8" fontSize="8" fontFamily="monospace">90°W</text>

              {/* Sea Ice Fringe Layer (Simulated Extent) */}
              {mapLayer === 'sea_ice' && (
                <path
                  d="M 250,55 C 340,65 430,140 435,245 C 440,350 350,440 250,445 C 150,440 60,350 65,245 C 70,140 160,55 250,55 Z"
                  fill="rgba(56, 189, 248, 0.12)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {/* Simulated Storm Vortex Vector */}
              {mapLayer === 'storm_tracks' && (
                <g>
                  <path
                    d="M 120,180 Q 180,100 290,120 T 380,240"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <polygon points="385,245 375,235 382,232" fill="#f43f5e" />
                  <text x="140" y="110" fill="#f43f5e" fontSize="9" fontFamily="monospace">Low 948 hPa Polar Cyclone</text>
                </g>
              )}

              {/* Antarctic Continental Landmass Outline (Realistic stylized vector) */}
              <path
                d="M 240,110 
                   C 280,110 320,130 350,150 
                   C 380,170 395,210 390,250 
                   C 385,290 360,340 320,360 
                   C 280,380 230,375 190,350 
                   C 150,325 140,290 145,260 
                   C 130,245 110,210 115,180 
                   C 120,150 150,135 180,125 
                   Z"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Ice Shelves: Ross & Ronne-Filchner */}
              <path
                d="M 220,320 C 240,310 270,310 290,325 C 275,345 235,345 220,320 Z"
                fill="#334155"
                stroke="#475569"
                strokeWidth="1"
              />
              <text x="235" y="332" fill="#94a3b8" fontSize="7" fontFamily="monospace">Ross Ice</text>

              {/* South Pole Marker */}
              <circle cx="250" cy="250" r="3" fill="#e2e8f0" />
              <text x="255" y="254" fill="#cbd5e1" fontSize="7" fontFamily="monospace">South Pole (90°S)</text>

              {/* Station Markers */}
              {stations.map(st => {
                const isSelected = st.id === selectedStation;
                const isMaitri = st.id === 'maitri';
                const isBharati = st.id === 'bharati';
                
                // Map percentages (0-100) to SVG viewbox (0-500)
                const cx = (st.coordinates.x / 100) * 500;
                const cy = (st.coordinates.y / 100) * 500;

                return (
                  <g 
                    key={st.id} 
                    className="cursor-pointer" 
                    onClick={() => setSelectedStation(st.id)}
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                    )}
                    {/* Station dot */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isMaitri || isBharati ? 5 : 3.5} 
                      fill={isMaitri || isBharati ? '#38bdf8' : '#cbd5e1'} 
                      stroke="#0f172a" 
                      strokeWidth="1" 
                    />
                    {/* Label */}
                    <text 
                      x={cx + 8} 
                      y={cy + 3} 
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'} 
                      fontSize={isMaitri || isBharati ? '9' : '8'} 
                      fontWeight={isMaitri || isBharati ? 'bold' : 'normal'}
                      fontFamily="monospace"
                    >
                      {st.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Inset Coordinate Badge */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs border border-slate-700 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">
              Datum: WGS-84 Polar Stereographic (EPSG:3031)
            </div>
          </div>
        </div>

        {/* Selected Station Geolocation Details */}
        <div className="card-polar p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <Compass className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Station Geographic Profile
            </h3>
          </div>

          <div className="space-y-3 text-[12px]">
            <div>
              <span className="text-[11px] text-[var(--text-muted)] block">Selected Station</span>
              <span className="text-[14px] font-medium text-[var(--text-primary)]">{currentStationObj.name}</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Established: {currentStationObj.established}</span>
            </div>

            <div className="space-y-2 bg-[var(--surface-subtle)] p-3 rounded border border-[var(--border)] font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Latitude:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currentStationObj.lat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Longitude:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currentStationObj.lon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Elevation:</span>
                <span className="text-[var(--text-primary)]">{currentStationObj.elevationM} m MSL</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-1.5">
                <span className="text-[var(--text-muted)]">Dist to Maitri:</span>
                <span className="text-[var(--text-primary)]">{currentStationObj.distanceToMaitriKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Dist to Bharati:</span>
                <span className="text-[var(--text-primary)]">{currentStationObj.distanceToBharatiKm} km</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] space-y-1">
              <span className="font-medium text-[var(--text-primary)] block">Strategic Regional Value:</span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {currentStationObj.id === 'maitri' && 'Located in the ice-free Schirmacher Oasis rocky plateau, 100 km inland from the Princess Astrid Coast.'}
                {currentStationObj.id === 'bharati' && 'Constructed on promontory 3 between Thala Fjord and Quilty Bay in the Larsemann Hills, East Antarctica.'}
                {currentStationObj.id === 'novo' && 'Close neighbor to Maitri; shared blue ice runway operated by DROMLAN (Dronning Maud Land Air Network).'}
                {currentStationObj.id === 'zhongshan' && 'Direct neighbor to Bharati (2 km); mutual emergency assistance protocols in place for medical and fire.'}
                {currentStationObj.id === 'princess_elisabeth' && 'Zero-emission station powered by wind and solar microgrid.'}
                {currentStationObj.id === 'progress' && 'Russian logistics and helicopter hub in Prydz Bay; neighbor to Bharati.'}
                {currentStationObj.id === 'davis' && 'Key Australian research hub 120 km east of Bharati across Prydz Bay.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* B. SATELLITE VISIBILITY & PASS GANTT */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              B. Satellite Comms Windows & Polar Orbital Pass Schedule
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Real-time line-of-sight elevation angles and upcoming polar orbit satellite contact intervals.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            STATION ANTENNA EL: {multiPhysicsState.comms.antenna_el_deg.toFixed(1)}°
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse font-mono">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-left bg-[var(--surface-subtle)]">
                <th className="py-2 px-2.5 font-medium">Satellite / Payload</th>
                <th className="py-2 px-2.5 font-medium">Band / Link Type</th>
                <th className="py-2 px-2.5 font-medium">Max Elevation</th>
                <th className="py-2 px-2.5 font-medium">Pass Interval (UTC)</th>
                <th className="py-2 px-2.5 font-medium">Duration</th>
                <th className="py-2 px-2.5 font-medium">Target Station</th>
                <th className="py-2 px-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {satellitePasses.map((sat) => (
                <tr key={sat.id} className="hover:bg-[var(--surface-subtle)] transition-colors">
                  <td className="py-2 px-2.5 text-[var(--text-primary)] font-medium">{sat.satellite}</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">{sat.band}</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">{sat.elevationMaxDeg}°</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">{sat.startTimeUtc} — {sat.endTimeUtc.slice(11)}</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">{sat.durationMin} min</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">{sat.stationTarget}</td>
                  <td className="py-2 px-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      sat.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {sat.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* C. LOGISTICS REACH & RESUPPLY WINDOWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-polar p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <Ship className="w-4 h-4 text-blue-600" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Intercontinental Resupply Corridors
            </h3>
          </div>

          <div className="space-y-2.5 text-[11px] font-mono">
            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold text-[var(--text-primary)]">
                <span>Cape Town (South Africa) → Maitri</span>
                <span className="text-blue-600">~12-16 Days Ship</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                Polar research vessel Ivan Papanin / MV Vasiliy Golovnin transits 4,200 km south to Princess Astrid Coast ice edge. Cargo helicoptered to station.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold text-[var(--text-primary)]">
                <span>Cape Town / Hobart → Bharati</span>
                <span className="text-blue-600">~14-18 Days Ship</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                Direct approach into Prydz Bay and Thala Fjord. Fast ice breaking required before offloading onto Larsemann Hills rocky apron.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <div className="flex justify-between font-semibold text-[var(--text-primary)]">
                <span>Cape Town → Novo Blue Ice Runway</span>
                <span className="text-purple-600">6.0 Hours (IL-76TD)</span>
              </div>
              <p className="text-[var(--text-secondary)] font-sans text-[11px]">
                DROMLAN intercontinental airbridge operates November to February. Feeder ski aircraft (Basler BT-67) connects Novo to other stations.
              </p>
            </div>
          </div>
        </div>

        <div className="card-polar p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Annual Operational Access Calendar
            </h3>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-800">
              <span className="font-semibold">Austral Summer (Nov 01 – Mar 15):</span>
              <span className="font-mono text-[10px]">OPEN RESUPPLY WINDOW</span>
            </div>
            <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
              24-hour daylight, sea ice retreat, ship offloading, air cargo delivery, personnel rotation, and major infrastructure retrofits.
            </p>

            <div className="flex items-center justify-between p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-800 mt-2">
              <span className="font-semibold">Deep Polar Winter (Apr 01 – Oct 15):</span>
              <span className="font-mono text-[10px]">TOTAL ISOLATION</span>
            </div>
            <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
              Complete physical isolation. Polar night, blizzards exceeding 45 m/s, sea ice barrier &gt;2.5 m thick. No physical evacuation or parts delivery possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
