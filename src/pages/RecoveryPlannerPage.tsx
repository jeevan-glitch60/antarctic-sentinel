import React, { useState } from 'react';
import { useStation } from '../context/StationContext';
import { RecoverySOP } from '../types';
import { 
  ClipboardCheck, 
  CheckSquare, 
  Square, 
  Clock, 
  Users, 
  ShieldAlert, 
  Package, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const RecoveryPlannerPage: React.FC = () => {
  const { recoverySops, toggleSopStep, inventory, stationData } = useStation();
  const [selectedSopId, setSelectedSopId] = useState<string>(recoverySops[0]?.id || 'SOP-01');

  const selectedSop = recoverySops.find(s => s.id === selectedSopId) || recoverySops[0];

  const handlePrintSOP = () => {
    window.print();
  };

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            Recovery Planner & Standard Operating Procedures
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Step-by-step technical recovery checklists, spare parts validation, and personnel task dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSOP}
            className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[12px] font-medium text-[var(--text-secondary)] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Procedure Card</span>
          </button>
        </div>
      </div>

      {/* SOP SELECTOR TABS */}
      <div className="flex border-b border-[var(--border)] space-x-2 overflow-x-auto pb-1">
        {recoverySops.map(sop => {
          const isActive = sop.id === selectedSopId;
          return (
            <button
              key={sop.id}
              onClick={() => setSelectedSopId(sop.id)}
              className={`px-3 py-2 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{sop.id}:</span>
              <span>{sop.title.slice(0, 32)}...</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
                {sop.progressPercentage}%
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED SOP DETAIL CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column: Interactive SOP Checklist & Safety (8 cols) */}
        <div className="lg:col-span-8 card-polar p-4 space-y-4">
          {/* SOP Header Card */}
          <div className="border-b border-[var(--border)] pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[var(--accent)] font-semibold uppercase">
                PROCEDURE ID: {selectedSop.id} · TARGET: {selectedSop.equipmentId.toUpperCase()}
              </span>
              <span className="font-mono text-[12px] text-[var(--critical)] font-medium">
                {selectedSop.severity} Priority
              </span>
            </div>
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)] mt-1">
              {selectedSop.title}
            </h2>

            {/* Time to restore estimation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-[12px]">
              <div className="p-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Partial Recovery (Normal Load)</div>
                <div className="font-mono font-semibold text-[14px] text-[var(--text-primary)] mt-0.5">
                  {selectedSop.estimatedTimeMin}–{selectedSop.estimatedTimeMin + 2} Hours
                </div>
              </div>
              <div className="p-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Full Redundancy Restoration</div>
                <div className="font-mono font-semibold text-[14px] text-[var(--text-primary)] mt-0.5">
                  {selectedSop.estimatedTimeFull}–{selectedSop.estimatedTimeFull + 4} Hours
                </div>
              </div>
              <div className="p-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Execution Progress</div>
                <div className="font-mono font-semibold text-[14px] text-[var(--accent)] mt-0.5">
                  {selectedSop.progressPercentage}% Completed
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[var(--border)] rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${selectedSop.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Interactive SOP Checklist */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase font-mono text-[var(--text-muted)] mb-2">
              Actionable Execution Steps (Check to Validate):
            </h3>

            <div className="space-y-2">
              {selectedSop.steps.map(step => (
                <div
                  key={step.stepNumber}
                  onClick={() => toggleSopStep(selectedSop.id, step.stepNumber)}
                  className={`p-3 rounded border cursor-pointer transition-colors text-[13px] flex items-start gap-3 ${
                    step.completed
                      ? 'bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--text-muted)]'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                  }`}
                >
                  <button className="mt-0.5 text-[var(--accent)] shrink-0">
                    {step.completed ? (
                      <CheckSquare className="w-4 h-4 text-[var(--success)]" />
                    ) : (
                      <Square className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="leading-snug">
                      <strong className="mr-1.5 font-mono">Step {step.stepNumber}:</strong>
                      <span className={step.completed ? 'line-through text-[var(--text-muted)]' : ''}>
                        {step.instruction}
                      </span>
                    </div>

                    {step.cautionNote && (
                      <div className="text-[11px] text-[var(--critical)] bg-[var(--critical-soft)] border-l-[2px] border-l-[var(--critical)] p-1.5 rounded-r">
                        <strong>CAUTION:</strong> {step.cautionNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extreme Cold Safety Protocols */}
          <div className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded text-[12px] space-y-1.5">
            <div className="font-mono text-[11px] uppercase text-[var(--warning)] font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Mandatory Polar Safety Directives (NCPOR Safety Spec 4):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
              {selectedSop.safetyProtocols.map((protocol, pIdx) => (
                <li key={pIdx} className="leading-snug">{protocol}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Required Spares & Certified Crew Assignment (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Required Spares Stock Validation */}
          <div className="card-polar p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Required Spare Parts
              </h3>
              <Package className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            <div className="space-y-2 text-[12px]">
              {selectedSop.requiredSpares.length > 0 ? (
                selectedSop.requiredSpares.map(spare => {
                  const isAvailable = spare.qtyAvailable >= spare.qtyRequired;
                  return (
                    <div key={spare.partNumber} className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded">
                      <div className="flex justify-between font-medium text-[var(--text-primary)]">
                        <span>{spare.name}</span>
                        <span className={`font-mono ${isAvailable ? 'text-[var(--success)]' : 'text-[var(--critical)] font-bold'}`}>
                          {spare.qtyAvailable} / {spare.qtyRequired} Req
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                        PN: {spare.partNumber} · Status: {isAvailable ? 'Available in Bin' : 'SHORTAGE ALERT'}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-[var(--text-muted)] py-4">
                  No replacement hardware required for this SOP.
                </div>
              )}
            </div>
          </div>

          {/* Assigned Personnel & Polar Certification */}
          <div className="card-polar p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Personnel Task Assignment &amp; Resource Leveling
              </h3>
              <Users className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            <div className="space-y-2 text-[12px]">
              {selectedSop.assignedPersonnel.map(person => (
                <div key={person.name} className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{person.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text-muted)]">{person.role} · Level: T+0 to T+90m</div>
                  </div>
                  {person.certified && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--success)] text-[var(--success)] bg-[var(--success-soft)]">
                      CERTIFIED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Cost & Resource Impact Card */}
          <div className="card-polar p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
              <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Estimated Recovery Cost &amp; Impact
              </h4>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">BUDGET ESTIMATE</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] bg-[var(--surface-subtle)] p-2.5 rounded border border-[var(--border)]">
              <div className="flex justify-between">
                <span>Crew Work Hours:</span>
                <span className="text-[var(--text-primary)] font-semibold">6.5 Person-Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Burn Penalty:</span>
                <span className="text-amber-700 font-semibold">+38.0 L Diesel (Bypass)</span>
              </div>
              <div className="flex justify-between">
                <span>Parts Consumed:</span>
                <span className="text-[var(--text-primary)]">1x Nozzle Kit ($420)</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
                <span>Rollback Capability:</span>
                <span className="text-emerald-700 font-semibold">SAFE TO REVERT</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Procedure ${selectedSop.id} rolled back to previous safe state. Isolated lines re-pressurized and logged to incident journal.`)}
              className="w-full py-1.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--text-muted)] hover:text-rose-600 transition-colors"
            >
              ↩ Rollback Procedure to Safe State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
