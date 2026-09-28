import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStation } from '../../context/StationContext';
import { 
  LayoutDashboard, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Radio, 
  GitFork, 
  Cpu, 
  ClipboardCheck, 
  Zap, 
  CloudSnow, 
  Package, 
  BarChart3, 
  BookOpen, 
  Shield, 
  Settings,
  Compass,
  Sliders,
  Atom,
  Network,
  Wrench,
  Users,
  Microscope,
  Globe,
  Share2,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { station, alerts } = useStation();

  const activeAlertsCount = alerts.filter(
    a => a.stationId === station && (a.status === 'Active' || a.status === 'Investigating')
  ).length;

  const navGroups = [
    {
      group: 'OPERATIONS',
      items: [
        { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
        { path: '/digital-twin', label: 'Digital Twin', icon: Layers },
        { path: '/telemetry', label: 'Live Telemetry', icon: Activity },
        { 
          path: '/alerts', 
          label: 'Alerts & Incidents', 
          icon: AlertTriangle,
          badge: activeAlertsCount > 0 ? activeAlertsCount : null
        },
      ]
    },
    {
      group: 'SIMULATION & MULTI-PHYSICS',
      items: [
        { path: '/simulation-lab', label: 'Simulation Lab', icon: Sliders },
        { path: '/physics', label: 'Subsystem Physics', icon: Atom },
        { path: '/coupled', label: 'Coupled Systems', icon: Network },
        { path: '/simulation', label: 'What-If Simulation', icon: Cpu },
      ]
    },
    {
      group: 'RESILIENCE & DECISION',
      items: [
        { path: '/connectivity', label: 'Connectivity Resilience', icon: Radio },
        { path: '/impact', label: 'Impact & Priority Engine', icon: GitFork },
        { path: '/recovery', label: 'Recovery Planner', icon: ClipboardCheck },
        { path: '/coordination', label: 'Multi-Station Coordination', icon: Share2 },
      ]
    },
    {
      group: 'STATION ASSETS & CREW',
      items: [
        { path: '/energy', label: 'Energy & Resources', icon: Zap },
        { path: '/environment', label: 'Environment', icon: CloudSnow },
        { path: '/logistics', label: 'Logistics & Inventory', icon: Package },
        { path: '/lifecycle', label: 'Maintenance & Lifecycle', icon: Wrench },
        { path: '/crew', label: 'Crew & Operations', icon: Users },
        { path: '/science', label: 'Science Payload', icon: Microscope },
        { path: '/geo', label: 'Geographic & Remote', icon: Globe },
      ]
    },
    {
      group: 'GOVERNANCE & REPORTING',
      items: [
        { path: '/analytics', label: 'Analytics & Trends', icon: BarChart3 },
        { path: '/reports', label: 'Report Generator', icon: FileText },
        { path: '/methods', label: 'Methods & Data', icon: BookOpen },
        { path: '/security', label: 'Security & Access', icon: Shield },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-[var(--surface)] border-r border-[var(--border)] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between select-none">
      <div className="py-2 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={group.group} className="mb-2">
            {gIdx > 0 && <div className="mx-3 my-2 border-t border-[var(--border-subtle)]" />}
            <div className="px-4 py-1.5 text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--text-muted)]">
              {group.group}
            </div>
            <nav className="space-y-0.5 px-2">
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-[13px] font-normal transition-colors relative ${
                        isActive
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} strokeWidth={1.5} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="absolute left-0 top-1 bottom-1 w-[2.5px] bg-[var(--accent)] rounded-r" />
                        )}
                        {item.badge !== null && item.badge !== undefined && (
                          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[var(--critical-soft)] text-[var(--critical)] border border-[var(--critical)]/30">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Link to Mission Portal Landing */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-subtle)]">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Mission Gateway & Overview</span>
        </NavLink>
      </div>
    </aside>
  );
};
