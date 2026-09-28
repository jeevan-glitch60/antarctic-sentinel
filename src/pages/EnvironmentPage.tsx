import React from 'react';
import { useStation } from '../context/StationContext';
import { 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Sun, 
  Compass, 
  Eye, 
  ShieldAlert, 
  Gauge, 
  Radio, 
  MapPin 
} from 'lucide-react';

export const EnvironmentPage: React.FC = () => {
  const { station, stationData, currentTelemetry } = useStation();

  const isMaitri = station === 'MAITRI';

  // Wind Chill calculation: T_wc = 13.12 + 0.6215*T - 11.37*V^0.16 + 0.3965*T*V^0.16
  const T = currentTelemetry.ambientTemp;
  const V_kmh = currentTelemetry.windSpeed * 3.6;
  const windChill = Number((13.12 + 0.6215 * T - 11.37 * Math.pow(V_kmh, 0.16) + 0.3965 * T * Math.pow(V_kmh, 0.16)).toFixed(1));

  // Blizzard Condition categorization (USAP/NCPOR Polar Standard)
  const getBlizzardCondition = (wind: number, vis: number) => {
    if (wind >= 28 || vis <= 0.2) {
      return { level: 'CONDITION 1 (STATION LOCKDOWN)', desc: 'Severe Blizzard. Zero visibility. Outdoor travel strictly prohibited.', color: 'text-[var(--critical)] bg-[var(--critical-soft)] border-[var(--critical)]' };
    }
    if (wind >= 20 || vis <= 1.0) {
      return { level: 'CONDITION 2 (HIGH HAZARD)', desc: 'High winds & drifting snow. Movement between modules requires tethered lines.', color: 'text-[var(--warning)] bg-[var(--warning-soft)] border-[var(--warning)]' };
    }
    if (wind >= 14 || vis <= 4.0) {
      return { level: 'CONDITION 3 (ADVISORY)', desc: 'Moderate polar gales. Two-person buddy rule active for exterior access.', color: 'text-[var(--caution)] bg-[var(--caution-soft)] border-[var(--caution)]' };
    }
    return { level: 'NORMAL OPERATIONAL (GREEN)', desc: 'Conditions favorable for scientific field sampling and exterior logistics.', color: 'text-[var(--success)] bg-[var(--success-soft)] border-[var(--success)]' };
  };

  const blizzardState = getBlizzardCondition(currentTelemetry.windSpeed, currentTelemetry.visibilityKm);

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Polar Environmental & Meteorological Station
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Real-time atmospheric monitoring, apparent wind chill, and polar blizzard threat classification.
          </p>
        </div>

        {/* Blizzard Condition Chip */}
        <div className={`px-2.5 py-1 rounded font-mono text-[11px] border ${blizzardState.color}`}>
          {blizzardState.level}
        </div>
      </div>

      {/* METEOROLOGICAL METRIC CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Ambient & Wind Chill */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-[var(--accent)]" />
              Thermal Profile
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">PT100 RTD</span>
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--text-secondary)]">Ambient Temperature</span>
              <span className="font-mono text-[16px] font-semibold text-[var(--text-primary)]">{currentTelemetry.ambientTemp} °C</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--text-secondary)]">Apparent Wind Chill</span>
              <span className="font-mono text-[16px] font-semibold text-[var(--critical)]">{windChill} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">24h Minimum</span>
              <span className="font-mono text-[var(--text-muted)]">{isMaitri ? '-24.8 °C' : '-19.2 °C'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">24h Maximum</span>
              <span className="font-mono text-[var(--text-muted)]">{isMaitri ? '-14.2 °C' : '-10.5 °C'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Wind & Gust Dynamics */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[var(--warning)]" />
              Wind Dynamics
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">Sonic 3-Axis</span>
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--text-secondary)]">Sustained Velocity</span>
              <span className="font-mono text-[16px] font-semibold text-[var(--text-primary)]">{currentTelemetry.windSpeed} m/s</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--text-secondary)]">Speed in Knots</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">{Math.round(currentTelemetry.windSpeed * 1.94)} kts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Peak Gust Recorded</span>
              <span className="font-mono text-[var(--warning)] font-semibold">{Math.round(currentTelemetry.windSpeed * 1.35)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Vector Azimuth</span>
              <span className="font-mono text-[var(--text-muted)]">{currentTelemetry.windDirectionDeg}° SSE</span>
            </div>
          </div>
        </div>

        {/* Card 3: Atmospheric Pressure & Tendency */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[var(--success)]" />
              Barometric Trend
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">Precision hPa</span>
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--text-secondary)]">Sea Level / MSL Pressure</span>
              <span className="font-mono text-[16px] font-semibold text-[var(--text-primary)]">{currentTelemetry.barometricPressure} hPa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">3-Hour Pressure Delta</span>
              <span className="font-mono text-[var(--success)] font-medium">+0.8 hPa (Steady)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Storm Barometer</span>
              <span className="font-mono text-[var(--text-muted)]">No Rapid Frontal Drop</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Air Density</span>
              <span className="font-mono text-[var(--text-muted)]">1.38 kg/m³ (Polar High)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Space Weather & Solar Irradiance */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[var(--accent)]" />
              Geomagnetic & Solar
            </span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">NOAA Space Wx</span>
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--text-secondary)]">Geomagnetic Kp-Index</span>
              <span className="font-mono text-[16px] font-semibold text-[var(--text-primary)]">Kp 3 (Quiet)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Solar Irradiance</span>
              <span className="font-mono text-[var(--text-primary)]">680 W/m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Daylight Duration</span>
              <span className="font-mono text-[var(--text-muted)]">14h 22m (Equinox Window)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Polar Cap Absorption</span>
              <span className="font-mono text-[var(--success)]">Negligible (HF Clear)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTINENTAL ANTARCTIC GEOGRAPHIC MAP VIEW */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Antarctic Geographic Continental Map & Station Locations
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Spatial disposition of Indian Antarctic research stations across Queen Maud Land and East Antarctica.
            </p>
          </div>
          <div className="font-mono text-[11px] text-[var(--text-muted)]">
            Polar Stereographic Projection (EPSG:3031)
          </div>
        </div>

        {/* SVG Continental Map */}
        <div className="w-full h-80 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 900 480" className="w-full h-full">
            <defs>
              <radialGradient id="antarcticIce" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </radialGradient>
            </defs>

            {/* Ocean background */}
            <rect width="900" height="480" fill="#1E293B" opacity="0.08" />

            {/* Latitude Grid Circles (60°S, 70°S, 80°S) */}
            <circle cx="450" cy="240" r="210" fill="none" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="4 4" />
            <circle cx="450" cy="240" r="140" fill="none" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="4 4" />
            <circle cx="450" cy="240" r="70" fill="none" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="4 4" />

            <text x="450" y="235" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="IBM Plex Mono">SOUTH POLE (90° S)</text>
            <text x="450" y="105" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="IBM Plex Mono">70° S</text>

            {/* Antarctic Landmass Geometry */}
            <path
              d="M 450,40 C 580,50 710,120 730,220 C 750,320 680,410 560,430 C 440,450 360,420 300,380 C 240,340 180,310 190,240 C 200,170 320,30 450,40 Z"
              fill="url(#antarcticIce)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />

            {/* Antarctic Peninsula tail */}
            <path
              d="M 300,210 C 250,180 200,110 210,70 C 220,50 250,90 290,170 Z"
              fill="url(#antarcticIce)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />

            {/* MAITRI Marker (Schirmacher Oasis, 70°45'S 11°44'E) */}
            <g transform="translate(390, 115)" className="cursor-pointer">
              <circle cx="0" cy="0" r="12" fill="#2C5F8A" fillOpacity="0.15" />
              <circle cx="0" cy="0" r="5" fill="#2C5F8A" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="10" y="-12" width="135" height="28" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.8" />
              <text x="16" y="0" fontSize="10" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">
                MAITRI (MTR-01)
              </text>
              <text x="16" y="11" fontSize="8" fontFamily="IBM Plex Mono" fill="var(--text-muted)">
                70° 45′ S · 11° 44′ E (1,610m)
              </text>
              {isMaitri && (
                <circle cx="0" cy="0" r="18" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 2" />
              )}
            </g>

            {/* BHARATI Marker (Larsemann Hills, 69°24'S 76°11'E) */}
            <g transform="translate(630, 155)" className="cursor-pointer">
              <circle cx="0" cy="0" r="12" fill="#3F7A54" fillOpacity="0.15" />
              <circle cx="0" cy="0" r="5" fill="#3F7A54" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="10" y="-12" width="135" height="28" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.8" />
              <text x="16" y="0" fontSize="10" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">
                BHARATI (BHR-01)
              </text>
              <text x="16" y="11" fontSize="8" fontFamily="IBM Plex Mono" fill="var(--text-muted)">
                69° 24′ S · 76° 11′ E (35m)
              </text>
              {!isMaitri && (
                <circle cx="0" cy="0" r="18" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 2" />
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* DEPTH SECTIONS: BLOWING SNOW, FROSTBITE EXPOSURE, DEGREE DAYS, SOLAR EPHEMERIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {/* 1. Blowing Snow Index */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Blowing Snow Index</h4>
            <span className="font-mono text-[10px] text-amber-600 font-semibold">BSI 3.4 (MODERATE)</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Threshold Velocity:</span>
              <span className="text-[var(--text-primary)]">10.8 m/s</span>
            </div>
            <div className="flex justify-between">
              <span>Particle Mass Flux:</span>
              <span className="text-amber-700 font-semibold">14.2 g/m²·s</span>
            </div>
            <div className="flex justify-between">
              <span>Drift Height:</span>
              <span className="text-[var(--text-primary)]">1.8 m (Saltation)</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Inlet Risk:</span>
              <span className="text-amber-700">De-icing heaters armed</span>
            </div>
          </div>
        </div>

        {/* 2. Wind Chill & Frostbite Exposure Time */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Frostbite Exposure Safety</h4>
            <span className="font-mono text-[10px] text-rose-600 font-semibold">10 MIN LIMIT</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Apparent Chill:</span>
              <span className="text-rose-600 font-bold">{windChill} °C</span>
            </div>
            <div className="flex justify-between">
              <span>Exposed Skin Risk:</span>
              <span className="text-rose-700 font-semibold">&lt;10 Min Frostbite</span>
            </div>
            <div className="flex justify-between">
              <span>Mandatory PPE:</span>
              <span className="text-[var(--text-primary)]">Level 4 Polar Parka</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Facial Covering:</span>
              <span className="text-rose-600 font-semibold">Balaclava + Goggles</span>
            </div>
          </div>
        </div>

        {/* 3. Accumulated Degree Days */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Heating Degree Days (HDD)</h4>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">BASE 18.0°C</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Daily HDD:</span>
              <span className="text-[var(--text-primary)] font-semibold">40.4 °C·day</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly HDD:</span>
              <span className="text-[var(--text-primary)]">1,180 °C·day</span>
            </div>
            <div className="flex justify-between">
              <span>Annual Cumulative:</span>
              <span className="text-[var(--text-primary)] font-semibold">6,420 °C·day</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Thermal Stress Index:</span>
              <span className="text-emerald-700 font-semibold">Envelope Nominal</span>
            </div>
          </div>
        </div>

        {/* 4. Solar Ephemeris & Sun Elevation */}
        <div className="card-polar p-3.5 space-y-2">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Solar Elevation Ephemeris</h4>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">SPRING EQUINOX</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Solar Noon Elevation:</span>
              <span className="text-[var(--text-primary)] font-semibold">+19.2° Above Horiz</span>
            </div>
            <div className="flex justify-between">
              <span>Photoperiod:</span>
              <span className="text-[var(--text-primary)]">12h 18m Daylight</span>
            </div>
            <div className="flex justify-between">
              <span>Polar Day Onset:</span>
              <span className="text-emerald-700">Nov 18 (24h Sun)</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Albedo Multiplier:</span>
              <span className="text-blue-700 font-semibold">1.18x Bifacial PV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
