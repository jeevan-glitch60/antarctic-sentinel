import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { UserRole } from '../types';
import { 
  Shield, 
  UserCheck, 
  Key, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Search, 
  Filter 
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const { activeRole, setActiveRole, auditLogs, stationData } = useStation();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const roles: UserRole[] = [
    'Station Commander',
    'Chief Engineer',
    'Remote Operator',
    'Science Lead'
  ];

  const permissionsMatrix = [
    { feature: 'View Telemetry & Digital Twin', cmd: true, eng: true, ops: true, sci: true },
    { feature: 'Simulate What-If Scenarios', cmd: true, eng: true, ops: true, sci: false },
    { feature: 'Acknowledge & Investigate Alerts', cmd: true, eng: true, ops: true, sci: true },
    { feature: 'Resolve Incidents & Sign-Off', cmd: true, eng: true, ops: false, sci: false },
    { feature: 'Execute SOP & Breaker Switching', cmd: true, eng: true, ops: false, sci: false },
    { feature: 'Emergency Load Shedding Override', cmd: true, eng: false, ops: false, sci: false },
    { feature: 'Inventory Spares Dispatch', cmd: true, eng: true, ops: false, sci: false },
    { feature: 'Export Raw Data (CSV/JSON)', cmd: true, eng: true, ops: true, sci: true },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesCat = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Security, Role-Based Access Control & Audit Log
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Operational role assignments, multi-tier privilege enforcement, and immutable command journal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            Security Context: Polar Command Layer 3 (RBAC)
          </div>
        </div>
      </div>

      {/* ACTIVE ROLE SWITCHER & OPERATIONAL PROFILE */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Active Operational Role Switcher
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Select your simulated station profile to test permissions across the Antarctic Sentinel platform.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[var(--accent)] font-semibold">
            CURRENT: {activeRole.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {roles.map(r => {
            const isCurrent = activeRole === r;
            return (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`p-3 rounded border text-left transition-colors flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">Profile</span>
                    {isCurrent && <UserCheck className="w-4 h-4 text-[var(--accent)]" />}
                  </div>
                  <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">{r}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
                    {r === 'Station Commander' && 'Overall command, emergency authority, and evacuation decisions.'}
                    {r === 'Chief Engineer' && 'Microgrid management, diesel generators, and hydronic loop maintenance.'}
                    {r === 'Remote Operator' && 'NCPOR headquarters oversight, satellite uplink telemetry, and simulation.'}
                    {r === 'Science Lead' && 'Research spectrometer bay, environmental observation, and laboratory load.'}
                  </p>
                </div>
                <div className={`mt-2.5 text-[11px] font-mono font-medium ${isCurrent ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                  {isCurrent ? '● Active Session' : 'Click to Assume Role'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RBAC PERMISSIONS MATRIX TABLE */}
      <div className="card-polar p-4 space-y-3">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
          Privilege & Command Authority Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-polar text-[12px]">
            <thead>
              <tr>
                <th>Operational Capability / Console Function</th>
                <th className="text-center">Station Commander</th>
                <th className="text-center">Chief Engineer</th>
                <th className="text-center">Remote Operator</th>
                <th className="text-center">Science Lead</th>
              </tr>
            </thead>
            <tbody>
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-medium text-[var(--text-primary)]">{row.feature}</td>
                  <td className="text-center">
                    {row.cmd ? <CheckCircle2 className="w-4 h-4 text-[var(--success)] inline" /> : <XCircle className="w-4 h-4 text-[var(--text-muted)]/40 inline" />}
                  </td>
                  <td className="text-center">
                    {row.eng ? <CheckCircle2 className="w-4 h-4 text-[var(--success)] inline" /> : <XCircle className="w-4 h-4 text-[var(--text-muted)]/40 inline" />}
                  </td>
                  <td className="text-center">
                    {row.ops ? <CheckCircle2 className="w-4 h-4 text-[var(--success)] inline" /> : <XCircle className="w-4 h-4 text-[var(--text-muted)]/40 inline" />}
                  </td>
                  <td className="text-center">
                    {row.sci ? <CheckCircle2 className="w-4 h-4 text-[var(--success)] inline" /> : <XCircle className="w-4 h-4 text-[var(--text-muted)]/40 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT LOG & COMMAND JOURNAL TABLE */}
      <div className="card-polar p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-2.5">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Station Command Journal & Audit Log
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Chronological ledger of user actions, alert acknowledgments, simulation triggers, and breaker events.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
              className="px-2.5 py-1 bg-[var(--surface-subtle)] border border-[var(--border)] rounded text-[12px] focus:outline-none focus:border-[var(--accent)]"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2.5 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Categories</option>
              <option value="Incident">Incident</option>
              <option value="Telemetry">Telemetry</option>
              <option value="Control">Control</option>
              <option value="Simulation">Simulation</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-polar text-[12px]">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Time (UTC/IST)</th>
                <th>Station</th>
                <th>Operator</th>
                <th>Role</th>
                <th>Category</th>
                <th>Action Taken</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="font-mono text-[11px] text-[var(--text-muted)]">{log.id}</td>
                  <td className="font-mono text-[11px] text-[var(--text-secondary)]">{log.timestamp}</td>
                  <td className="font-mono text-[11px] text-[var(--text-primary)]">{log.stationId}</td>
                  <td className="font-medium text-[var(--text-primary)]">{log.actor}</td>
                  <td className="font-mono text-[11px] text-[var(--text-muted)]">{log.role}</td>
                  <td>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">
                      {log.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="font-medium text-[var(--text-primary)]">{log.action}</td>
                  <td className="text-[var(--text-secondary)] text-[11px] leading-snug">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEPTH SECTIONS: KEY ROTATION, CERTIFICATE EXPIRY & DATA CLASSIFICATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Key Rotation View */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Cryptographic Key Rotation</h4>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">ROTATION NOMINAL</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Uplink Payload Key:</span>
              <span className="text-[var(--text-primary)]">AES-256-GCM (Active)</span>
            </div>
            <div className="flex justify-between">
              <span>Last Rotated:</span>
              <span className="text-[var(--text-secondary)]">2026-09-01 (27d ago)</span>
            </div>
            <div className="flex justify-between">
              <span>Next Due:</span>
              <span className="text-emerald-700 font-semibold">In 33 Days</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>HMAC Integrity Key:</span>
              <span className="text-[var(--text-primary)]">SHA-256 Synced</span>
            </div>
          </div>
        </div>

        {/* Certificate Expiry Countdown */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">X.509 Certificate Expiry</h4>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold">VALID</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span>Station Gateway mTLS:</span>
              <span className="text-[var(--text-primary)]">Expires in 184 Days</span>
            </div>
            <div className="flex justify-between">
              <span>GSAT-7A Uplink Token:</span>
              <span className="text-amber-700 font-semibold">Expires in 42 Days</span>
            </div>
            <div className="flex justify-between">
              <span>CA Root Anchor:</span>
              <span className="text-[var(--text-secondary)]">NIC / NCPOR Polar PKI</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
              <span>Revocation Status:</span>
              <span className="text-emerald-700">OCSP Stapled (OK)</span>
            </div>
          </div>
        </div>

        {/* Data Classification Labels */}
        <div className="card-polar p-4 space-y-2.5">
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-1.5">
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Data Governance &amp; Labels</h4>
            <span className="font-mono text-[10px] text-[var(--primary)] font-bold">NCPOR POLICY</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="p-1.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] flex justify-between font-mono">
              <span className="font-semibold text-emerald-700">PUBLIC:</span>
              <span>Surface Met, Seismograph Waveforms</span>
            </div>
            <div className="p-1.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] flex justify-between font-mono">
              <span className="font-semibold text-blue-700">RESTRICTED:</span>
              <span>Station Power Telemetry, Fuel Reserves</span>
            </div>
            <div className="p-1.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] flex justify-between font-mono">
              <span className="font-semibold text-rose-700">CONFIDENTIAL:</span>
              <span>Personnel Medical Bay, Satellite Keys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
