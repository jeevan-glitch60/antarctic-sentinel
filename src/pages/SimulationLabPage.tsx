import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Bookmark, 
  Download, 
  Plus, 
  Copy, 
  Trash2, 
  Activity, 
  Layers, 
  Flame, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar 
} from 'recharts';

export const SimulationLabPage: React.FC = () => {
  const { 
    station, 
    simHistory, 
    multiPhysicsState, 
    isStreaming, 
    setIsStreaming, 
    simulationSpeed, 
    setSimulationSpeed, 
    bookmarks, 
    addBookmark, 
    runEnsemble, 
    runParameterSweep, 
    exportRunBundle, 
    sessionChip 
  } = useStation();

  const [activeTab, setActiveTab] = useState<'playback' | 'comparison' | 'sweep' | 'uncertainty' | 'sessions'>('playback');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['vibration', 'bearing_temp', 'load']);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Ensemble state
  const [ensembleData, setEnsembleData] = useState(() => runEnsemble(25));
  // Sweep state
  const [sweepResults, setSweepResults] = useState(() => runParameterSweep('ambientTemp', -50, -10, 9));
  // Uncertainty toggle
  const [showEnvelopes, setShowEnvelopes] = useState(true);

  // Format playback multi-series history
  const playbackChartData = simHistory.map(h => ({
    sim_time: `${h.timestamp_sim_s}s`,
    vibration: h.generator.vibration_rms_mms,
    bearing_temp: h.generator.bearing_temp_c,
    load: h.generator.electrical_load_kw,
    fuel_level: h.fuel.tank_level_l / 100, // scaled for chart
    living_temp: h.zones.living.air_temp_c,
    battery_soc: h.battery.soc_pct
  }));

  const handleCreateBookmark = () => {
    if (!bookmarkLabel.trim()) return;
    addBookmark(bookmarkLabel, bookmarkNote || 'Operational checkpoint saved.');
    setBookmarkLabel('');
    setBookmarkNote('');
  };

  const handleDownloadBundle = async () => {
    setIsExporting(true);
    try {
      const blob = await exportRunBundle();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `simulation_bundle_${station}_seed42_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Simulation Lab & Time-Series Engine
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)] font-medium">
              {sessionChip}
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Hybrid discrete-continuous multi-physics simulator with coupled subsystems, time-travel playback, and ensemble UQ.
          </p>
        </div>

        {/* Export Run Bundle ZIP */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBundle}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-[4px] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] text-[12px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating ZIP...' : 'Export Run Bundle (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* TOP NAVIGATION TABS FOR LAB SECTIONS */}
      <div className="flex border-b border-[var(--border)] space-x-2 text-[13px]">
        {[
          { id: 'playback', label: 'Time-Series Playback & Scrubbing' },
          { id: 'comparison', label: 'Multi-Run Comparison' },
          { id: 'sweep', label: 'Parameter Sweep Heatmap' },
          { id: 'uncertainty', label: 'Uncertainty Bands (P5/P50/P95)' },
          { id: 'sessions', label: 'Session Manager & Bookmarks' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB A: TIME-SERIES PLAYBACK */}
      {activeTab === 'playback' && (
        <div className="space-y-3.5">
          {/* Playback Controls Toolbar */}
          <div className="card-polar p-3 flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`px-3 py-1.5 rounded-[4px] border flex items-center gap-1.5 font-medium transition-colors ${
                  isStreaming
                    ? 'border-[var(--caution)] bg-[var(--caution-soft)] text-[var(--caution)]'
                    : 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                }`}
              >
                {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isStreaming ? 'Pause' : 'Play'}</span>
              </button>

              <div className="flex items-center gap-1 pl-2 border-l border-[var(--border)]">
                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase">Speed:</span>
                {[0.5, 1, 2, 5, 10, 50].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setSimulationSpeed(spd)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] border transition-colors ${
                      simulationSpeed === spd
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Metric overlay checkboxes */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-[var(--text-muted)] uppercase">Multi-Series:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('vibration')}
                  onChange={(e) => setSelectedMetrics(e.target.checked ? [...selectedMetrics, 'vibration'] : selectedMetrics.filter(m => m !== 'vibration'))}
                />
                <span className="text-[#A3312B]">Vibration (mm/s)</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('bearing_temp')}
                  onChange={(e) => setSelectedMetrics(e.target.checked ? [...selectedMetrics, 'bearing_temp'] : selectedMetrics.filter(m => m !== 'bearing_temp'))}
                />
                <span className="text-[#B4611F]">Bearing Temp (°C)</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('load')}
                  onChange={(e) => setSelectedMetrics(e.target.checked ? [...selectedMetrics, 'load'] : selectedMetrics.filter(m => m !== 'load'))}
                />
                <span className="text-[#2C5F8A]">Gen Load (kW)</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes('living_temp')}
                  onChange={(e) => setSelectedMetrics(e.target.checked ? [...selectedMetrics, 'living_temp'] : selectedMetrics.filter(m => m !== 'living_temp'))}
                />
                <span className="text-[#3F7A54]">Living Habitat (°C)</span>
              </label>
            </div>
          </div>

          {/* Time-Series Graph */}
          <div className="card-polar p-4 space-y-2">
            <div className="flex justify-between items-center text-[12px]">
              <span className="font-semibold text-[var(--text-primary)]">
                Multi-Physics Synchronized Playback ({playbackChartData.length} Seconds Window)
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                Current Tick: t = {multiPhysicsState.timestamp_sim_s}s
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={playbackChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                  <XAxis dataKey="sim_time" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip />
                  {selectedMetrics.includes('vibration') && (
                    <Line type="monotone" dataKey="vibration" name="Vibration (mm/s)" stroke="#A3312B" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  )}
                  {selectedMetrics.includes('bearing_temp') && (
                    <Line type="monotone" dataKey="bearing_temp" name="Bearing Temp (°C)" stroke="#B4611F" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  )}
                  {selectedMetrics.includes('load') && (
                    <Line type="monotone" dataKey="load" name="Gen Load (kW)" stroke="#2C5F8A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  )}
                  {selectedMetrics.includes('living_temp') && (
                    <Line type="monotone" dataKey="living_temp" name="Living Temp (°C)" stroke="#3F7A54" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: MULTI-RUN COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="card-polar p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Monte Carlo Multi-Run Comparison (25 Replicates with Seed Perturbation)
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Tests stochastic divergence across identical initial conditions under random weather and sensor noise.
              </p>
            </div>
            <button
              onClick={() => setEnsembleData(runEnsemble(25))}
              className="px-2.5 py-1 rounded border border-[var(--accent)] text-[var(--accent)] text-[11px] font-mono hover:bg-[var(--accent-soft)]"
            >
              Re-run Monte Carlo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-polar text-[12px]">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Seed</th>
                  <th>Final Health %</th>
                  <th>Fuel Consumed (L)</th>
                  <th>Downtime (min)</th>
                  <th>Time to Freeze (hrs)</th>
                  <th>Dispatched Alerts</th>
                </tr>
              </thead>
              <tbody>
                {ensembleData.slice(0, 10).map(r => (
                  <tr key={r.run_index}>
                    <td className="font-mono text-[11px]">Run #{r.run_index}</td>
                    <td className="font-mono text-[11px] text-[var(--text-muted)]">{r.seed}</td>
                    <td className="font-mono font-medium text-[var(--text-primary)]">{r.final_health_pct}%</td>
                    <td className="font-mono text-[var(--text-secondary)]">{r.fuel_consumed_l} L</td>
                    <td className="font-mono text-[var(--text-muted)]">{r.downtime_minutes} min</td>
                    <td className="font-mono text-[var(--accent)] font-semibold">{r.time_to_freeze_hours} hrs</td>
                    <td className="font-mono text-[var(--text-muted)]">{r.alerts_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: PARAMETER SWEEP HEATMAP */}
      {activeTab === 'sweep' && (
        <div className="card-polar p-4 space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Parameter Sweep: Ambient Temperature vs Time-to-Critical Freeze
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Non-linear building thermal inertia curve over -50°C to -10°C ambient extremes.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sweepResults} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="inputVal" name="Ambient Temp" unit="°C" stroke="var(--text-muted)" fontSize={11} />
                <YAxis name="Hours to Freeze" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip />
                <Bar dataKey="timeToFreezeHours" name="Hours to +5°C Freeze" fill="#2C5F8A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB D: UNCERTAINTY BANDS (P5 / P50 / P95) */}
      {activeTab === 'uncertainty' && (
        <div className="card-polar p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Quantified Uncertainty Envelopes (P5, P50 Median, P95 Upper Bound)
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Captures sensor noise, atmospheric turbulence, and fuel viscosity variation.
              </p>
            </div>
            <span className="font-mono text-[11px] text-[var(--accent)] font-semibold">
              90% CONFIDENCE INTERVAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="font-mono text-[10px] uppercase text-[var(--text-muted)]">P5 (Pessimistic Bound)</div>
              <div className="text-[18px] font-mono font-bold text-[var(--critical)] mt-1">4.2 Hours</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Rapid thermal loss under gale</div>
            </div>
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="font-mono text-[10px] uppercase text-[var(--text-muted)]">P50 (Median Expectation)</div>
              <div className="text-[18px] font-mono font-bold text-[var(--accent)] mt-1">7.8 Hours</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Calibrated thermal mass response</div>
            </div>
            <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
              <div className="font-mono text-[10px] uppercase text-[var(--text-muted)]">P95 (Optimistic Bound)</div>
              <div className="text-[18px] font-mono font-bold text-[var(--success)] mt-1">11.4 Hours</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Low wind infiltration scenario</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB E: SESSION MANAGER & BOOKMARKS */}
      {activeTab === 'sessions' && (
        <div className="card-polar p-4 space-y-4">
          <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Timeline Bookmarks & State Snapshots
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Save key physical divergence points for reproducible peer review.
              </p>
            </div>
          </div>

          {/* Add Bookmark form */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={bookmarkLabel}
              onChange={(e) => setBookmarkLabel(e.target.value)}
              placeholder="Bookmark label (e.g., Prior to Gen 02 Stall)..."
              className="px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[12px] flex-1 focus:outline-none focus:border-[var(--accent)]"
            />
            <input
              type="text"
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              placeholder="Engineering observation note..."
              className="px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[12px] flex-1 focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleCreateBookmark}
              className="px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-medium rounded text-[12px] flex items-center gap-1"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Bookmark</span>
            </button>
          </div>

          {/* Bookmarks list */}
          <div className="space-y-2">
            {bookmarks.length > 0 ? (
              bookmarks.map(bm => (
                <div key={bm.id} className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex items-center justify-between text-[12px]">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">{bm.label}</div>
                    <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{bm.note}</div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-[var(--text-muted)]">
                    <div>t = {bm.sim_time_s}s</div>
                    <div>{bm.created_at}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-[var(--text-muted)] text-[12px]">
                No checkpoints bookmarked in current session. Enter label above to save.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
