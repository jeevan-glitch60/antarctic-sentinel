import React, { useState } from 'react';
import { useStation } from '../../context/StationContext';
import { StationId, UserRole } from '../../types';
import { 
  ShieldAlert, 
  Sun, 
  Moon, 
  ChevronDown, 
  User, 
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { 
    station, 
    setStation, 
    theme, 
    toggleTheme, 
    activeRole, 
    setActiveRole, 
    currentTimeString,
    alerts,
    sessionChip
  } = useStation();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const activeCriticalAlerts = alerts.filter(
    a => a.stationId === station && a.severity === 'Critical' && a.status === 'Active'
  ).length;

  const roles: UserRole[] = [
    'Station Commander',
    'Chief Engineer',
    'Remote Operator',
    'Science Lead'
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-col w-full bg-[var(--surface)] border-b border-[var(--border)] select-none">
      {/* Persistent Demonstrator Top Disclaimer Strip */}
      <div className="w-full bg-[var(--surface-subtle)] border-b border-[var(--border)] px-4 py-1 text-center text-[11px] font-mono text-[var(--text-muted)] tracking-wider flex items-center justify-between">
        <span className="hidden sm:inline">NCPOR SIMULATION SUITE · EXPERIMENTAL ENVIRONMENT</span>
        <span className="font-semibold text-[var(--text-secondary)]">
          DEMONSTRATOR MODE — SIMULATED DATA — NOT CONNECTED TO LIVE STATION SYSTEMS.
        </span>
        <span className="hidden sm:inline">SYS-SPEC: ISO-POLAR-2026</span>
      </div>

      {/* Main Persistent Chrome Bar */}
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Logo & Identity */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Custom Polar Mountain / Beacon SVG */}
            <div className="w-7 h-7 rounded border border-[var(--border)] bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2L2 20h20L12 2z" />
                <path d="M12 2l-4 8 4 3 4-3-4-8z" fill="currentColor" fillOpacity="0.2" />
                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
                ANTARCTIC SENTINEL
              </div>
              <div className="text-[11px] text-[var(--text-muted)] leading-tight hidden md:block">
                Maitri & Bharati · Remote Monitoring · Smarter Decisions · Safer Operations
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Station Selector as Plain Text Tabs (not pills) */}
        <div className="flex items-center space-x-6 h-full">
          <button
            onClick={() => setStation('MAITRI')}
            className={`h-full text-[13px] font-semibold tracking-wider transition-colors relative flex items-center gap-1.5 ${
              station === 'MAITRI'
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            MAITRI
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
              MTR-01
            </span>
            {station === 'MAITRI' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
            )}
          </button>

          <button
            onClick={() => setStation('BHARATI')}
            className={`h-full text-[13px] font-semibold tracking-wider transition-colors relative flex items-center gap-1.5 ${
              station === 'BHARATI'
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            BHARATI
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
              BHR-01
            </span>
            {station === 'BHARATI' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
            )}
          </button>
        </div>

        {/* Right: Telemetry Health, Time, Role Selector, Demonstrator Chip, Theme */}
        <div className="flex items-center gap-3">
          {/* Critical Alert Quick Indicator */}
          {activeCriticalAlerts > 0 && (
            <Link
              to="/alerts"
              className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--critical)] bg-[var(--critical-soft)] text-[var(--critical)] text-[11px] font-mono"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{activeCriticalAlerts} CRITICAL</span>
            </Link>
          )}

          {/* Static Green Status Dot (no pulsing) */}
          <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] font-mono">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] inline-block" />
            <span>System online</span>
          </div>

          {/* Simulation Session Chip */}
          <Link
            to="/simulation-lab"
            className="hidden 2xl:flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            title="Open Simulation Lab"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>{sessionChip}</span>
          </Link>

          {/* Time with Timezone */}
          <div className="hidden xl:block font-mono text-[12px] text-[var(--text-secondary)] px-2 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
            {currentTimeString || '28 Sep 2026 · 14:32:00 UTC'}
          </div>

          {/* Role-Based Access Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--border)] px-2 py-1 rounded transition-colors"
              title="Switch user operational role"
            >
              <div className="w-4 h-4 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-[10px] font-semibold">
                {activeRole.charAt(0)}
              </div>
              <span className="hidden md:inline font-medium text-[var(--text-primary)]">{activeRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-[var(--surface)] border border-[var(--border)] rounded shadow-sm py-1 z-50 text-[12px]">
                <div className="px-3 py-1.5 text-[11px] uppercase font-mono tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                  Switch Active Role
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setActiveRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--accent-soft)] transition-colors ${
                      activeRole === r ? 'font-semibold text-[var(--accent)] bg-[var(--accent-soft)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{r}</span>
                    {activeRole === r && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demonstrator Mode Outlined Badge */}
          <div className="hidden sm:block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-[var(--border)] rounded text-[var(--text-muted)] bg-[var(--surface-subtle)]">
            DEMONSTRATOR MODE · SIMULATED DATA
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle display theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
