import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Network, 
  ArrowRightLeft, 
  Layers, 
  Fuel, 
  Wrench, 
  Users, 
  Satellite, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  Plane,
  Play,
  Clock,
  Sparkles
} from 'lucide-react';

interface TransferSimulation {
  id: string;
  item: string;
  sourceStation: string;
  destStation: string;
  distanceKm: number;
  mode: 'Ski-Aircraft (BT-67)' | 'PistenBully Traverse' | 'Summer Ship Vessel';
  windowDays: number;
  fuelCostLiters: number;
  donorImpact: string;
  recipientBenefit: string;
  status: 'recommended' | 'evaluated' | 'in_progress';
}

export const MultiStationCoordinationPage: React.FC = () => {
  const { station, stationData, multiPhysicsState } = useStation();

  const [activeTransferTab, setActiveTransferTab] = useState<'transfers' | 'spares' | 'crew' | 'satellite'>('transfers');
  const [simulatedTransfers, setSimulatedTransfers] = useState<TransferSimulation[]>([
    {
      id: 'TR-01',
      item: 'Grundfos Magna3 40-120F Glycol Circulation Pump',
      sourceStation: 'Maitri',
      destStation: 'Bharati',
      distanceKm: 3100,
      mode: 'Ski-Aircraft (BT-67)',
      windowDays: 4,
      fuelCostLiters: 1450,
      donorImpact: 'Maitri spare buffer drops from 2 units to 1 unit (Acceptable risk)',
      recipientBenefit: 'Prevents 14 days of secondary heat exchanger bypass at Bharati',
      status: 'recommended'
    },
    {
      id: 'TR-02',
      item: '12x Cummins KTA50 Fuel Injector Nozzles',
      sourceStation: 'Bharati',
      destStation: 'Maitri',
      distanceKm: 3100,
      mode: 'Ski-Aircraft (BT-67)',
      windowDays: 7,
      fuelCostLiters: 1450,
      donorImpact: 'Bharati retains 18 injectors (90 days buffer)',
      recipientBenefit: 'Eliminates DG1 cylinder #3 exhaust gas temperature imbalance',
      status: 'evaluated'
    },
    {
      id: 'TR-03',
      item: '5,000 L Low-Pour-Point Polar Diesel (Grade ATF-50)',
      sourceStation: 'Maitri Depot',
      destStation: 'Novo Airfield Depot',
      distanceKm: 5,
      mode: 'PistenBully Traverse',
      windowDays: 1,
      fuelCostLiters: 80,
      donorImpact: 'Negligible (-0.8% of tank capacity)',
      recipientBenefit: 'Secures joint international flight operations',
      status: 'in_progress'
    }
  ]);

  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const handleSimulateTransfer = (id: string) => {
    const target = simulatedTransfers.find(t => t.id === id);
    if (!target) return;
    setLastActionMessage(`Transfer simulation dispatched: ${target.item} via ${target.mode}. Expected arrival in ${target.windowDays} days. Logged to NCPOR Coordination Registry.`);
    setTimeout(() => setLastActionMessage(null), 8000);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Multi-Station Coordination & Joint Logistics
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Resource sharing between Maitri (Schirmacher Oasis) and Bharati (Larsemann Hills), joint spare parts inventory, and transfer simulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            AIR DISTANCE: 3,100 KM · DROMLAN INTER-STATION CORRIDOR
          </span>
        </div>
      </div>

      {lastActionMessage && (
        <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-[12px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* C. SIDE-BY-SIDE STATION COMPARISON */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              C. Side-by-Side Station Operational Comparison
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Direct metric alignment across India's two permanent Antarctic research bases.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            SYNCHRONIZED: 2026-09-28 21:00 UTC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Maitri Station Card */}
          <div className={`p-4 rounded border ${station === 'MAITRI' ? 'border-[var(--primary)] bg-[var(--surface-subtle)]' : 'border-[var(--border)] bg-[var(--surface)]'} space-y-3`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">EST. 1989 · INLAND OASIS</span>
                <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Maitri Research Station</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">70°46′S, 11°44′E · Schirmacher Oasis</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE · 25 CREW
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[var(--surface)] p-2.5 rounded border border-[var(--border)]">
              <div>Overall Health: <span className="text-emerald-600 font-semibold">92.4%</span></div>
              <div>Fuel Reserve: <span className="text-[var(--text-primary)] font-semibold">58,400 L (78d)</span></div>
              <div>Active DG: <span className="text-[var(--text-primary)]">DG-1 (62 kW)</span></div>
              <div>Water Storage: <span className="text-[var(--text-primary)]">14,200 L</span></div>
              <div>Ambient Temp: <span className="text-[var(--text-primary)]">-22.4°C</span></div>
              <div>Wind Speed: <span className="text-[var(--text-primary)]">14.2 m/s</span></div>
              <div>Sat Link SNR: <span className="text-[var(--text-primary)]">12.4 dB</span></div>
              <div>Active Incidents: <span className="text-amber-600 font-semibold">1 Advisory</span></div>
            </div>

            <div className="text-[11px] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Mission Role:</span> Long-term meteorological baseline, geomagnetism, environmental monitoring, Lake Priyadarshini limnology.
            </div>
          </div>

          {/* Bharati Station Card */}
          <div className={`p-4 rounded border ${station === 'BHARATI' ? 'border-[var(--primary)] bg-[var(--surface-subtle)]' : 'border-[var(--border)] bg-[var(--surface)]'} space-y-3`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">EST. 2012 · COASTAL PROMONTORY</span>
                <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Bharati Research Station</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">69°24′S, 76°11′E · Larsemann Hills</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE · 23 CREW
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[var(--surface)] p-2.5 rounded border border-[var(--border)]">
              <div>Overall Health: <span className="text-emerald-600 font-semibold">96.8%</span></div>
              <div>Fuel Reserve: <span className="text-[var(--text-primary)] font-semibold">82,100 L (114d)</span></div>
              <div>Active DG: <span className="text-[var(--text-primary)]">DG-2 (74 kW)</span></div>
              <div>Water Storage: <span className="text-[var(--text-primary)]">18,600 L (RO active)</span></div>
              <div>Ambient Temp: <span className="text-[var(--text-primary)]">-16.8°C</span></div>
              <div>Wind Speed: <span className="text-[var(--text-primary)]">9.8 m/s</span></div>
              <div>Sat Link SNR: <span className="text-[var(--text-primary)]">14.8 dB</span></div>
              <div>Active Incidents: <span className="text-emerald-600 font-semibold">0 Active</span></div>
            </div>

            <div className="text-[11px] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Mission Role:</span> Oceanography, coastal ecology, glaciology, high-speed remote sensing satellite data reception (ISRO ground station).
            </div>
          </div>
        </div>
      </div>

      {/* A. SHARED RESOURCES & B. CROSS-STATION TRANSFERS */}
      <div className="card-polar p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              A & B. Cross-Station Transfers & Resource Sharing Protocols
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Inter-station aircraft shuttles, critical spare parts re-balancing, and mutual assistance options.
            </p>
          </div>

          <div className="inline-flex rounded border border-[var(--border)] p-0.5 bg-[var(--surface-subtle)] text-[11px]">
            {(['transfers', 'spares', 'crew', 'satellite'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTransferTab(tab)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  activeTransferTab === tab 
                    ? 'bg-[var(--surface)] text-[var(--primary)] font-medium shadow-xs' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab === 'transfers' ? 'Active Transfer Scenarios' : tab === 'spares' ? 'Shared Spares Pool' : tab === 'crew' ? 'Specialist Rotation' : 'Comms Bandwidth Pool'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Transfers */}
        {activeTransferTab === 'transfers' && (
          <div className="space-y-3">
            {simulatedTransfers.map(tr => (
              <div key={tr.id} className="p-3.5 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[var(--primary)]">{tr.id}</span>
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">{tr.item}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      tr.status === 'recommended' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : tr.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {tr.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleSimulateTransfer(tr.id)}
                      className="px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-[11px] font-medium text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 text-emerald-600" />
                      Simulate Transfer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] font-mono bg-[var(--surface)] p-2.5 rounded border border-[var(--border)]">
                  <div>Route: <span className="text-[var(--text-primary)]">{tr.sourceStation} → {tr.destStation}</span></div>
                  <div>Transport: <span className="text-[var(--text-primary)]">{tr.mode}</span></div>
                  <div>Flight Window: <span className="text-[var(--text-primary)]">{tr.windowDays} Days</span></div>
                  <div>Fuel Burn: <span className="text-amber-600">{tr.fuelCostLiters} L ATF</span></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Source Impact ({tr.sourceStation}):</span> {tr.donorImpact}
                  </div>
                  <div className="text-emerald-700">
                    <span className="font-medium text-[var(--text-primary)]">Recipient Benefit ({tr.destStation}):</span> {tr.recipientBenefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Shared Spares */}
        {activeTransferTab === 'spares' && (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-left bg-[var(--surface-subtle)]">
                  <th className="py-2 px-2.5">Critical Spare Part</th>
                  <th className="py-2 px-2.5">Maitri Stock</th>
                  <th className="py-2 px-2.5">Bharati Stock</th>
                  <th className="py-2 px-2.5">Combined Pool</th>
                  <th className="py-2 px-2.5">Lead Time Between Stations</th>
                  <th className="py-2 px-2.5">Strategic Redundancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-2 px-2.5 text-[var(--text-primary)] font-medium">Cummins KTA50 Fuel Injectors</td>
                  <td className="py-2 px-2.5 text-amber-600 font-semibold">2 units (Critical)</td>
                  <td className="py-2 px-2.5 text-emerald-600 font-semibold">18 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">20 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">4-6 Days (Basler BT-67)</td>
                  <td className="py-2 px-2.5 text-emerald-600">High (Transfer viable)</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[var(--text-primary)] font-medium">Grundfos Magna3 Glycol Pump</td>
                  <td className="py-2 px-2.5 text-emerald-600 font-semibold">2 units</td>
                  <td className="py-2 px-2.5 text-rose-600 font-semibold">0 units (Depleted)</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">2 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">4-6 Days (Basler BT-67)</td>
                  <td className="py-2 px-2.5 text-amber-600">Moderate</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[var(--text-primary)] font-medium">Schneider MasterPact 400A Breaker</td>
                  <td className="py-2 px-2.5 text-emerald-600 font-semibold">1 unit</td>
                  <td className="py-2 px-2.5 text-emerald-600 font-semibold">2 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">3 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">7 Days</td>
                  <td className="py-2 px-2.5 text-emerald-600">High</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[var(--text-primary)] font-medium">Seawater RO Desalination Membrane</td>
                  <td className="py-2 px-2.5 text-[var(--text-muted)]">N/A (Lake Water)</td>
                  <td className="py-2 px-2.5 text-emerald-600 font-semibold">6 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-primary)]">6 units</td>
                  <td className="py-2 px-2.5 text-[var(--text-secondary)]">Not applicable to Maitri</td>
                  <td className="py-2 px-2.5 text-emerald-600">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Crew Specialist Rotation */}
        {activeTransferTab === 'crew' && (
          <div className="space-y-3 text-[12px]">
            <p className="text-[var(--text-secondary)]">
              Shared medical, electrical engineering, and diesel mechanics roster available for emergency airlift:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-1">
                <span className="font-semibold text-[var(--text-primary)]">Dr. R. K. Nair (Surgeon)</span>
                <div className="text-[var(--text-secondary)]">Current: Maitri Medical Bay</div>
                <div className="text-emerald-600">Deployable: Yes (Emergency trauma)</div>
              </div>
              <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-1">
                <span className="font-semibold text-[var(--text-primary)]">Er. K. Sharma (PLC / Controls)</span>
                <div className="text-[var(--text-secondary)]">Current: Bharati SCADA Hub</div>
                <div className="text-emerald-600">Deployable: Remote diagnostics via Satcom</div>
              </div>
              <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-subtle)] space-y-1">
                <span className="font-semibold text-[var(--text-primary)]">Er. T. Deshmukh (Heavy Diesel)</span>
                <div className="text-[var(--text-secondary)]">Current: Maitri Powerhouse</div>
                <div className="text-amber-600">Deployable: In Austral Summer window only</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Satellite Bandwidth Pool */}
        {activeTransferTab === 'satellite' && (
          <div className="space-y-3 text-[12px]">
            <p className="text-[var(--text-secondary)]">
              Dynamic satellite bandwidth borrowing protocol when one station experiences severe atmospheric rain-fade or geomagnetic storm degradation:
            </p>
            <div className="p-3 rounded bg-[var(--surface-subtle)] border border-[var(--border)] font-mono text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span>Total ISRO Antarctic Transponder Quota:</span>
                <span className="font-semibold text-[var(--text-primary)]">512 kbps Dedicated</span>
              </div>
              <div className="flex justify-between">
                <span>Maitri Allocated:</span>
                <span className="text-[var(--text-primary)]">192 kbps (Burstable to 384)</span>
              </div>
              <div className="flex justify-between">
                <span>Bharati Allocated (High-Res Ground Station):</span>
                <span className="text-[var(--text-primary)]">320 kbps (Burstable to 512)</span>
              </div>
              <div className="border-t border-[var(--border)] pt-1 text-emerald-700">
                Dynamic load borrowing active: Automatic 64 kbps loan to Maitri if local buffer &gt; 75%.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
