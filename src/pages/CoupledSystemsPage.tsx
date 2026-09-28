import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Network, 
  Zap, 
  Flame, 
  Droplet, 
  Wind, 
  Sun, 
  Activity, 
  HelpCircle, 
  RotateCw, 
  Layers 
} from 'lucide-react';

export const CoupledSystemsPage: React.FC = () => {
  const { station, stationData, multiPhysicsState } = useStation();

  const [selectedNode, setSelectedNode] = useState<string>('generator_jacket');

  const thermalNodes = [
    { id: 'generator_jacket', name: 'Diesel Generator Jacket', temp: multiPhysicsState.thermal_loop.glycol_temp_out_gen, flow: '120 LPM', role: 'Primary Heat Source' },
    { id: 'exhaust_hx', name: 'Exhaust Gas Heat Exchanger', temp: multiPhysicsState.thermal_loop.glycol_temp_in_hx, flow: '120 LPM', role: 'Waste Heat Recovery' },
    { id: 'hydronic_bus', name: 'Central Hydronic Loop', temp: multiPhysicsState.thermal_loop.glycol_temp_out_hx, flow: '95 LPM', role: 'Distribution Header' },
    { id: 'habitat_fancoil', name: 'Living Pod Fan Coils', temp: multiPhysicsState.zones.living.air_temp_c, flow: '60 LPM', role: 'Space Heating' },
    { id: 'snow_melter', name: 'Snow Melter Tank Coil', temp: 38.2, flow: '35 LPM', role: 'Potable Water Melt' },
  ];

  const activeNodeData = thermalNodes.find(n => n.id === selectedNode) || thermalNodes[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Coupled Multi-Domain Subsystems View
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--accent)] font-medium">
              ENERGY SANKEY & MASS BALANCE
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Interconnected mass, thermal, and electrical conservation flows across station boundaries.
          </p>
        </div>
      </div>

      {/* A. ENERGY SANKEY DIAGRAM (SVG FLOW ARCHITECTURE) */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              A. Station Energy Flow Sankey Diagram (Inputs → Conversion → Distribution → Losses)
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Dynamic energy partitioning between high-grade electricity, hydronic waste heat, and atmospheric loss.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Total Input: 1,320 kW Thermal Eq.
          </span>
        </div>

        {/* Sankey SVG Visualization */}
        <div className="w-full h-64 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex items-center justify-center p-2">
          <svg viewBox="0 0 920 240" className="w-full h-full">
            <defs>
              <linearGradient id="dieselFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B4611F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2C5F8A" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="heatFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B4611F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#A3312B" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="solarFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3F7A54" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2C5F8A" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Inputs Column */}
            <rect x="20" y="30" width="110" height="40" rx="3" fill="var(--surface)" stroke="#B4611F" strokeWidth="1.5" />
            <text x="30" y="50" fontSize="11" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">Diesel Fuel</text>
            <text x="30" y="62" fontSize="9" fontFamily="IBM Plex Mono" fill="#B4611F">820 kW Chem</text>

            <rect x="20" y="90" width="110" height="35" rx="3" fill="var(--surface)" stroke="#3F7A54" strokeWidth="1.5" />
            <text x="30" y="108" fontSize="11" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">Solar PV</text>
            <text x="30" y="118" fontSize="9" fontFamily="IBM Plex Mono" fill="#3F7A54">320 kW Peak</text>

            <rect x="20" y="145" width="110" height="35" rx="3" fill="var(--surface)" stroke="#2C5F8A" strokeWidth="1.5" />
            <text x="30" y="163" fontSize="11" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">Wind Turbine</text>
            <text x="30" y="173" fontSize="9" fontFamily="IBM Plex Mono" fill="#2C5F8A">180 kW Mech</text>

            {/* Primary Generation Stage */}
            <rect x="260" y="45" width="130" height="60" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
            <text x="270" y="68" fontSize="11" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">Diesel Generators</text>
            <text x="270" y="80" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--text-muted)">η_elec: 38% · η_heat: 46%</text>

            {/* Flows: Diesel to Gen */}
            <path d="M 130 50 C 190 50, 200 65, 260 65" fill="none" stroke="url(#dieselFlow)" strokeWidth="16" />
            {/* Flows: Solar & Wind to Main Bus */}
            <path d="M 130 108 C 280 108, 360 140, 500 140" fill="none" stroke="url(#solarFlow)" strokeWidth="8" />
            <path d="M 130 163 C 280 163, 360 150, 500 150" fill="none" stroke="#2C5F8A" strokeWidth="6" />

            {/* Gen Output: Electricity (to Main Power Bus) */}
            <path d="M 390 65 C 440 65, 450 130, 500 130" fill="none" stroke="#2C5F8A" strokeWidth="12" />
            {/* Gen Output: Waste Heat (to Hydronic Loop) */}
            <path d="M 390 85 C 440 85, 450 40, 500 40" fill="none" stroke="url(#heatFlow)" strokeWidth="14" />

            {/* Distribution Column: Electricity & Hydronic Heat */}
            <rect x="500" y="20" width="130" height="40" rx="3" fill="var(--surface)" stroke="#A3312B" strokeWidth="1.5" />
            <text x="510" y="38" fontSize="11" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">Hydronic Waste Heat</text>
            <text x="510" y="50" fontSize="9" fontFamily="IBM Plex Mono" fill="#A3312B">380 kW Captured</text>

            <rect x="500" y="115" width="130" height="50" rx="3" fill="var(--surface)" stroke="#2C5F8A" strokeWidth="1.5" />
            <text x="510" y="135" fontSize="11" fontFamily="IBM Plex Sans" fontWeight="600" fill="var(--text-primary)">Main Electrical Bus</text>
            <text x="510" y="148" fontSize="9" fontFamily="IBM Plex Mono" fill="#2C5F8A">820 kW Total (415V)</text>

            {/* End Users */}
            <rect x="740" y="15" width="150" height="30" rx="3" fill="var(--surface)" stroke="var(--border)" />
            <text x="750" y="32" fontSize="10" fontFamily="IBM Plex Sans" fill="var(--text-primary)">Building Heating & Melter (240 kW)</text>

            <rect x="740" y="55" width="150" height="30" rx="3" fill="var(--surface)" stroke="var(--border)" />
            <text x="750" y="72" fontSize="10" fontFamily="IBM Plex Sans" fill="var(--text-primary)">Atmospheric Flue Loss (140 kW)</text>

            <rect x="740" y="105" width="150" height="30" rx="3" fill="var(--surface)" stroke="var(--border)" />
            <text x="750" y="122" fontSize="10" fontFamily="IBM Plex Sans" fill="var(--text-primary)">Science Instruments & Lab (145 kW)</text>

            <rect x="740" y="145" width="150" height="30" rx="3" fill="var(--surface)" stroke="var(--border)" />
            <text x="750" y="162" fontSize="10" fontFamily="IBM Plex Sans" fill="var(--text-primary)">Comms, Radomes & Gateway (48 kW)</text>

            <rect x="740" y="185" width="150" height="30" rx="3" fill="var(--surface)" stroke="var(--border)" />
            <text x="750" y="202" fontSize="10" fontFamily="IBM Plex Sans" fill="var(--text-primary)">Living Habitat Life Support (120 kW)</text>

            {/* Connections to End Users */}
            <path d="M 630 35 L 740 30" fill="none" stroke="#A3312B" strokeWidth="8" />
            <path d="M 630 45 C 680 45, 680 70, 740 70" fill="none" stroke="#8A94A6" strokeWidth="4" strokeDasharray="3 2" />
            <path d="M 630 135 C 680 135, 680 120, 740 120" fill="none" stroke="#2C5F8A" strokeWidth="4" />
            <path d="M 630 140 C 680 140, 680 160, 740 160" fill="none" stroke="#2C5F8A" strokeWidth="3" />
            <path d="M 630 145 C 680 145, 680 200, 740 200" fill="none" stroke="#2C5F8A" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* B. MASS BALANCE LEDGER */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          B. Station Mass Balance Ledger (Consumables & Metabolic In/Out Flows)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
          {/* Fuel Balance */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-1">
            <div className="font-mono text-[11px] uppercase text-[var(--warning)] font-semibold flex items-center justify-between">
              <span>Fuel Mass Balance</span>
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="text-[16px] font-mono font-bold text-[var(--text-primary)]">12,400 L Stored</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Daily Burn: -436 L/day</div>
            <div className="text-[11px] text-[var(--text-muted)]">Transfer from Bladder: +0 L</div>
          </div>

          {/* Water Balance */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-1">
            <div className="font-mono text-[11px] uppercase text-[var(--success)] font-semibold flex items-center justify-between">
              <span>Water Mass Balance</span>
              <Droplet className="w-3.5 h-3.5" />
            </div>
            <div className="text-[16px] font-mono font-bold text-[var(--text-primary)]">8,400 L Stored</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Production (RO/Melt): +3,200 L</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Crew Consumption: -3,000 L</div>
          </div>

          {/* Food Balance */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-1">
            <div className="font-mono text-[11px] uppercase text-[var(--accent)] font-semibold flex items-center justify-between">
              <span>Food Provisions</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-[16px] font-mono font-bold text-[var(--text-primary)]">68.0 Tonnes</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Daily Ration Use: -62 kg/day</div>
            <div className="text-[11px] text-[var(--text-muted)]">Caloric Reserve: 240 Days</div>
          </div>

          {/* CO2 Balance */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-1">
            <div className="font-mono text-[11px] uppercase text-[var(--caution)] font-semibold flex items-center justify-between">
              <span>Atmospheric CO2</span>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="text-[16px] font-mono font-bold text-[var(--text-primary)]">680 ppm Habitat</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Scrubbing Rate: 450 m³/h</div>
            <div className="text-[11px] text-[var(--text-muted)]">Threshold: &lt;1,200 ppm safe</div>
          </div>
        </div>
      </div>

      {/* C. THERMAL NETWORK NODE GRAPH & D. FEEDBACK LOOPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Node Graph (7 cols) */}
        <div className="lg:col-span-7 card-polar p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                C. Thermal Network Node Graph
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Click any thermal node to inspect differential governing equations.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {thermalNodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-3 rounded border cursor-pointer transition-colors text-[12px] flex items-center justify-between ${
                  selectedNode === node.id
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] font-medium'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <div>
                  <div className="text-[13px] text-[var(--text-primary)]">{node.name}</div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">{node.role} · Flow: {node.flow}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[15px] font-bold text-[var(--critical)]">{node.temp.toFixed(1)} °C</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Core Temp</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Loops (5 cols) */}
        <div className="lg:col-span-5 card-polar p-4 space-y-3">
          <div className="border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              D. Key Coupled Feedback Loops
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Self-reinforcing (+) and stabilizing (-) physical dynamics.
            </p>
          </div>

          <div className="space-y-2.5 text-[12px]">
            <div className="p-2.5 bg-[var(--surface-subtle)] border-l-[3px] border-l-[var(--warning)] border border-[var(--border)] rounded-r space-y-1">
              <div className="font-semibold text-[var(--text-primary)] flex justify-between">
                <span>Fuel Viscosity Feedback (+)</span>
                <span className="font-mono text-[10px] text-[var(--warning)]">LOOP GAIN: +1.18</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                Fuel temp drops → Viscosity rises → Pumping friction rises → Generator load increases → Fuel burn accelerates.
              </p>
            </div>

            <div className="p-2.5 bg-[var(--surface-subtle)] border-l-[3px] border-l-[var(--success)] border border-[var(--border)] rounded-r space-y-1">
              <div className="font-semibold text-[var(--text-primary)] flex justify-between">
                <span>Snow Melt Heat Recovery (-)</span>
                <span className="font-mono text-[10px] text-[var(--success)]">LOOP GAIN: -0.74</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                Generator load increases → Exhaust heat rises → Waste heat captured melts snow faster → Cools jacket back to nominal.
              </p>
            </div>

            <div className="p-2.5 bg-[var(--surface-subtle)] border-l-[3px] border-l-[var(--critical)] border border-[var(--border)] rounded-r space-y-1">
              <div className="font-semibold text-[var(--text-primary)] flex justify-between">
                <span>Wind Infiltration Decay (+)</span>
                <span className="font-mono text-[10px] text-[var(--critical)]">LOOP GAIN: +1.42</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                Wind speed rises → Infiltration multiplies air exchange → Indoor temp drops → Heating demand exceeds bus capacity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
