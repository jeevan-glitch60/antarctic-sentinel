import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStation } from '../context/StationContext';
import { 
  Compass, 
  Layers, 
  Activity, 
  GitFork, 
  Cpu, 
  ClipboardCheck, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setStation } = useStation();

  const handleLaunchStation = (st: 'MAITRI' | 'BHARATI') => {
    setStation(st);
    navigate('/dashboard');
  };

  const workflowSteps = [
    { name: 'Monitor', desc: 'Real-time telemetry from microgrids, boilers, and polar environment.' },
    { name: 'Detect', desc: 'Predictive anomaly alerts for mechanical vibration and thermal drift.' },
    { name: 'Prioritize', desc: 'Multi-criteria decision analysis (MCDA) for safety and freeze risk.' },
    { name: 'Simulate', desc: 'What-if digital twin projections of thermal decay and battery autonomy.' },
    { name: 'Plan', desc: 'Standard operating procedure checklists with inventory parts verification.' },
    { name: 'Respond', desc: 'Targeted remote command dispatch and expedition crew coordination.' }
  ];

  const primaryQuestions = [
    '1. What is happening at Maitri or Bharati right now?',
    '2. Which equipment or subsystem is affected?',
    '3. How severe is the problem?',
    '4. What station systems depend on it?',
    '5. Does the issue affect safety, heating, power, communications, science operations, or logistics?',
    '6. What resources are needed to recover?',
    '7. What should the remote team do next?'
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto select-none py-2">
      {/* INSTITUTIONAL HERO SECTION */}
      <div className="card-polar p-6 md:p-8 space-y-4 border-l-[4px] border-l-[var(--accent)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-subtle)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] font-semibold">
            <Compass className="w-4 h-4" />
            <span>INDIAN ANTARCTIC RESEARCH PROGRAMME · MISSION OPERATIONS CONSOLE</span>
          </div>
          <div className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
            VERSION 0.1 · RESEARCH DEMONSTRATOR
          </div>
        </div>

        <div>
          <h1 className="text-[28px] md:text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">
            ANTARCTIC SENTINEL
          </h1>
          <p className="text-[16px] md:text-[18px] text-[var(--accent)] font-medium mt-1">
            "From Remote Monitoring to Intelligent Station Management."
          </p>
        </div>

        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          <strong>ANTARCTIC SENTINEL</strong> is a Digital Twin–based remote monitoring, operations, resilience, maintenance, logistics, and decision-support platform for Indian Antarctic research stations. The platform provides a unified operational view of two simulated Antarctic stations — <strong>Maitri</strong> and <strong>Bharati</strong> — combining infrastructure monitoring, energy and resource tracking, equipment health, environmental conditions, connectivity resilience, cross-system impact analysis, what-if simulation, repair planning, inventory visibility, and audit trails into one calm, institutional console.
        </p>

        {/* Quick Launch Buttons */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => handleLaunchStation('MAITRI')}
            className="px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] font-medium rounded-[4px] text-[13px] flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Launch Maitri Console (MTR-01)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleLaunchStation('BHARATI')}
            className="px-4 py-2 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-primary)] font-medium text-[13px] flex items-center gap-2 transition-colors"
          >
            <span>Launch Bharati Console (BHR-01)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setStation('MAITRI');
              navigate('/digital-twin');
            }}
            className="px-4 py-2 rounded-[4px] border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-medium text-[13px] flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            <span>Interactive Digital Twin</span>
          </button>
        </div>
      </div>

      {/* TWO STATION COMPARISON SHOWCASE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maitri Station Card */}
        <div className="card-polar p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div>
                <span className="font-mono text-[11px] text-[var(--accent)] font-semibold uppercase">Station Code: MTR-01</span>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mt-0.5">Maitri Research Station</h3>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)] font-medium">
                Operational
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Location:</span>
                <span className="text-[var(--text-primary)]">Schirmacher Oasis, Queen Maud Land</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Geographic Coordinates:</span>
                <span className="font-mono text-[var(--text-primary)]">70° 45′ S · 11° 44′ E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Altitude / Elevation:</span>
                <span className="font-mono text-[var(--text-primary)]">1,610 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Terrain Characteristics:</span>
                <span className="text-[var(--text-primary)]">Inland nunatak oasis & Lake Priyadarshini</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Architecture:</span>
                <span className="text-[var(--text-primary)]">Insulated container modules on rock bed</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleLaunchStation('MAITRI')}
            className="w-full py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-[4px] text-[13px] font-medium transition-colors"
          >
            Enter Maitri Command Console →
          </button>
        </div>

        {/* Bharati Station Card */}
        <div className="card-polar p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div>
                <span className="font-mono text-[11px] text-[var(--accent)] font-semibold uppercase">Station Code: BHR-01</span>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mt-0.5">Bharati Research Station</h3>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)] font-medium">
                Operational
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Location:</span>
                <span className="text-[var(--text-primary)]">Larsemann Hills, East Antarctica</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Geographic Coordinates:</span>
                <span className="font-mono text-[var(--text-primary)]">69° 24′ S · 76° 11′ E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Altitude / Elevation:</span>
                <span className="font-mono text-[var(--text-primary)]">~35 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Terrain Characteristics:</span>
                <span className="text-[var(--text-primary)]">Coastal promontory & Prydz Bay sea margin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Architecture:</span>
                <span className="text-[var(--text-primary)]">Elevated stilted aerodynamic modular envelope</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleLaunchStation('BHARATI')}
            className="w-full py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-[4px] text-[13px] font-medium transition-colors"
          >
            Enter Bharati Command Console →
          </button>
        </div>
      </div>

      {/* CORE WORKFLOW: MONITOR -> DETECT -> PRIORITIZE -> SIMULATE -> PLAN -> RESPOND */}
      <div className="card-polar p-5 space-y-3">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          Platform Operational Workflow: Monitor → Detect → Prioritize → Simulate → Plan → Respond
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
          {workflowSteps.map((wf, idx) => (
            <div key={wf.name} className="p-3 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-[4px]">
              <div className="font-mono text-[11px] text-[var(--accent)] font-semibold">
                STEP 0{idx + 1}
              </div>
              <div className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">
                {wf.name}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
                {wf.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY QUESTIONS ANSWERED BY THE PLATFORM */}
      <div className="card-polar p-5 space-y-3">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
          Operational Inquiries Answered by the Sentinel Console
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px]">
          {primaryQuestions.map((q, idx) => (
            <div key={idx} className="p-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span className="text-[var(--text-primary)] font-medium">{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
