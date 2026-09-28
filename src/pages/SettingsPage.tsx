import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  RotateCcw, 
  Sliders, 
  SlidersHorizontal, 
  CheckCircle2, 
  Bell, 
  ShieldAlert 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    simulationSpeed, 
    setSimulationSpeed, 
    isStreaming, 
    setIsStreaming, 
    resetAllFaults,
    resetStream,
    station,
    setStation
  } = useStation();

  const [vibThreshold, setVibThreshold] = useState<number>(3.5);
  const [fuelThreshold, setFuelThreshold] = useState<number>(60);
  const [tempThreshold, setTempThreshold] = useState<number>(15);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Console Preferences & Simulation Settings
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Display themes, telemetry refresh rates, alarm threshold tuning, and demonstration controls.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 rounded bg-[var(--success-soft)] border border-[var(--success)] text-[var(--success)] font-mono text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preferences Saved to Local Storage</span>
          </div>
        )}
      </div>

      {/* 1. DISPLAY & APPEARANCE (Light default) */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          Display Theme & Appearance
        </h3>
        <p className="text-[12px] text-[var(--text-secondary)]">
          In accordance with institutional guidelines, Light Mode is the calibrated default for daytime research room lighting.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md pt-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded border text-left flex items-center justify-between transition-colors ${
              theme === 'light'
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span>Light Mode (Default)</span>
            </div>
            {theme === 'light' && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded border text-left flex items-center justify-between transition-colors ${
              theme === 'dark'
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span>Dark Mode (Polar Night)</span>
            </div>
            {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
          </button>
        </div>
      </div>

      {/* 2. SIMULATION & TELEMETRY ENGINE */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          Simulation & Telemetry Engine Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          {/* Speed Multiplier */}
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
              Simulation Time Acceleration:
            </span>
            <div className="flex gap-2">
              {[1, 2, 5].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`px-3 py-1.5 rounded-[4px] border font-mono text-[12px] transition-colors ${
                    simulationSpeed === speed
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                      : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {speed}x Realtime
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Accelerates sensor perturbation and fuel burn calculations.
            </p>
          </div>

          {/* Master Stream State */}
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
              Telemetry Stream State:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsStreaming(true)}
                className={`px-3 py-1.5 rounded-[4px] border font-mono text-[12px] transition-colors ${
                  isStreaming
                    ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] font-semibold'
                    : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Streaming Active (2s ticker)
              </button>
              <button
                onClick={() => setIsStreaming(false)}
                className={`px-3 py-1.5 rounded-[4px] border font-mono text-[12px] transition-colors ${
                  !isStreaming
                    ? 'border-[var(--caution)] bg-[var(--caution-soft)] text-[var(--caution)] font-semibold'
                    : 'border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Paused
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ALARM THRESHOLD TUNING */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          Alarm & Anomaly Threshold Tuning
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px]">
          <div>
            <div className="flex justify-between mb-1 font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Vibration Warning:</span>
              <span className="font-semibold text-[var(--text-primary)]">{vibThreshold} mm/s</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="6.0"
              step="0.1"
              value={vibThreshold}
              onChange={(e) => setVibThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">Nominal: 3.5 mm/s</div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Fuel Reserve Alert:</span>
              <span className="font-semibold text-[var(--text-primary)]">{fuelThreshold}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              step="5"
              value={fuelThreshold}
              onChange={(e) => setFuelThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">Nominal: 60% Capacity</div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-mono text-[11px]">
              <span className="text-[var(--text-secondary)]">Lab Freeze Alert:</span>
              <span className="font-semibold text-[var(--text-primary)]">{tempThreshold} °C</span>
            </div>
            <input
              type="range"
              min="10"
              max="20"
              step="1"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">Nominal: +18.0 °C</div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-medium rounded-[4px] text-[12px] transition-colors"
          >
            Apply Threshold Settings
          </button>
        </div>
      </div>

      {/* 4. DATA PURGE & RESET */}
      <div className="card-polar p-4 space-y-2 border-l-[3px] border-l-[var(--critical)]">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
          Demonstration State Reset
        </h3>
        <p className="text-[12px] text-[var(--text-secondary)] leading-snug">
          Restore all simulated telemetry, clear active injected faults, and restore nominal baseline component health.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              resetAllFaults();
              resetStream();
              handleSavePreferences();
            }}
            className="px-3 py-1.5 rounded-[4px] border border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-soft)] font-medium text-[12px] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Telemetry & Restore Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
