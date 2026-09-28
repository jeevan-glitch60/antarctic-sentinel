import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { AlertIncident, SeverityLevel } from '../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Filter, 
  Plus, 
  Activity, 
  UserCheck 
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { 
    station, 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    investigateAlert, 
    simulateFault,
    activeRole 
  } = useStation();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [investigatingId, setInvestigatingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    if (stationFilter !== 'all' && alert.stationId !== stationFilter) return false;
    return true;
  });

  const handleSaveNotes = (id: string) => {
    if (!noteText.trim()) return;
    investigateAlert(id, noteText);
    setInvestigatingId(null);
    setNoteText('');
  };

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Page Title & Inject Anomaly Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Active Alerts & Incidents
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Operational triage, multi-tier impact analysis, and incident workflow logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateFault()}
            className="px-3 py-1.5 rounded-[4px] border border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-soft)] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate anomaly / fault</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS TOOLBAR */}
      <div className="card-polar p-2.5 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Station:</span>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">Both Stations</option>
              <option value="MAITRI">Maitri (MTR-01)</option>
              <option value="BHARATI">Bharati (BHR-01)</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 pl-2 border-l border-[var(--border)]">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Caution">Caution</option>
              <option value="Info">Info</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 pl-2 border-l border-[var(--border)]">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* View Mode: Flat vs Root Cause Cluster */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Displaying {filteredAlerts.length} of {alerts.length} Incidents
          </span>
        </div>
      </div>

      {/* CLUSTERING & ROOT CAUSE SUMMARY BANNER */}
      <div className="card-polar p-3 bg-[var(--surface-subtle)] border-l-[3px] border-l-[var(--primary)] flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-[11px] font-mono">
        <div>
          <span className="font-semibold text-[var(--text-primary)]">Root-Cause Cascade Tree: </span>
          <span className="text-[var(--text-secondary)]">2 Correlated Clusters Identified (Cluster #1: Power Generation &amp; Thermal Loop · Cluster #2: RF Link)</span>
        </div>
        <div className="text-[var(--primary)] font-medium">
          Deduplication Ratio: 68%
        </div>
      </div>

      {/* INCIDENTS LIST */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="card-polar p-8 text-center text-[var(--text-muted)]">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[var(--success)]" />
            <div className="text-[14px] font-medium text-[var(--text-primary)]">No Active Alerts In Current View</div>
            <div className="text-[12px] mt-1">All telemetry sensors and auxiliary subsystems reporting within normal operating envelopes.</div>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'Critical';
            const isWarning = alert.severity === 'Warning';

            const borderClass = isCritical
              ? 'border-l-[3px] border-l-[var(--critical)]'
              : isWarning
                ? 'border-l-[3px] border-l-[var(--warning)]'
                : 'border-l-[3px] border-l-[var(--accent)]';

            return (
              <div key={alert.id} className={`card-polar p-4 ${borderClass} space-y-3`}>
                {/* Header row: ID, Timestamp, Station, Equipment, Severity, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
                      {alert.id}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {alert.timestampUtc.substring(11, 16)} UTC
                    </span>
                    <span className="text-[var(--border)]">•</span>
                    <span className="font-medium text-[12px] text-[var(--text-primary)]">
                      {alert.stationId} Station
                    </span>
                    <span className="text-[var(--border)]">•</span>
                    <span className="text-[12px] text-[var(--text-secondary)]">
                      {alert.equipmentName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Severity pattern: reserve small filled chip only for Critical */}
                    {isCritical ? (
                      <span className="px-2 py-0.5 rounded-[2px] bg-[var(--critical)] text-white text-[11px] font-mono font-semibold uppercase tracking-wider">
                        CRITICAL
                      </span>
                    ) : (
                      <span className={`text-[12px] font-mono font-medium ${isWarning ? 'text-[var(--warning)]' : 'text-[var(--accent)]'}`}>
                        {alert.severity}
                      </span>
                    )}

                    {/* Status Text Tag */}
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      alert.status === 'Resolved'
                        ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success-soft)]'
                        : alert.status === 'Active'
                          ? 'border-[var(--critical)] text-[var(--critical)] bg-[var(--critical-soft)]'
                          : 'border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface-subtle)]'
                    }`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                    {alert.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Telemetry Snapshot & Cross-System Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  {/* Telemetry Snapshot */}
                  {alert.telemetrySnapshot && (
                    <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
                      <div className="font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                        Sensor Telemetry Snapshot
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">{alert.telemetrySnapshot.metric}:</span>
                        <div className="font-mono">
                          <span className="text-[var(--critical)] font-semibold">{alert.telemetrySnapshot.value}</span>
                          <span className="text-[var(--text-muted)] ml-1.5">({alert.telemetrySnapshot.threshold})</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cascading Impact Chain */}
                  <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
                    <div className="font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                      Cascading Failure Impact Chain
                    </div>
                    <div className="text-[var(--text-secondary)] font-mono text-[11px] leading-snug">
                      {alert.crossSystemImpact}
                    </div>
                  </div>
                </div>

                {/* Recommended Actions (Numbered List) */}
                <div className="text-[12px]">
                  <div className="font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                    Standard Operating Procedure / Recommended Actions:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[var(--text-secondary)]">
                    {alert.recommendedActions.map((act, idx) => (
                      <li key={idx} className="leading-snug">{act}</li>
                    ))}
                  </ol>
                </div>

                {/* Related Components Tag List */}
                <div className="text-[11px] text-[var(--text-muted)] pt-1">
                  Related: {alert.relatedComponents.join(' · ')}
                </div>

                {/* Incident Timeline Snippet */}
                {alert.timeline && alert.timeline.length > 0 && (
                  <div className="border-t border-[var(--border)] pt-2 text-[11px] font-mono text-[var(--text-muted)] space-y-1">
                    <div className="uppercase font-semibold">Incident Journal:</div>
                    {alert.timeline.map((entry, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2">
                        <span className="text-[var(--text-secondary)] shrink-0">{entry.time}</span>
                        <span>•</span>
                        <span className="text-[var(--text-primary)] font-medium shrink-0">{entry.actor}:</span>
                        <span>{entry.action}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Investigation Notes Box (if toggled) */}
                {investigatingId === alert.id && (
                  <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded space-y-2">
                    <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
                      Log Investigation Assessment ({activeRole})
                    </div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter field assessment, multimeter reading, or thermal probe findings..."
                      rows={2}
                      className="w-full text-[12px] p-2 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setInvestigatingId(null)}
                        className="px-2.5 py-1 text-[11px] rounded border border-[var(--border)] hover:bg-[var(--surface)]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(alert.id)}
                        className="px-2.5 py-1 text-[11px] rounded bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-medium"
                      >
                        Save Note & Update
                      </button>
                    </div>
                  </div>
                )}

                {/* Workflow Action Buttons (Plain outlined, not pill) */}
                <div className="border-t border-[var(--border)] pt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">
                    Assigned: <strong className="text-[var(--text-primary)]">{alert.assignedRole}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status !== 'Acknowledged' && alert.status !== 'Resolved' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-secondary)] transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => {
                          setInvestigatingId(alert.id);
                          setNoteText(alert.investigationNotes || '');
                        }}
                        className="px-2.5 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--accent)] transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Log Notes</span>
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => window.alert(`Alert ${alert.id} snoozed for 60 minutes. Reason: Scheduled maintenance window on auxiliary loop logged.`)}
                        className="px-2 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] text-[var(--text-secondary)] transition-colors"
                      >
                        Snooze (60m)
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-2.5 py-1 rounded-[4px] border border-[var(--success)] text-[var(--success)] hover:bg-[var(--success-soft)] text-[12px] font-medium transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}

                    <button
                      onClick={() => window.alert(`PIR Template Generated for ${alert.id}:\n- Root Cause: Physical parameter divergence\n- Triage Latency: 4.2 min\n- Corrective SOP Executed: SOP-01\n- Recurrence Prevention: Scheduled calibration check`)}
                      className="px-2 py-1 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="Generate Post-Incident Review Draft"
                    >
                      PIR Draft
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
